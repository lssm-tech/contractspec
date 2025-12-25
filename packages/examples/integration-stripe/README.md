### Integration Example – Stripe Payments

Website: https://contractspec.lssm.tech/


This example shows how to wire the `IntegrationSpec`/`TenantAppConfig` layers together to enable Stripe-backed payments for ArtisanOS.

Files included:

- `blueprint.ts` – declares the `AppBlueprintSpec` enabling the `payments.psp` capability and mapping the payment workflow.
- `workflow.ts` – minimal `WorkflowSpec` that invokes Stripe operations (`payments.stripe.chargeCard`).
- `tenant.ts` – tenant configuration binding the workflow to a concrete Stripe `IntegrationConnection`.
- `connection.sample.ts` – sample connection payload illustrating the data saved by the integrations service.
- `translation.catalog.json` *(optional)* – canonical strings referenced by `branding.appNameKey`.

When the workflow runner executes the `charge` step, the `WorkflowRunner` now surfaces the tenant `ResolvedAppConfig` (including integrations, branding, and translations) through `OperationExecutorContext.resolvedAppConfig`. An implementation of `opExecutor` can:

- Pull the connection via `context.integrations[0]` and ask a `secretProvider` for Stripe keys.
- Resolve tenant-specific branding via `context.branding` for emails or receipts.
- Resolve localized copy using `context.translationResolver` (if provided by the host).

Recommended next steps:

1. Persist the sample connection through the integration CRUD contracts (`integrations.connection.create`).
2. Register the blueprint + workflow + translation catalog in your registry.
3. Use `registerIntegrationContracts` and `registerAppConfigContracts` to expose the connection, branding, and translation management operations.
4. Implement the payment contract handlers to read `ctx.integrations`, fetch secrets through `ctx.secretProvider`, and execute Stripe calls.
5. Render receipts or notifications by combining `ctx.branding` (logos/domain) and `ctx.translation.resolve(key, locale)` for localized copy.

