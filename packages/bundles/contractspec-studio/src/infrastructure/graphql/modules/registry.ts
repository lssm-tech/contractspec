import { gqlSchemaBuilder } from '../builder';
import type { Logger } from '@lssm/lib.logger';
import { ContractSpecRegistryClient } from '../../../templates/registry-client';

type RegistryTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  source: 'registry';
  registryUrl: string | null;
};

export function registerRegistrySchema(builder: typeof gqlSchemaBuilder) {
  const RegistryTemplateType = builder
    .objectRef<RegistryTemplate>('RegistryTemplate')
    .implement({
      fields: (t) => ({
        id: t.exposeString('id'),
        name: t.exposeString('name'),
        description: t.exposeString('description'),
        tags: t.exposeStringList('tags'),
        source: t.exposeString('source'),
        registryUrl: t.exposeString('registryUrl', { nullable: true }),
      }),
    });

  builder.queryFields((t) => ({
    registryTemplates: t.field({
      type: [RegistryTemplateType],
      resolve: async (_root, _args, ctx) => {
        const logger: Logger | undefined = (ctx as { logger?: Logger }).logger;
        const registryUrl =
          process.env.CONTRACTSPEC_REGISTRY_URL ??
          process.env.NEXT_PUBLIC_CONTRACTSPEC_REGISTRY_URL ??
          '';

        if (!registryUrl) return [];

        try {
          const client = new ContractSpecRegistryClient({ registryUrl });
          const templates = await client.listTemplateSummaries();
          return templates.map((t) => ({
            id: t.id,
            name: t.title,
            description: t.description,
            tags: t.tags,
            source: 'registry' as const,
            registryUrl,
          }));
        } catch (error) {
          logger?.warn?.('registryTemplates.failed', {
            message: error instanceof Error ? error.message : String(error),
          });
          return [];
        }
      },
    }),
    registryTemplate: t.field({
      type: RegistryTemplateType,
      nullable: true,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        const logger: Logger | undefined = (ctx as { logger?: Logger }).logger;
        const registryUrl =
          process.env.CONTRACTSPEC_REGISTRY_URL ??
          process.env.NEXT_PUBLIC_CONTRACTSPEC_REGISTRY_URL ??
          '';
        if (!registryUrl) return null;

        try {
          const client = new ContractSpecRegistryClient({ registryUrl });
          const templates = await client.listTemplateSummaries();
          const found = templates.find((t) => t.id === args.id);
          if (!found) return null;
          return {
            id: found.id,
            name: found.title,
            description: found.description,
            tags: found.tags,
            source: 'registry' as const,
            registryUrl,
          };
        } catch (error) {
          logger?.warn?.('registryTemplate.failed', {
            message: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      },
    }),
  }));
}


