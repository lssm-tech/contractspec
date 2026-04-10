# Package Strategy

## Goal

Add Builder v3 without turning the monorepo into a swamp of overlapping abstractions.

## Reuse from existing ContractSpec layers

Builder v3 should build on:
- existing contracts/spec infrastructure,
- existing runtime/orchestration infrastructure,
- existing harness/evidence infrastructure,
- existing chat or channel surfaces where reusable.

It should add the missing packages for Builder-specific control-plane work.

## Proposed packages

### Core Builder
- `@contractspec/lib.builder-spec`
- `@contractspec/lib.builder-runtime`

### Provider abstraction
- `@contractspec/lib.provider-spec`
- `@contractspec/lib.provider-runtime`

### Omnichannel and mobile
- `@contractspec/lib.mobile-control`
- `@contractspec/module.mobile-review`
- `@contractspec/integration.channel.telegram`
- `@contractspec/integration.channel.whatsapp`

### Runtime targets
- `@contractspec/integration.runtime.managed`
- `@contractspec/integration.runtime.local`
- `@contractspec/integration.runtime.hybrid`

### External providers
- `@contractspec/integration.provider.codex`
- `@contractspec/integration.provider.claude-code`
- `@contractspec/integration.provider.gemini`
- `@contractspec/integration.provider.copilot`
- `@contractspec/integration.provider.stt`
- `@contractspec/integration.provider.local-model`

### UI
- `@contractspec/module.builder-workbench`

## Ownership boundaries

`lib.builder-spec`
- shared types
- commands/events
- decision and readiness contracts

`lib.builder-runtime`
- source fusion
- lane coordination
- approval orchestration
- preview/export orchestration

`lib.provider-spec`
- provider capability contracts
- routing policy
- receipts
- patch proposal contracts

`lib.provider-runtime`
- adapter execution
- provider normalization
- retry/fallback/comparison orchestration

`module.builder-workbench`
- responsive builder UI
- provider activity and diff review
- runtime target management

`module.mobile-review`
- mobile-first review and approval pages
- deep-link workflows from Telegram/WhatsApp

## Package sequence

1. `lib.builder-spec`
2. `lib.provider-spec`
3. `lib.builder-runtime`
4. `lib.provider-runtime`
5. `module.builder-workbench`
6. channel integrations
7. runtime integrations
8. provider integrations
