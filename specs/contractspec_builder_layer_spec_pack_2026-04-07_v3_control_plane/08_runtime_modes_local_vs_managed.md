# Runtime Modes: Local vs Managed

## Requirement

Builder must support both:
- **local runtime** for power users and privacy-sensitive workflows,
- **managed runtime** for non-engineers and friendly onboarding.

It should also support:
- **hybrid runtime** where control is hosted but sensitive execution or data stays local.

## Why runtime mode is first-class

Runtime mode affects:
- trust boundaries,
- onboarding,
- provider availability,
- data locality,
- mobile control expectations,
- preview / export behavior,
- support burden.

It cannot be an afterthought.

## Runtime modes

### Managed
Best for:
- non-engineers,
- teams who want zero or minimal setup,
- fast time to first draft,
- hosted previews and exports.

Characteristics:
- hosted control + execution plane,
- default-safe connectors,
- simpler upgrades,
- easiest mobile experience.

### Local
Best for:
- power users,
- privacy-sensitive data,
- advanced customization,
- offline or semi-offline workflows,
- users who want control of providers and data.

Characteristics:
- local daemon or local appliance,
- local secret storage,
- local data processing where possible,
- more setup complexity,
- still managed by Builder contracts.

### Hybrid
Best for:
- hosted control plane with local sensitive execution,
- mobile-first orchestration with local data,
- gradual migration from local to managed or vice versa.

Characteristics:
- Builder + Studio may be hosted,
- runtime target executes selected tasks locally,
- receipts and summaries sync back according to policy.

## Standard abstractions

### `RuntimeTarget`
A registered execution target.

### `RuntimeCapabilityHandshake`
Declares:
- supported modes,
- available providers,
- storage profile,
- network reachability,
- artifact size limits,
- local UI support if any.

### `RuntimeTrustProfile`
Declares:
- who controls the machine,
- where secrets live,
- whether outbound network is allowed,
- whether managed relay is allowed.

### `RuntimeLease`
Declares:
- who can target the runtime,
- when it expires,
- what scopes are allowed.

## UX requirement

The user should be able to choose:
- managed by default,
- local if they want control,
- hybrid if they need the split,

without rewriting the whole app authoring experience.

The blueprint and export contracts should stay stable across modes.
Only the runtime profile should change.

## Security differences

Managed defaults:
- strong hosted guardrails,
- curated provider set,
- managed upgrades,
- centralized audit.

Local defaults:
- explicit runtime registration,
- explicit provider configuration,
- stricter trust display,
- local secrets never silently mirrored.

Hybrid defaults:
- explicit sync boundaries,
- policy on what evidence leaves local runtime,
- queued actions for intermittent connectivity.

## Mobility requirement

A user operating mostly from Telegram or WhatsApp must still be able to:
- inspect local runtime status,
- approve safe local actions,
- review sync delays,
- understand whether an action ran locally or managed.

## Export compatibility

A readiness report should indicate:
- `managedReady`
- `localReady`
- `hybridReady`

A blueprint may be ready for one mode and blocked for another.

## Suggested first implementation path

1. managed runtime first
2. local runtime registration and health model
3. local preview / export
4. hybrid bridge and sync policy
