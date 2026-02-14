import type {
  MutationFieldThunk,
  QueryFieldThunk,
  SchemaTypes,
} from '@pothos/core';
import type {
  EventPublisher,
  HandlerCtx,
} from '@contractspec/lib.contracts-spec/types';
import { defaultGqlField } from '@contractspec/lib.contracts-spec/jsonschema';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import '@pothos/plugin-prisma';
import '@pothos/plugin-complexity';
import '@pothos/plugin-relay';
import '@pothos/plugin-dataloader';
import '@pothos/plugin-tracing';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import { isSchemaModel } from '@contractspec/lib.schema';
import type {
  ResourceRefDescriptor,
  ResourceRegistry,
} from '@contractspec/lib.contracts-spec/resources';
import { createInputTypeBuilder } from '@contractspec/lib.contracts-runtime-server-rest/contracts-adapter-input';
import type { AnyOperationSpec } from '@contractspec/lib.contracts-spec/operations';
import {
  hydrateResourceIfNeeded,
  parseReturns,
} from '@contractspec/lib.contracts-runtime-server-rest/contracts-adapter-hydration';

export function registerContractsOnBuilder<T extends SchemaTypes>(
  builder: PothosSchemaTypes.SchemaBuilder<T>,
  reg: OperationSpecRegistry,
  resources?: ResourceRegistry
) {
  const { buildInputFieldArgs } = createInputTypeBuilder(builder);

  const outputTypeCache = new Map<string, AnySchemaModel>();
  for (const spec of reg.list()) {
    const out = spec.io.output as
      | AnySchemaModel
      | ResourceRefDescriptor<boolean>;
    if (out && 'getZod' in out && typeof out.getZod === 'function') {
      const model = out as AnySchemaModel;
      const typeName = isSchemaModel(model)
        ? model.config?.name
        : 'UnknownOutput';
      if (typeName && !outputTypeCache.has(typeName)) {
        outputTypeCache.set(typeName, model);
      }
    }
  }

  for (const [typeName, model] of outputTypeCache.entries()) {
    if (!isSchemaModel(model)) continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.objectType(typeName as any, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: (t: any) => {
        const entries = Object.entries(model.config.fields) as [
          string,
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: any;
            isOptional: boolean;
            isArray?: boolean;
          },
        ][];
        const acc: Record<string, unknown> = {};
        for (const [key, field] of entries) {
          const fieldType = field.type;
          let gqlType = 'JSON';

          if (fieldType && typeof fieldType.getPothos === 'function') {
            const pothosInfo = fieldType.getPothos();
            gqlType = pothosInfo.name || 'JSON';
            if (gqlType === 'String_unsecure') gqlType = 'String';
            if (gqlType === 'Int_unsecure') gqlType = 'Int';
            if (gqlType === 'Float_unsecure') gqlType = 'Float';
            if (gqlType === 'Boolean_unsecure') gqlType = 'Boolean';
            if (gqlType === 'ID_unsecure') gqlType = 'ID';
          }

          const typeRef = field.isArray
            ? ([gqlType] as never)
            : (gqlType as never);
          acc[key] = t.field({
            type: typeRef,
            nullable: field.isOptional,
            resolve: (parent: Record<string, unknown>) => parent[key],
          });
        }
        return acc as never;
      },
    });
  }

  function resolveGraphQLTypeName(contractSpec: AnyOperationSpec): string {
    const returnsName = contractSpec.transport?.gql?.returns;
    if (returnsName) return returnsName;

    const out = contractSpec.io.output ?? {};

    if (
      out &&
      'kind' in out &&
      out.kind === 'resource_ref' &&
      'graphQLType' in out &&
      out.graphQLType
    ) {
      return String(out.graphQLType);
    }

    if (out && 'getZod' in out && typeof out.getZod === 'function') {
      const model = out as AnySchemaModel;
      if (isSchemaModel(model)) {
        const typeName = model.config?.name;
        if (typeName && outputTypeCache.has(typeName)) {
          return typeName;
        }
      }
    }

    return 'JSON';
  }

  for (const spec of reg.list()) {
    const fieldName =
      spec.transport?.gql?.field ??
      defaultGqlField(spec.meta.key, spec.meta.version);
    const byIdField =
      (spec.transport as unknown as { gql?: { byIdField?: string } })?.gql
        ?.byIdField ?? 'id';
    const returnsResource = (
      spec.transport as unknown as { gql?: { resource?: string } }
    )?.gql?.resource;
    const isQuery = spec.meta.kind === 'query';

    const graphQLTypeName = resolveGraphQLTypeName(spec);
    const returnsDecl = (
      spec.transport as unknown as { gql?: { returns?: string } }
    )?.gql?.returns;
    const parsed = parseReturns(returnsDecl ?? graphQLTypeName);

    const resolveFieldFn = async (
      _root: unknown,
      args: { input?: unknown },
      ctx: {
        user?: { id: string };
        logger?: { getTraceId?: () => string };
        session?: { activeOrganizationId?: string };
        eventPublisher: EventPublisher;
      }
    ) => {
      if (spec.policy.auth !== 'anonymous' && !ctx.user)
        throw new Error('Unauthorized');
      const handlerCtx: HandlerCtx = {
        traceId: ctx.logger?.getTraceId?.() ?? undefined,
        userId: ctx.user?.id ?? null,
        organizationId: ctx.session?.activeOrganizationId ?? null,
        actor: ctx.user ? 'user' : 'anonymous',
        channel: 'web',
        eventPublisher: ctx.eventPublisher,
      };
      const parsedInput = spec.io.input?.getZod().parse(args.input ?? {});
      const result: unknown = await reg.execute(
        spec.meta.key,
        spec.meta.version,
        parsedInput,
        handlerCtx
      );
      const out = spec.io.output as unknown;
      if (
        resources &&
        (returnsResource || (out as { kind?: string })?.kind === 'resource_ref')
      ) {
        const varName =
          byIdField ?? (out as { varName?: string })?.varName ?? 'id';
        const template =
          returnsResource ?? (out as { uriTemplate?: string })?.uriTemplate;
        const hydrated = await hydrateResourceIfNeeded(resources, result, {
          template,
          varName,
          returns: parsed,
        });
        if (hydrated !== result) return hydrated as never;
      }
      if (graphQLTypeName) {
        if (parsed.inner === 'Boolean' && !parsed.isList) {
          return Boolean((result as { ok?: boolean })?.ok ?? result) as never;
        }
        return result as unknown as never;
      }
      const parsedOut: unknown = (spec.io.output as AnySchemaModel)
        .getZod()
        .parse(result);
      return parsedOut as never;
    };

    const fieldSettingsFn: QueryFieldThunk<T> | MutationFieldThunk<T> = (
      t: PothosSchemaTypes.MutationFieldBuilder<T, T['Root']>
    ) => {
      const inputType = buildInputFieldArgs(spec.io.input);
      return t.field({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: (parsed.isList ? [parsed.inner] : parsed.inner) as any,
        complexity: () => 10,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve: resolveFieldFn as any,
        args: inputType
          ? {
              input: t.arg({
                type: inputType,
                required: true,
              }),
            }
          : undefined,
      });
    };

    if (isQuery) {
      builder.queryField(
        fieldName,
        fieldSettingsFn as never as QueryFieldThunk<T>
      );
    } else {
      builder.mutationField(
        fieldName,
        fieldSettingsFn as MutationFieldThunk<T>
      );
    }
  }
}
