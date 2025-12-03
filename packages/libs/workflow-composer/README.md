# @lssm/lib.workflow-composer

Compose base WorkflowSpecs with tenant-, role-, or device-specific extensions. The composer lets teams inject steps, hide portions of a workflow, and attach tenant-scoped metadata without duplicating base definitions.

## Highlights

- Type-safe `extendWorkflow` helper.
- Registry for extension templates (tenant, role, device scopes).
- Validation to ensure injected steps reference valid anchors.
- Merge utilities to combine overlays coming from tenant + user.

Refer to `docs/tech/personalization/workflow-composition.md` for more.



















