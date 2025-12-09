# Phase 4: Personalization Engine

**Status**: Complete  
**Last updated**: 2025-11-21

Phase 4 unlocks tenant-scoped personalization with zero bespoke code. We shipped three new libraries, a signing-aware Overlay editor, and the persistence layer required to observe usage and apply overlays safely.

---

## 1. Libraries

### @lssm/lib.overlay-engine

- OverlaySpec types + validator mirror the public spec.
- Cryptographic signer (`ed25519`, `rsa-pss-sha256`) with canonical JSON serialization.
- Registry that merges tenant/role/user/device overlays with predictable specificity.
- React hooks (`useOverlay`, `useOverlayFields`) for client-side rendering.
- Runtime engine audits every applied overlay for traceability.

### @lssm/lib.personalization

- Behavior tracker buffers field/feature/workflow events and exports OTel metrics.
- Analyzer summarizes field usage and workflow drop-offs into actionable insights.
- Adapter translates insights into overlay suggestions or workflow tweaks.
- In-memory store implementation + interface for plugging Prisma/ClickHouse later.

### @lssm/lib.workflow-composer

- `WorkflowComposer` merges base workflows with tenant/role/device extensions.
- Step injection utilities keep transitions intact and validate anchor steps.
- Template helpers for common tenant review/approval, plus merge helpers for multi-scope extensions.

---

## 2. Overlay Editor App

Path: `packages/apps/overlay-editor`

- Next.js App Router UI for toggling field visibility, renaming labels, and reordering lists.
- Live JSON preview powered by `defineOverlay`.
- Server action that signs overlays via PEM private keys (Ed25519 by default) using the overlay engine signer.

---

## 3. Persistence

Added Prisma models (see `packages/libs/database/prisma/schema.prisma`):

- `UserBehaviorEvent` – field/feature/workflow telemetry.
- `OverlaySigningKey` – tenant managed signing keys with revocation timestamps.
- `Overlay` – stored overlays (tenant/user/role/device scope) plus signature metadata.

---

## 4. Integration Steps

1. Track usage inside apps via `createBehaviorTracker`.
2. Periodically run `BehaviorAnalyzer.analyze` to generate insights.
3. Convert insights into OverlaySpecs or Workflow extensions.
4. Register tenant overlays in `OverlayRegistry` and serve via presentation runtimes.
5. Compose workflows per tenant using `WorkflowComposer`.

See the `docs/tech/personalization/*` guides for concrete examples.






















