### Integration Example – Stripe Payments

This example shows how to wire the `IntegrationSpec`/`TenantAppConfig` layers together to enable Stripe-backed payments for ArtisanOS.

Files included:

- `blueprint.ts` – declares the `AppBlueprintSpec` enabling the `payments.psp` capability and mapping the payment workflow.
- `workflow.ts` – minimal `WorkflowSpec` that invokes Stripe operations (`payments.stripe.chargeCard`).
- `tenant.ts` – tenant configuration binding the workflow to a concrete Stripe `IntegrationConnection`.
- `connection.sample.ts` – sample connection payload illustrating the data saved by the integrations service.

When the workflow runner executes the `charge` step, the `WorkflowRunner` now surfaces the tenant `ResolvedAppConfig` (including integrations) through `OperationExecutorContext.resolvedAppConfig`. An implementation of `opExecutor` can fetch the connection config and call the Stripe SDK safely.

Recommended next steps:

1. Persist the sample connection through the integration CRUD contracts (`integrations.connection.create`).
2. Register the blueprint + workflow in your registry.
3. Use `registerIntegrationContracts` to expose the connection management operations.
4. Implement the payment contract handlers to read `ctx.integrations` and execute Stripe calls.

