---
targets:
  - '*'
root: false
globs:
  - '**/*'
cursor:
  alwaysApply: true
  globs:
    - '**/*'
---
# ContractSpec Mission & Context

"AI must understand that ContractSpec is NOT just codegen. It's the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. Every decision should reinforce this positioning: we're the safety layer for AI-coded systems."

---

## Mission Statement

**ContractSpec is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.**

---

## How to use this in prompts/specs

- Prepend the mission statement to agent/system prompts when generating or refactoring code.
- Remind: we are a compiler, not a platform; outputs must stay ejectable, standard tech, and spec-first.
- Default framing to users: “Stabilize your AI-generated code, one module at a time. You own the code.”
- Reject approaches that introduce lock-in, hidden runtimes, or magic abstractions.

## The Problem We Solve

In 2025/2026, "vibe coding" and AI agents generate enormous amounts of code. But they have critical limitations:

- **They can't enforce invariants** — AI-generated code drifts from business rules over time
- **They break multi-surface consistency** — API, DB, UI, and events get out of sync
- **They hallucinate refactors** — AI "improvements" introduce subtle bugs and break contracts
- **They destroy long-term maintainability** — no source of truth, no safe regeneration path

**The result:** Teams ship fast initially, then spend months untangling AI-generated spaghetti.

---

## Our Role

ContractSpec is the **safety and governance layer for AI-coded systems**:

1. **Canonical Source of Truth** — Contracts and specs define what the system _should_ do, not just what it _does_
2. **Safe Regeneration** — Generate and regenerate code across surfaces (API, DB, UI, events) without breaking invariants
3. **Multi-Surface Consistency** — One spec, multiple outputs, always in sync
4. **AI Governance** — Constrain what AI agents can change, enforce contracts they must respect

---

## Core Positioning

> **"You keep your app.**
> **We stabilize it, one module at a time.**
> **You own the code. It's standard tech.**
> **We're the compiler, not the prison."**

---

## Key Fears We Must Address

### Fear 1: "I already have an app"

**Reality:** ContractSpec works with existing codebases. You don't start over — you stabilize incrementally, one module at a time. Start with one API endpoint, one data model, one contract.

### Fear 2: "Vendor lock-in / losing ownership"

**Reality:** You own the generated code. It's standard TypeScript, standard SQL, standard GraphQL. ContractSpec is a compiler — like TypeScript itself. You can eject at any time and keep everything.

### Fear 3: "Adoption cost / learning curve"

**Reality:** Specs are just TypeScript. If you can write `z.object({ name: z.string() })`, you can write a ContractSpec. No new language, no magic DSL, no YAML.

### Fear 4: "Forced migrations / magical runtime"

**Reality:** ContractSpec generates plain code you can read, debug, and modify. There's no proprietary runtime you depend on. Migrations are explicit, reversible, and in your control.

---

## Target Users (ICP Tiers)

### Tier 1: Priority (Now)

**AI-Native Startups & Technical Founders**

- **Profile:** Solo founders or small teams using Cursor, Copilot, Claude, or AI agents heavily
- **Pain:** Messy AI-generated backends and frontends, inconsistent APIs, code that's hard to refactor
- **Need:** A way to stabilize AI-generated code without rewriting it

**Small Teams with AI-Generated Chaos**

- **Profile:** 2-10 person teams that shipped fast with AI and now have tech debt
- **Pain:** Multiple surfaces out of sync, no source of truth, afraid to touch AI-generated code
- **Need:** Incremental stabilization, safe regeneration, contracts as guardrails

### Tier 2: Growth (Next)

**AI Dev Agencies**

- **Profile:** Agencies building many projects for clients using AI-assisted development
- **Pain:** Repeating the same patterns, inconsistent quality across projects, handoff nightmares
- **Need:** Reusable templates, consistent contracts, professional handoff deliverables

**Scaleups with Compliance/Governance Needs**

- **Profile:** Growing companies that need audit trails, API governance, or regulatory compliance
- **Pain:** AI-generated code doesn't meet compliance requirements, no audit trail
- **Need:** Governance layer, change tracking, contract enforcement

### Tier 3: Later (Future)

**Platform Teams / Enterprises**

- **Profile:** Engineering teams standardizing APIs and contracts across large organizations
- **Pain:** Inconsistent API designs across teams, schema drift, onboarding complexity
- **Need:** Centralized contract definitions, cross-team consistency, automated compliance

---

## Principles

### 1. Compiler, Not Prison

ContractSpec is a tool in your toolchain, not a platform you're locked into. Generated code is yours. Standards are industry standards. You can always eject.

