# @contractspec/integration.provider.project-management

## 0.2.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/integration.runtime@3.9.9
  - @contractspec/lib.contracts-integrations@3.8.19

## 0.2.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/integration.runtime@3.9.8
  - @contractspec/lib.contracts-integrations@3.8.18

## 0.2.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/integration.runtime@3.9.7
  - @contractspec/lib.contracts-integrations@3.8.17

## 0.2.0

### Minor Changes

- Split provider implementations into targeted integration packages while preserving the legacy providers-impls facade.
  - Packages: @contractspec/integration.providers-impls (minor), @contractspec/integration.provider.analytics (minor), @contractspec/integration.provider.calendar (minor), @contractspec/integration.provider.database (minor), @contractspec/integration.provider.email (minor), @contractspec/integration.provider.embedding (minor), @contractspec/integration.provider.health (minor), @contractspec/integration.provider.llm (minor), @contractspec/integration.provider.meeting-recorder (minor), @contractspec/integration.provider.messaging (minor), @contractspec/integration.provider.openbanking (minor), @contractspec/integration.provider.payments (minor), @contractspec/integration.provider.project-management (minor), @contractspec/integration.provider.sms (minor), @contractspec/integration.provider.storage (minor), @contractspec/integration.provider.vector-store (minor), @contractspec/integration.provider.voice (minor), @contractspec/app.api-library (patch), @contractspec/example.calendar-google (patch), @contractspec/example.email-gmail (patch), @contractspec/example.integration-posthog (patch), @contractspec/example.meeting-recorder-providers (patch), @contractspec/example.openbanking-powens (patch), @contractspec/example.product-intent (patch), @contractspec/example.project-management-sync (patch), @contractspec/example.voice-providers (patch)
  - Migration: Replace direct provider imports such as `@contractspec/integration.providers-impls/impls/gmail-inbound` with targeted packages such as `@contractspec/integration.provider.email/impls/gmail-inbound`.; Continue importing `IntegrationProviderFactory` from `@contractspec/integration.providers-impls/impls/provider-factory` when you need broad provider routing.

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/integration.runtime@3.9.6
  - @contractspec/lib.contracts-integrations@3.8.16
