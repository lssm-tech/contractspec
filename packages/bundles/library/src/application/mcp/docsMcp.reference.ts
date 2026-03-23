import type {
	AnyEventSpec,
	AnyOperationSpec,
	FormSpec,
} from '@contractspec/lib.contracts-spec';
import type { DataViewSpec } from '@contractspec/lib.contracts-spec/data-views';
import { defaultDocRegistry } from '@contractspec/lib.contracts-spec/docs';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import {
	resolveDataViewSpec,
	resolveEventSpec,
	resolveFormSpec,
	resolveOperationSpec,
	resolvePresentationSpec,
	resolveSerializedDataViewSpec,
	resolveSerializedEventSpec,
	resolveSerializedFormSpec,
	resolveSerializedOperationSpec,
	resolveSerializedPresentationSpec,
} from '../../features/contracts-registry';

interface ContractReferenceArgs {
	key: string;
	version?: string;
	type?: string;
	format?: string;
	includeSchema?: boolean;
}

function normalizeText(value: string | undefined | null) {
	return value?.trim().toLowerCase() ?? '';
}

function routeFromDocIds(docIds: string[] | undefined) {
	for (const docId of docIds ?? []) {
		const doc = defaultDocRegistry.get(docId);
		if (doc) return doc.route;
	}
	return undefined;
}

function toReference(
	spec:
		| AnyOperationSpec
		| AnyEventSpec
		| PresentationSpec
		| DataViewSpec
		| FormSpec,
	type: string,
	schema: unknown,
	policy?: unknown
) {
	const title = spec.meta.title ?? spec.meta.key;
	const route = routeFromDocIds(spec.meta.docId);
	const description = spec.meta.description;

	return {
		key: spec.meta.key,
		version: spec.meta.version,
		type,
		title,
		description,
		markdown: [
			`# ${title}`,
			`- Key: ${spec.meta.key}`,
			`- Type: ${type}`,
			`- Version: ${spec.meta.version}`,
			route ? `- Docs route: ${route}` : '',
			description ? `\n${description}` : '',
		]
			.filter(Boolean)
			.join('\n'),
		...(route ? { route } : {}),
		...(schema ? { schema } : {}),
		...(policy ? { policy } : {}),
		tags: spec.meta.tags ?? [],
		owners: spec.meta.owners ?? [],
		stability: spec.meta.stability,
	};
}

export function resolveContractReference(args: ContractReferenceArgs) {
	const includeSchema = args.includeSchema ?? false;
	const requestedType = normalizeText(args.type);

	const operation = resolveOperationSpec(args.key, args.version);
	if (
		operation &&
		(!requestedType ||
			requestedType === 'operation' ||
			requestedType === operation.meta.kind)
	) {
		return {
			reference: toReference(
				operation,
				operation.meta.kind,
				includeSchema
					? resolveSerializedOperationSpec(args.key, args.version)
					: undefined,
				operation.policy
			),
		};
	}

	const resolvers = [
		{
			type: 'data-view',
			spec: resolveDataViewSpec(args.key, args.version),
			schema: includeSchema
				? resolveSerializedDataViewSpec(args.key, args.version)
				: undefined,
		},
		{
			type: 'form',
			spec: resolveFormSpec(args.key, args.version),
			schema: includeSchema
				? resolveSerializedFormSpec(args.key, args.version)
				: undefined,
		},
		{
			type: 'presentation',
			spec: resolvePresentationSpec(args.key, args.version),
			schema: includeSchema
				? resolveSerializedPresentationSpec(args.key, args.version)
				: undefined,
		},
		{
			type: 'event',
			spec: resolveEventSpec(args.key, args.version),
			schema: includeSchema
				? resolveSerializedEventSpec(args.key, args.version)
				: undefined,
		},
	] as const;

	for (const candidate of resolvers) {
		if (
			candidate.spec &&
			(!requestedType || requestedType === candidate.type)
		) {
			return {
				reference: toReference(
					candidate.spec,
					candidate.type,
					candidate.schema
				),
			};
		}
	}

	throw new Error(`Contract reference not found: ${args.key}`);
}
