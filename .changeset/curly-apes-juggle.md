---
'@contractspec/lib.contracts-spec': minor
'@contractspec/lib.contracts-integrations': minor
'@contractspec/integration.providers-impls': minor
'@contractspec/integration.runtime': minor
'@contractspec/app.api-library': minor
'@contractspec/app.cli-contractspec': patch
'@contractspec/module.workspace': patch
'@contractspec/bundle.workspace': patch
---

Add a new messaging integration category and provider contracts for Slack, GitHub, WhatsApp Meta, and WhatsApp Twilio, plus provider implementation wiring for outbound delivery.

Introduce an AI-native channel runtime with webhook normalization/signature verification, policy gating, idempotent ingest, outbox dispatch/retry flow, API ingress routes, scheduler dispatch support, and end-to-end integration coverage in api-library.
