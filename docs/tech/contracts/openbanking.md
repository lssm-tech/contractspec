# Open Banking (Powens) Overview

The Pocket Family Office vertical now supports read-only open banking capabilities powered by Powens. This doc summarises the contract surfaces, canonical data models, workflows, telemetry, and guardrails introduced to make Powens a first-class integration.

## Integration Spec

Powens is registered under `openbanking.powens` with category `open-banking` and currently supports the BYOK ownership mode. The spec exposes three read-only capabilities:

- `openbanking.accounts.read`
- `openbanking.transactions.read`
- `openbanking.balances.read`

Configuration and secrets are separated:

| Config Field | Description |
| --- | --- |
| `environment` | Powens environment (`sandbox` \| `production`) |
| `baseUrl?` | Optional API base URL override |
| `region?` | Optional Powens region identifier |
| `pollingIntervalMs?` | Optional custom sync cadence |

| Secret Field | Description |
| --- | --- |
| `clientId` | Powens OAuth client identifier |
| `clientSecret` | Powens OAuth client secret |
| `apiKey?` | Optional supplemental Powens API key |
| `webhookSecret?` | Optional webhook signing secret |

## Canonical Data Models

Canonical schemas live in `@lssm/lib.contracts/integrations/openbanking/models`:

- `BankAccountRecord` – account metadata (institution, IBAN/BIC, masked numbers, balances, sync timestamps)
- `BankTransactionRecord` – transaction ledger (amounts, categories, counterparty, status)
- `AccountBalanceRecord` – balance snapshots per account and balance type

These schemas power the vertical contracts and workflows, ensuring downstream features never use raw Powens payloads directly.

## Provider Implementation

`PowensOpenBankingProvider` wraps `PowensClient` which handles OAuth token management, request retries, and error mapping. The provider maps Powens payloads to the canonical interfaces exported from `integrations/providers/openbanking`.

Factory support lives in `IntegrationProviderFactory.createOpenBankingProvider`, which validates configuration, loads BYOK secrets, and instantiates the provider.

## Contracts

Command/query contracts exist under `integrations/openbanking/contracts`:

- `openbanking.accounts.sync` & `openbanking.accounts.list`
- `openbanking.transactions.sync` & `openbanking.transactions.list`
- `openbanking.balances.refresh` & `openbanking.balances.get`

The Pocket Family Office bundle also exposes `pfo.openbanking.generate-overview`, which aggregates balances and transactions into a derived knowledge document.

## Workflows

New workflow specs (all requiring the `primaryOpenBanking` slot) orchestrate the sync flows:

- `pfo.workflow.sync-openbanking-accounts`
- `pfo.workflow.sync-openbanking-transactions`
- `pfo.workflow.refresh-openbanking-balances`
- `pfo.workflow.generate-openbanking-overview`

Each workflow runs against the Powens provider, persists canonical records, and emits telemetry.

## Knowledge & LLM Exposure

Raw Powens payloads are never stored in knowledge spaces. Instead, `knowledge.financial-overview` captures derived summaries (cashflow, category breakdowns, balance trends) produced by `pfo.openbanking.generate-overview`. The space is `operational` category with 180-day retention and automation write access.

When exposing data to LLMs or analytics:

- Use derived summaries only.
- Redact PII fields using `redactOpenBankingTelemetryPayload`.
- Never emit IBANs, unmasked account numbers, or counterparty detail in telemetry/logs.

## Telemetry

Telemetry constants live in `integrations/openbanking/telemetry`. Key events:

- `openbanking.accounts.synced`
- `openbanking.transactions.synced`
- `openbanking.balances.refreshed`
- `openbanking.overview.generated`

All events require tenant/app/blueprint/config metadata, and sensitive properties are flagged to avoid accidental leakage.

## Guardrails

`ensurePrimaryOpenBankingIntegration` verifies `primaryOpenBanking` is bound and healthy before workflows proceed. Runtime pre-flight checks already block workflows when the connection is disconnected or in error status.

## Blueprint & Tenant Defaults

`pocketFamilyOfficeBlueprint` now includes:

- `primaryOpenBanking` slot (required, BYOK)
- `openbanking.*.read` capabilities enabled by default
- Workflow bindings for the new sync flows

Sample tenant bindings (`tenant.sample.ts`) reference `conn-powens-primary` and bind the new knowledge space.

---

Follow this doc when extending open banking support (e.g., adding payment initiation, additional providers, or expanded analytics) to keep the integration consistent and audited.





