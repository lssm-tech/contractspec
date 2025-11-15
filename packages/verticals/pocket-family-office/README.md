# Pocket Family Office Vertical

This vertical demonstrates how a spec-first application orchestrates
financial document automation, payment reminders, and AI summarisation
using ContractSpec. It is designed for multi-tenant deployments where
each household configures its own integrations while reusing a shared
blueprint.

## Contents

- `blueprint.ts` – the global `AppBlueprintSpec` describing required
  capabilities, integration slots, workflows, and telemetry.
- `tenant.sample.ts` – example `TenantAppConfig` showing per-tenant
  bindings to integrations, knowledge spaces, and locales.
- `connections/` – sample `IntegrationConnection` descriptors for the
  nine priority providers (Mistral, Qdrant, GCS, Gmail, Google Calendar,
  Postmark, ElevenLabs, Stripe, Twilio).
- `knowledge/` – example `KnowledgeSourceConfig` entries wiring Gmail
  threads and uploaded documents into canonical knowledge spaces.
- `contracts/` – command specs powering document ingestion, reminders,
  financial summaries, and Gmail synchronisation.
- `workflows/` – workflow specs orchestrating end-to-end automation for
  uploads, reminders, financial overviews, and email ingestion.
- `tests/` – Vitest scenarios covering blueprint validation, config
  composition, and a full end-to-end ingestion/query flow.

## Usage

The files are designed for direct consumption inside tests, CLI
generators, or documentation tooling. They depend exclusively on the
public APIs exported by `@lssm/lib.contracts`, making them safe to copy
into downstream projects or use as a reference implementation during the
Pocket Family Office hackathon.





