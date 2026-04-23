---
"@contractspec/integration.providers-impls": minor
"@contractspec/integration.provider.analytics": minor
"@contractspec/integration.provider.calendar": minor
"@contractspec/integration.provider.database": minor
"@contractspec/integration.provider.email": minor
"@contractspec/integration.provider.embedding": minor
"@contractspec/integration.provider.health": minor
"@contractspec/integration.provider.llm": minor
"@contractspec/integration.provider.meeting-recorder": minor
"@contractspec/integration.provider.messaging": minor
"@contractspec/integration.provider.openbanking": minor
"@contractspec/integration.provider.payments": minor
"@contractspec/integration.provider.project-management": minor
"@contractspec/integration.provider.sms": minor
"@contractspec/integration.provider.storage": minor
"@contractspec/integration.provider.vector-store": minor
"@contractspec/integration.provider.voice": minor
"@contractspec/example.calendar-google": patch
"@contractspec/example.email-gmail": patch
"@contractspec/example.integration-posthog": patch
"@contractspec/example.meeting-recorder-providers": patch
"@contractspec/example.openbanking-powens": patch
"@contractspec/example.product-intent": patch
"@contractspec/example.project-management-sync": patch
"@contractspec/example.voice-providers": patch
---

Split provider implementations into targeted integration packages while preserving the legacy `@contractspec/integration.providers-impls` facade.

Concrete SDK-backed providers now live in domain packages such as `@contractspec/integration.provider.email`, `@contractspec/integration.provider.voice`, and `@contractspec/integration.provider.project-management`. The legacy `providers-impls` package keeps the broad compatibility subpaths and the `IntegrationProviderFactory`, but those surfaces now re-export or consume the targeted packages instead of owning every implementation directly.

Examples that used direct provider implementations were updated to import the targeted packages so consumers can install only the provider domain they need.
