import type { AnySchemaModel } from '@contractspec/lib.schema';
import type { CapabilityRef } from '../capabilities/capabilities';
import type { DocBlock } from '../docs/types';
import type { OwnerShipMeta } from '../ownership';
import type { BlockConfig } from './shim-blocknotejs';

export type { BlockConfig } from './shim-blocknotejs';

/** Supported render targets for the transform engine and descriptors. */
export type PresentationTarget =
	| 'react'
	| 'markdown'
	| 'application/json'
	| 'application/xml';

export interface PresentationSpecMeta extends OwnerShipMeta {
	/** Business goal: why this exists */
	goal: string;
	/** Background, constraints, scope edges (feeds docs & LLM context) */
	context: string;
}

/** React component presentation source. */
export interface PresentationSourceComponentReact {
	/** Source marker for React component presentations. */
	type: 'component';
	/** Framework for the component source (currently only 'react'). */
	framework: 'react';
	/** Component key resolved by host `componentMap`. */
	componentKey: string;
	/** Optional props schema to validate against. */
	props?: AnySchemaModel;
}

/** BlockNoteJS document presentation source. */
export interface PresentationSourceBlocknotejs {
	/** Source marker for BlockNoteJS document presentations. */
	type: 'blocknotejs';
	/** BlockNoteJS JSON document. */
	docJson: unknown;
	/** Optional BlockNote config to guide rendering. */
	blockConfig?: BlockConfig;
}

export type PresentationSource =
	| PresentationSourceComponentReact
	| PresentationSourceBlocknotejs;

/**
 * Normalized presentation spec decoupled from framework/adapters.
 * Renderers and validators are provided via TransformEngine.
 */
export interface PresentationSpec {
	meta: PresentationSpecMeta;
	/**
	 * Optional reference to the capability that provides this presentation.
	 * Used for bidirectional linking between capabilities and presentations.
	 */
	capability?: CapabilityRef;
	policy?: { flags?: string[]; pii?: string[] };
	source: PresentationSource;
	targets: PresentationTarget[]; // which outputs are supported by transforms
}

export const definePresentation = (spec: PresentationSpec) => {
	return spec;
};

export const tech_contracts_presentations_conventions_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.presentations-conventions',
		title: 'Presentations Conventions (A11y & i18n)',
		summary:
			'- Always provide `meta.description` (\u2265 3 chars) \u2014 used by a11y/docs/agents.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/presentations-conventions',
		tags: ['tech', 'contracts', 'presentations-conventions'],
		body: '## Presentations Conventions (A11y & i18n)\n\n- Always provide `meta.description` (\u2265 3 chars) \u2014 used by a11y/docs/agents.\n- Prefer source = BlockNote for rich guides; use component key for interactive flows.\n- i18n strings belong in host apps; descriptors carry keys/defaults only.\n- Target selection: include only what you intend to support to avoid drift.\n- PII: declare JSON-like paths under `policy.pii`; engine redacts in outputs.\n',
	},
];

export const techContractsDocs: DocBlock[] = [
	{
		id: 'docs.tech.contracts.presentations',
		title: 'Presentations — Unified Descriptor & Transform Engine',
		summary:
			'How PresentationSpec and TransformEngine keep docs/renderers consistent.',
		visibility: 'public',
		route: '/docs/tech/contracts/presentations',
		kind: 'reference',
		tags: ['presentations', 'docs', 'mcp'],
		body: `## Presentations V2 — Unified Descriptor & Transform Engine

### Purpose

Unify presentations into one descriptor (\`PresentationSpec\`) that declares a single source (React component key or BlockNote doc) and a list of output targets (react, markdown, application/json, application/xml). A pluggable \`TransformEngine\` renders any target and applies PII redaction.

### Types

\`\`\`ts
type PresentationTarget =
  | 'react'
  | 'markdown'
  | 'application/json'
  | 'application/xml';

type PresentationSource =
  | {
      type: 'component';
      framework: 'react';
      componentKey: string;
      props?: AnySchemaModel;
    }
  | { type: 'blocknotejs'; docJson: unknown; blockConfig?: unknown };

interface PresentationSpec {
  meta: PresentationMeta; // includes partial OwnerShipMeta + description
  policy?: { flags?: string[]; pii?: string[] };
  source: PresentationSource;
  targets: PresentationTarget[];
}

// Shared ownership schema (source of truth in @contractspec/lib.contracts-spec/src/ownership.ts)
interface OwnerShipMeta {
  title: string;
  description: string;
  domain: string;
  owners: Owner[];
  tags: Tag[];
  stability: Stability;
}

type Stability = 'experimental' | 'beta' | 'stable' | 'deprecated';
type Owner = string; // curated list available in code (e.g., '@sigil-team', 'team-strit')
type Tag = string; // curated list available in code (e.g., 'auth', 'spots')

// For presentations, meta is a Partial<OwnerShipMeta> plus description, name, version
interface PresentationMeta extends Partial<OwnerShipMeta> {
  name: string;
  version: string;
  description?: string;
}
\`\`\`

### Engine

Use \`createDefaultTransformEngine()\` from \`@contractspec/lib.presentation-runtime-core/transform-engine\` and register custom renderers as needed. React hosts add \`registerDefaultReactRenderer()\` from \`@contractspec/lib.contracts-runtime-client-react/transform-engine\`. The core engine supports markdown/json/xml; the React renderer returns a serializable descriptor the host app renders via a \`componentMap\` or a BlockNote renderer. The canonical source type string is \`blocknotejs\` (not \`blocknote\`).

PII paths (JSON-like) are redacted from rendered outputs.

### MCP Integration

\`createMcpServer\` accepts \`presentationsV2\`. Each descriptor is exposed under \`presentation://<name>/v<version>\` and negotiated variants (\`.md/.json/.xml\`) are rendered by the engine.

### Migration

- V1 \`PresentationSpec\` remains supported; a back-compat helper converts V1 → V2 when convenient.
- Prefer V2 for new work.

### Examples (Sigil)

- \`sigil.auth.webauth_tabs_v2\`: component source (\`componentKey: 'sigil.webauth.tabs'\`), targets \`react/json/xml\`.
- \`sigil.signup.guide_v2\`: BlockNote doc source, targets \`react/markdown/json/xml\`.

### React Rendering

Host apps use a \`componentMap\` (e.g., \`'sigil.webauth.tabs' → WebAuthTabs\`) and a BlockNote renderer to turn the React render descriptor into elements.`,
	},
];
