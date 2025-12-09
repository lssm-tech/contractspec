# Tenant Customization Runbook

Phase 4 introduces managed overlays and workflow extensions. Ops teams should follow this flow when onboarding a tenant that requests UI tweaks or workflow changes.

1. **Collect requirements**
   - List fields to hide/show or rename.
   - Capture workflow deviations (extra approvals, reordered steps).
2. **Create overlay**
   - Use the overlay editor app (`packages/apps/overlay-editor`) to draft the overlay.
   - Export JSON and sign with the tenant’s registered key (store keys in `OverlaySigningKey`).
3. **Register overlay**
   - Persist the signed payload in the `Overlay` table via provisioning scripts.
   - Register with `OverlayRegistry` at boot or push via admin API.
4. **Compose workflows**
   - Define a `WorkflowExtension` for the tenant (see `@lssm/lib.workflow-composer` docs).
   - Store extension config alongside overlay metadata.
5. **Verify**
   - Run smoke tests in the tenant sandbox.
   - Ensure audit logs capture overlay application events.
6. **Monitor**
   - Use behavior tracking dashboards to confirm adoption or trigger cleanup when overlays become obsolete.

---

## Lifecycle customization

Managed tenants can override lifecycle playbooks without touching database schemas:

1. **Stage definitions**
   - Add overrides in `packages/modules/lifecycle-core/src/data/stage-weights.json`.
   - Keep the canonical doc (`docs/product/lifecycle-stages.md`) in sync with any new stage or axis.
2. **Milestones**
   - Extend `milestones-catalog.json` with tenant-specific IDs. Prefix with the tenant or vertical slug (e.g., `tenant-acme-stage3-retention`).
   - Use feature flag `lifecycle_managed_service` to gate access while new milestones are validated.
3. **Playbooks & ceremonies**
   - Customize `packages/modules/lifecycle-advisor/src/data/stage-playbooks.ts`.
   - Use Studio’s localization hooks to translate ceremony copy for low-tech flows.
4. **Event routing**
   - Subscribe to `LifecycleKpiPipeline` events (see `@lssm/bundle.lifecycle-managed`) to forward stage changes into tenant-specific analytics.

All lifecycle overrides must be versioned alongside the tenant’s overlay and workflow extensions so ops can rollback safely.

