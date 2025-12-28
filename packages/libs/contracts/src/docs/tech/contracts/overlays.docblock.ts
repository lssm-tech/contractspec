import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_contracts_overlays_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.contracts.overlays',
    title: 'OverlaySpec Implementation',
    summary:
      'OverlaySpecs allow tenants/users to adapt presentation without duplicating code. Implementation lives in `@contractspec/lib.overlay-engine`.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/contracts/overlays',
    tags: ['tech', 'contracts', 'overlays'],
    body: "# OverlaySpec Implementation\n\nOverlaySpecs allow tenants/users to adapt presentation without duplicating code. Implementation lives in `@contractspec/lib.overlay-engine`.\n\n## Structure\n\n```ts\ninterface OverlaySpec {\n  overlayId: string;\n  version: string;\n  appliesTo: {\n    capability?: string;\n    workflow?: string;\n    dataView?: string;\n    presentation?: string;\n    tenantId?: string;\n    userId?: string;\n    role?: string;\n    device?: string;\n  };\n  modifications: OverlayModification[];\n}\n```\n\nSupported modifications:\n\n- `hideField`\n- `renameLabel`\n- `reorderFields`\n- `setDefault`\n- `addHelpText`\n- `makeRequired`\n\n## Signing\n\nOverlays must be signed. Use the signer helper:\n\n```ts\nimport { signOverlay } from '@contractspec/lib.overlay-engine/signer';\n\nconst signed = await signOverlay(overlay, privateKeyPem);\nregistry.register(signed);\n```\n\nKeys are stored in `OverlaySigningKey` (Prisma) and referenced by the `Overlay` model for auditing.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  },
];
registerDocBlocks(tech_contracts_overlays_DocBlocks);
