# External Execution and Provider Routing

## Core principle

Builder should **use external execution providers as workers**.
It should not try to become the worker itself.

## Provider classes

### Conversational providers
Used for:
- clarification,
- synthesis,
- explanation,
- question generation,
- plan drafting.

### Coding providers
Used for:
- patch proposals,
- repo-aware implementation,
- test generation,
- structured file generation,
- refactors inside scoped workspaces.

### STT providers
Used for:
- voice transcription,
- timestamped transcript generation,
- speaker or language metadata.

### Vision / extraction providers
Used for:
- image understanding,
- OCR-like extraction,
- screenshot and UI evidence interpretation.

### Evaluation providers
Used for:
- rubric scoring,
- comparison summaries,
- explanation of harness outcomes.

## Builder-owned wrapper

Every provider run must be wrapped with Builder-owned:
- context bundle,
- task type,
- write scope,
- runtime target,
- risk classification,
- approval state,
- receipt and artifact normalization.

## Provider routing policy

Provider routing is not a hidden heuristic.
It is a policy surface.

Routing policy should consider:
- task type,
- runtime mode,
- risk level,
- data sensitivity,
- provider availability,
- cost and latency envelope,
- user or tenant preferences,
- whether comparison mode is required.

## Routing examples

### Example A: Clarification + planning
Route to:
- a strong conversational provider
- maybe a cheaper helper model for extraction

### Example B: Repo-scoped patch proposal
Route to:
- a coding provider with structured diff support,
- then run harness verification before acceptance.

### Example C: Voice note from WhatsApp
Route to:
- STT provider,
- then conversational provider for directive extraction,
- then ask for confirmation if the directive is structurally meaningful.

### Example D: Sensitive local-data workflow
Route to:
- a local-capable provider or local runtime,
- or block the task if managed-only providers violate policy.

## Context bundle shape

An `ExternalExecutionContextBundle` should include:
- problem statement,
- relevant blueprint excerpt,
- source refs,
- acceptance criteria,
- runtime target constraints,
- allowed write scopes,
- relevant policy packs,
- required output format,
- required receipt fields.

## Patch proposal flow

1. Builder prepares a context bundle.
2. Builder selects one or more providers.
3. Provider returns artifacts or structured diff proposals.
4. Builder normalizes outputs into `ExternalPatchProposal`.
5. Harness verifies.
6. Human or policy decides accept/reject/escalate.
7. Accepted proposal updates preview or blueprint state.
8. Receipt and evidence are stored.

## Comparison mode

Builder should support comparison runs for expensive or high-risk tasks.

Use cases:
- compare two patch proposals,
- compare two plans,
- compare two extraction summaries.

Comparison mode outputs:
- `ExecutionComparisonRun`
- `ComparisonVerdict`
- recommendation with evidence.

## Fallback rules

If a provider fails:
- retry only within policy,
- route to fallback provider if allowed,
- degrade to human review if confidence drops,
- never silently switch from local to managed if data policy forbids it.

## Provider risk policy

The same provider can be allowed for:
- explanation,

but not for:
- code mutation,

or not for:
- managed processing of sensitive data.

Risk policy is task-specific, not brand-specific.

## Mandatory receipt fields

Every provider run must record:
- provider identity,
- model or engine version when available,
- task type,
- runtime mode,
- context hash,
- output artifact hashes,
- token / latency / cost metrics when available,
- timestamps,
- verification refs.

## Recommended first provider integrations

- one conversational provider
- one coding provider
- one STT provider
- optional local model path for extraction or privacy-sensitive flows

More breadth comes later.
Control and receipts come first.
