import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

export const personalization_overlay_engine_DocBlocks: DocBlock[] = [
  {
    id: 'docs.personalization.overlay-engine',
    title: 'Overlay Engine',
    summary:
      '`@contractspec/lib.overlay-engine` is the canonical runtime for OverlaySpecs. It validates specs, tracks scope precedence, and exposes hooks for React renderers.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/personalization/overlay-engine',
    tags: ['personalization', 'overlay-engine'],
    body: "# Overlay Engine\n\n`@contractspec/lib.overlay-engine` is the canonical runtime for OverlaySpecs. It validates specs, tracks scope precedence, and exposes hooks for React renderers.\n\n## Key APIs\n\n- `defineOverlay(spec)` \u2013 helper to keep specs typed.\n- `OverlayRegistry` \u2013 register signed overlays and retrieve them per context.\n- `OverlayEngine` \u2013 apply overlays to renderable targets, emit audit events, and merge modifications deterministically.\n- `signOverlay(spec, privateKey)` \u2013 Ed25519/RSA-PSS signer.\n- `verifyOverlaySignature(overlay)` \u2013 verify public key signatures.\n- `useOverlay(engine, params)` \u2013 client hook that returns `{ target, overlaysApplied }`.\n\n## Scope Precedence\n\nRegistrations are sorted by specificity:\n\n1. Tenant overlays\n2. Role overlays\n3. User overlays\n4. Device overlays\n\nLess specific overlays run first; more specific overlays override later.\n\n## Example\n\n```ts\nconst registry = new OverlayRegistry();\nconst engine = new OverlayEngine({\n  registry,\n  audit: (event) => auditLogService.record(event),\n});\n\nconst overlay = defineOverlay({\n  overlayId: 'acme-order-form',\n  version: '1.0.0',\n  appliesTo: {\n    capability: 'billing.createOrder',\n    tenantId: 'acme',\n  },\n  modifications: [\n    { type: 'hideField', field: 'internalNotes' },\n    { type: 'renameLabel', field: 'customerReference', newLabel: 'PO Number' },\n  ],\n});\n\nconst signedOverlay = await signOverlay(overlay, privateKeyPem);\nregistry.register(signedOverlay);\n\nconst result = engine.apply({\n  target: { fields: baseFields },\n  capability: 'billing.createOrder',\n  tenantId: 'acme',\n  userId: 'manager-7',\n});\n```\n\n`result.target.fields` now carries the hidden and renamed outputs ready for rendering.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  },
];
registerDocBlocks(personalization_overlay_engine_DocBlocks);
