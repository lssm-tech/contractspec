# Pocket Family Office Vertical

Pocket Family Office is a ContractSpec reference vertical that
demonstrates finance automation atop the integration and knowledge
layers. It is optimised for the hackathon stack (Google Cloud, Mistral,
Qdrant, ElevenLabs) while remaining provider-agnostic.

## Goals

- Ingest household financial documents (uploads + Gmail threads).
- Generate AI summaries and optionally deliver them as voice notes.
- Schedule multi-channel reminders for upcoming bills.
- Showcase spec-first composition of integrations, knowledge spaces, and
  workflows.

## Blueprint Overview

Source: `packages/verticals/pocket-family-office/blueprint.ts`

- **Integration slots**
  - `primaryLLM` → Mistral chat/embeddings
  - `primaryVectorDb` → Qdrant
  - `primaryStorage` → Google Cloud Storage
  - `primaryOpenBanking` → Powens BYOK project for account aggregation
  - `emailInbound` / `emailOutbound` → Gmail + Postmark
  - `calendarScheduling` → Google Calendar
  - `voicePlayback` → ElevenLabs (optional)
  - `smsNotifications` → Twilio (optional)
  - `paymentsProcessing` → Stripe (optional)
- **Workflows**
  - `process-uploaded-document`
  - `upcoming-payments-reminder`
  - `generate-financial-summary`
  - `ingest-email-threads`
  - `sync-openbanking-accounts`
  - `sync-openbanking-transactions`
  - `refresh-openbanking-balances`
  - `generate-openbanking-overview`
- **Policies/Telemetry** – references tenant policy specs and
  `pfo.telemetry` for observability.

## Tenant Sample

`tenant.sample.ts` binds each slot to sample connections defined in
`connections/samples.ts`. Key details:

- Uses Google Cloud Secret Manager URIs for all credentials.
- Enables knowledge spaces `knowledge.financial-docs` and
  `knowledge.email-threads`, plus the derived summaries space
  `knowledge.financial-overview` populated by open banking workflows.
- Keeps `voicePlayback` and `paymentsProcessing` optional so tenants can
  enable them incrementally.

## Contracts

`contracts/index.ts` defines command/query specs that power the
workflows:

- `pfo.documents.upload` – store object + enqueue ingestion.
- `pfo.reminders.schedule-payment` – send email/SMS/calendar reminders.
- `pfo.summary.generate` – run RAG over knowledge spaces.
- `pfo.summary.dispatch` – deliver summaries via email / voice.
- `pfo.email.sync-threads` – ingest Gmail threads.

## Workflows

- **Process Uploaded Document**
  1. Upload to storage / queue ingestion.
  2. Optional human review step.
- **Upcoming Payments Reminder**
  1. Human review (confirm due date / channel).
  2. Automation schedules reminders (email/SMS/calendar).
- **Generate Financial Summary**
  1. Run RAG to produce Markdown summary.
  2. Dispatch summary (email + optional ElevenLabs voice note).
- **Ingest Email Threads**
  1. Sync Gmail threads into knowledge space.
  2. Triage step for operators when nothing new is ingested.

## Knowledge & Jobs

- Knowledge spaces registered via
  `registerFinancialDocsKnowledgeSpace` and
  `registerEmailThreadsKnowledgeSpace`.
- Ingestion adapters (`GmailIngestionAdapter`, `StorageIngestionAdapter`)
  and job handlers (`createGmailSyncHandler`,
  `createStorageDocumentHandler`) wire Gmail labels & GCS prefixes into
  Qdrant.
- `KnowledgeQueryService` provides summarisation + references for the
  summary generation workflow.

## Tests & Usage

`tests/pocket-family-office.test.ts` exercises:

- Blueprint validation + config composition.
- In-memory ingestion of a sample invoice.
- Retrieval augmented generation producing a summary with references.

Use these files as scaffolding for new tenants or as a template for the
hackathon deliverable. Replace the sample connection metadata with
tenant-specific IDs/secret references before deploying.



