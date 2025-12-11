import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../registry';

export const tech_PHASE_4_PERSONALIZATION_ENGINE_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.PHASE_4_PERSONALIZATION_ENGINE',
    title: 'Phase 4: Personalization Engine',
    summary: '**Status**: Complete',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/PHASE_4_PERSONALIZATION_ENGINE',
    tags: ['tech', 'PHASE_4_PERSONALIZATION_ENGINE'],
    body: '# Phase 4: Personalization Engine\n\n**Status**: Complete  \n**Last updated**: 2025-11-21\n\nPhase 4 unlocks tenant-scoped personalization with zero bespoke code. We shipped three new libraries, a signing-aware Overlay editor, and the persistence layer required to observe usage and apply overlays safely.\n\n---\n\n## 1. Libraries\n\n### @lssm/lib.overlay-engine\n\n- OverlaySpec types + validator mirror the public spec.\n- Cryptographic signer (`ed25519`, `rsa-pss-sha256`) with canonical JSON serialization.\n- Registry that merges tenant/role/user/device overlays with predictable specificity.\n- React hooks (`useOverlay`, `useOverlayFields`) for client-side rendering.\n- Runtime engine audits every applied overlay for traceability.\n\n### @lssm/lib.personalization\n\n- Behavior tracker buffers field/feature/workflow events and exports OTel metrics.\n- Analyzer summarizes field usage and workflow drop-offs into actionable insights.\n- Adapter translates insights into overlay suggestions or workflow tweaks.\n- In-memory store implementation + interface for plugging Prisma/ClickHouse later.\n\n### @lssm/lib.workflow-composer\n\n- `WorkflowComposer` merges base workflows with tenant/role/device extensions.\n- Step injection utilities keep transitions intact and validate anchor steps.\n- Template helpers for common tenant review/approval, plus merge helpers for multi-scope extensions.\n\n---\n\n## 2. Overlay Editor App\n\nPath: `packages/apps/overlay-editor`\n\n- Next.js App Router UI for toggling field visibility, renaming labels, and reordering lists.\n- Live JSON preview powered by `defineOverlay`.\n- Server action that signs overlays via PEM private keys (Ed25519 by default) using the overlay engine signer.\n\n---\n\n## 3. Persistence\n\nAdded Prisma models (see `packages/libs/database/prisma/schema.prisma`):\n\n- `UserBehaviorEvent` \u2013 field/feature/workflow telemetry.\n- `OverlaySigningKey` \u2013 tenant managed signing keys with revocation timestamps.\n- `Overlay` \u2013 stored overlays (tenant/user/role/device scope) plus signature metadata.\n\n---\n\n## 4. Integration Steps\n\n1. Track usage inside apps via `createBehaviorTracker`.\n2. Periodically run `BehaviorAnalyzer.analyze` to generate insights.\n3. Convert insights into OverlaySpecs or Workflow extensions.\n4. Register tenant overlays in `OverlayRegistry` and serve via presentation runtimes.\n5. Compose workflows per tenant using `WorkflowComposer`.\n\nSee the `docs/tech/personalization/*` guides for concrete examples.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
  },
];
registerDocBlocks(tech_PHASE_4_PERSONALIZATION_ENGINE_DocBlocks);
