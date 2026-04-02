# Architecture

## Runtime component model

```txt
┌─────────────────────────────────────────────────────────────────────┐
│ Coding agent / IDE / CLI                                           │
│  - Claude adapter                                                   │
│  - Cursor adapter                                                   │
│  - Codex adapter                                                    │
└───────────────┬─────────────────────────────────────────────────────┘
                │ normalized actions
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Connect Core                                                        │
│  1. Adapter API                                                     │
│  2. Impact Resolver                                                 │
│  3. Context Builder                                                 │
│  4. Plan Compiler + Verifier                                        │
│  5. Patch / Command Verifier                                        │
│  6. Verdict Synthesizer                                             │
│  7. Audit Writer                                                    │
│  8. Review Packet Emitter                                           │
└───────┬─────────────────┬──────────────────┬────────────────────────┘
        │                 │                  │
        ▼                 ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────────────────────┐
│ ContractSpec  │  │ Local repo    │  │ Studio (optional)            │
│ contracts     │  │ state + diff  │  │ review queues / packs /      │
│ manifests     │  │ overlays      │  │ checks / lineage / handoff   │
│ policies      │  │               │  │                              │
└───────────────┘  └───────────────┘  └──────────────────────────────┘
```

## Decision flow

### A. Session start

1. Adapter initializes
2. Connect loads repository config
3. Connect loads ContractSpec artifacts
4. Connect refreshes impact index if needed
5. Connect assembles a base context pack
6. Audit event is written

### B. `/plan` flow

1. Agent proposes a plan
2. Connect compiles a plan packet
3. Plan verifier checks impact coverage, approvals, and risk
4. Result is returned to the agent as:
   - approved
   - revise plan
   - escalate review
   - deny plan

### C. `write_file` or `edit_file` flow

1. Adapter captures proposed patch
2. Impact resolver maps patch to contracts and surfaces
3. Verifier pipeline runs deterministic checks
4. Verdict is synthesized
5. Audit event is written
6. Review packet is emitted if needed

### D. `run_command` flow

1. Adapter captures command and cwd
2. Command risk engine classifies the action
3. Impact resolver infers scope
4. Policy and review checks run
5. Verdict is returned
6. Audit event is written

## Component responsibilities

### Adapter API

- environment-specific installation
- environment-specific hook registration
- action normalization
- response translation

### Impact Resolver

- maintain file → contract → surface index
- answer impact queries fast
- classify unknown-impact paths

### Context Builder

- assemble trusted context
- attach provenance and trust levels
- strip irrelevant sources
- produce minimal but sufficient agent context

### Plan Compiler + Verifier

- convert natural-language plan into structured packet
- infer touched scope
- attach gates, checks, and approvals
- compute risk level

### Patch / Command Verifier

- enforce path boundaries
- validate syntax/schema/contract rules
- detect drift and breaking changes
- apply command risk policy

### Verdict Synthesizer

- choose permit / rewrite / require_review / deny
- produce remediation guidance
- prevent ambiguous outcomes

### Audit Writer

- append local evidence
- preserve replay inputs
- emit structured events

### Review Packet Emitter

- create local review artifact
- optionally sync to Studio
- preserve lineage between local verdict and external review

## Package split

```txt
packages/apps/connect-cli
packages/libs/connect-core
packages/libs/connect-impact
packages/libs/connect-context
packages/libs/connect-policy
packages/libs/connect-audit
packages/integrations/connect-claude
packages/integrations/connect-cursor
packages/integrations/connect-codex
```

## Performance stance

- impact resolution should be incremental
- context packs should be minimal and task-scoped
- verifier stages should be cached where safe
- full repo regeneration must be optional, not a default precondition
- Studio sync must never block local safety decisions
