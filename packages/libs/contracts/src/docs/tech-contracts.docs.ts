import type { DocBlock } from './types';

export const techContractsDocs: DocBlock[] = [
  {
    id: 'docs.tech.contracts.presentations-v2',
    title: 'Presentations V2 — Unified Descriptor & Transform Engine',
    summary:
      'How PresentationDescriptorV2 and TransformEngine keep docs/renderers consistent.',
    visibility: 'public',
    route: '/docs/tech/contracts/presentations-v2',
    kind: 'reference',
    tags: ['presentations', 'docs', 'mcp'],
    body: `## Presentations V2 — Unified Descriptor & Transform Engine

### Purpose

Unify presentations into one descriptor (\`PresentationDescriptorV2\`) that declares a single source (React component key or BlockNote doc) and a list of output targets (react, markdown, application/json, application/xml). A pluggable \`TransformEngine\` renders any target and applies PII redaction.

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

interface PresentationDescriptorV2 {
  meta: PresentationV2Meta; // includes partial OwnerShipMeta + description
  policy?: { flags?: string[]; pii?: string[] };
  source: PresentationSource;
  targets: PresentationTarget[];
}

// Shared ownership schema (source of truth in @lssm/lib.contracts/src/ownership.ts)
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

// For V2 presentations, meta is a Partial<OwnerShipMeta> plus description, name, version
interface PresentationV2Meta extends Partial<OwnerShipMeta> {
  name: string;
  version: number;
  description?: string;
}
\`\`\`

### Engine

Use \`createDefaultTransformEngine()\` and register custom renderers as needed (e.g., high-fidelity BlockNote → Markdown). The default engine supports markdown/json/xml; a React renderer returns a serializable descriptor the host app renders via a \`componentMap\` or a BlockNote renderer. The canonical source type string is \`blocknotejs\` (not \`blocknote\`).

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