### 2. Incremental Adoption

You don't rewrite your app. You stabilize one module at a time. Start small, prove value, expand gradually.

### 3. Spec-First, AI-Safe

Specs are the source of truth. AI agents read specs, not implementations. AI-generated code that violates specs gets flagged and rejected.

### 4. Multi-Surface Consistency

One spec generates API endpoints, database schemas, UI types, event definitions, and MCP tools. All surfaces stay in sync because they share the same source.

### 5. Safe Regeneration

You can regenerate code at any time without fear. Specs enforce invariants. Breaking changes are caught at compile time, not runtime.

### 6. Standard Tech, No Magic

TypeScript, Zod, Prisma, GraphQL, REST — all standard. No proprietary runtime, no magic. Just a compiler that outputs code you already know.

---

## Business Model

### Core SaaS

- Per project / per team / per seat pricing
- Free tier for individual developers and small projects
- Team tier for collaboration features

### Usage-Based

- Regenerations and spec operations
- CI/CD integration credits
- Evolution suggestions and auto-fixes

### Future: Marketplace

- Templates and modules
- Vertical-specific contract libraries
- Enterprise custom integrations

---

## Design & Development Heuristics

### Feature Design

✅ Does this feature help stabilize AI-generated code?
✅ Does it work with existing codebases (incremental adoption)?
✅ Does it generate standard, ejectable code?
✅ Does it enforce contracts across multiple surfaces?
✅ Can AI agents read and respect this spec?
❌ Does this feature create lock-in?
❌ Does this require a full rewrite to adopt?
❌ Does this introduce proprietary runtime dependencies?

### DX & Messaging

✅ Does messaging emphasize "stabilize" not "replace"?
✅ Is the learning curve minimal (just TypeScript)?
✅ Is it clear you own the generated code?
✅ Does the experience feel like a compiler, not a platform?
❌ Are we using language that implies lock-in?
❌ Are we hiding the generated code from developers?

### AI Safety & Governance

✅ Can this spec be used to validate AI-generated code?
✅ Does this help AI agents understand system constraints?
✅ Is contract violation detectable at compile time?
✅ Are breaking changes explicit and auditable?
❌ Does this allow AI to bypass contract enforcement?
❌ Does this make it harder to audit AI-generated changes?

### Technical Architecture

✅ Is the generated code standard tech (no magic)?
✅ Can developers read and modify generated code?
✅ Is ejection possible at any point?
✅ Does this maintain multi-surface consistency?
❌ Are we introducing proprietary abstractions?
❌ Are we making decisions that increase lock-in?

---

## Competitive Differentiation

**We are NOT:**

- A code generator you run once and maintain forever (Swagger/OpenAPI codegen)
- A database-centric tool that forces your architecture (Prisma-first)
- A no-code platform for non-technical users
- A proprietary runtime you can't escape

**We ARE:**

- The **compiler** that keeps AI-generated code safe and consistent
- A **governance layer** for AI-coded systems
- A **stabilization tool** for existing messy codebases
- A **contract-first** approach with standard tech outputs

---

## Key Concepts

### Contracts (Specs)

The canonical source of truth. Contracts define operations (commands/queries), events, and presentations. AI agents and code generators read contracts to understand system constraints.

### Multi-Surface Generation

One contract generates multiple outputs:

- **REST API**: Type-safe endpoints with validation
- **GraphQL Schema**: Automatically generated resolvers
- **Database Schema**: Prisma migrations and types
- **MCP Tools**: AI agent tool definitions
- **Client SDKs**: Type-safe API clients

### Safe Regeneration

The ability to regenerate code at any time without breaking invariants. Specs enforce constraints. Breaking changes are caught early.

### Incremental Adoption

You don't rewrite your app. You introduce contracts module by module. Start with one endpoint, one entity, one surface. Expand as you see value.

---

## Messaging Guidelines

### Use This Language

- "Stabilize your AI-generated code"
- "Compiler for AI-coded systems"
- "You own the code"
- "Standard tech, no lock-in"
- "One module at a time"
- "Safe regeneration"

### Avoid This Language

- "Platform" (implies lock-in)
- "Rewrite your app" (implies big-bang adoption)
- "Our runtime" (implies dependency)
- "Magic" (implies hidden complexity)
- "Replace your stack" (implies migration)

---

## References

- See `docs/` for detailed technical documentation
- See `examples/` for implementation patterns
- See `package-architecture.md` for package structure and dependency rules
- See `packages/libs/contracts/README.md` for core contract definitions
