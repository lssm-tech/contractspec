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

"AI must understand that ContractSpec is not just code generation. It is the open spec system for AI-native software: explicit contracts, aligned surfaces, safe regeneration, and an operating layer on top when teams need it. Decisions should reinforce control, legibility, and incremental adoption."

---

## Mission Statement

**ContractSpec is the open spec system for AI-native software.**

It gives teams an explicit layer for contracts, generation, runtimes, harnesses, and agent-facing surfaces, then adds Studio as the operating product on top when the team wants a packaged workflow.

---

## How to use this in prompts/specs

- Prepend the mission statement to agent or system prompts when generating or refactoring code.
- Default framing to users: "Stabilize your AI-generated code, one module at a time. You keep the code. You choose when to adopt more of the product."
- Remind that the OSS layer stays open, ejectable, and standards-first.
- Reject approaches that introduce hidden runtimes, lock-in language, or product stories that collapse OSS and Studio into one vague platform.

## The Problem We Solve

In 2025/2026, teams can generate enormous amounts of software with AI. The failure mode is not raw speed, it is loss of control:

- **Implicit rules drift** — business constraints stop living in one explicit place
- **Surfaces diverge** — API, UI, data, events, and tools stop agreeing with each other
- **Regeneration becomes dangerous** — every AI rewrite risks introducing hidden contract breaks
- **Teams lose auditability** — no one can explain what the system is supposed to do or why it changed

**The result:** teams ship quickly at first, then lose the ability to evolve safely.

---

## Our Role

ContractSpec is the **explicit control layer for AI-native systems**:

1. **Canonical source of truth** — contracts define what the system should do
2. **Multi-surface consistency** — one explicit layer shapes API, UI, data, events, and tools
3. **Safe regeneration** — teams can change specs and regenerate without treating every edit as a rewrite gamble
4. **Operational progression** — teams can stay on OSS/Core or move into Studio when they want the operating product

---

## Core Positioning

> **You keep your app.**
> **You keep the code.**
> **We give the system an explicit source of truth.**
> **Start with the open foundation. Adopt the operating layer when it helps.**

## Key Fears We Must Address

### Fear 1: "I already have an app"

**Reality:** ContractSpec is designed for incremental adoption. Start with one module, one contract, or one unstable workflow. Do not force a rewrite story.

### Fear 2: "I do not want lock-in"

**Reality:** Outputs stay standard. Contracts, generated code, and runtimes remain inspectable and ejectable. The product story must reinforce this.

### Fear 3: "This sounds like another AI platform"

**Reality:** The OSS layer is the open system. Studio is the operating product on top. Those are related, but not the same thing.

### Fear 4: "AI will keep making unsafe changes"

**Reality:** Specs create explicit boundaries that AI agents and generated code can be checked against before drift spreads across the stack.

---

## Principles

### 1. Open Foundation, Not Closed Platform

The foundation must stay standards-first, inspectable, and incrementally adoptable. Product value cannot depend on trapping teams in a black box.

### 2. Incremental Adoption

Do not force rewrite stories. Teams should be able to stabilize one module at a time and prove value quickly.

### 3. Spec-First, AI-Safe

Specs are the source of truth. AI agents and generated code should be evaluated against explicit system rules, not vibes or inferred conventions.

### 4. Multi-Surface Consistency

Contracts should shape API, UI, data, events, MCP tools, and other operational surfaces from the same explicit layer.

### 5. Safe Regeneration

Regeneration should feel controlled and reviewable, not magical. Breaking changes must stay explicit and auditable.

### 6. Studio as the Operating Product

Studio is the packaged operating surface built on top of the same system. It should never be positioned like an unrelated product or a bait-and-switch away from OSS.

---

## GTM / Business Shape

### OSS/Core

- Technical adopters prove the system in the open
- The foundation earns trust through clarity, standards, and real workflows
- The adoption story starts with control, not with forced monetization

### Studio

- Teams buy the operating product when it removes coordination and operational drag
- Studio packages evidence, drafting, review, export, and follow-up on top of the same explicit layer
- The sale happens after the open foundation has earned the right to matter

---

## Design & Development Heuristics

### Feature Design

✅ Does this feature strengthen the explicit system layer?
✅ Does it help multiple surfaces stay aligned?
✅ Can a team adopt it incrementally?
✅ Does it keep outputs inspectable and standard?
❌ Does it require lock-in to feel valuable?
❌ Does it blur the line between OSS foundation and Studio operating product?

### DX & Messaging

✅ Does messaging emphasize explicit control, stability, and incremental adoption?
✅ Is it clear what lives in OSS/Core versus Studio?
✅ Does it avoid calling the whole company a compiler or a generic platform?
❌ Are we implying that teams must buy Studio to get value?
❌ Are we hiding generated artifacts or runtime behavior behind product language?

### AI Safety & Governance

✅ Can AI-generated changes be validated against explicit contracts?
✅ Does this make drift easier to detect and reason about?
✅ Are breaking changes and operational decisions auditable?
❌ Does this let AI bypass the explicit control layer?

### Technical Architecture

✅ Is the code standard and inspectable?
✅ Are apps thin and lower layers reusable?
✅ Does this preserve the open-system-to-Studio progression?
❌ Are we introducing proprietary abstractions that weaken the core story?

---

## Competitive Differentiation

**We are not:**

- a one-shot generator you run once and abandon
- a closed AI platform that hides its runtime
- a rewrite-only framework for greenfield demos

**We are:**

- an **open spec system** for AI-native software
- an **explicit control layer** for teams whose systems are starting to drift
- a **bridge from OSS foundation to operating product** when teams want the packaged loop

---

## Key Concepts

### Contracts

The canonical source of truth. Contracts define operations, events, presentations, policies, and constraints that other surfaces must respect.

### Multi-Surface Generation

One explicit layer can shape multiple surfaces:

- REST and GraphQL APIs
- database schema and validation
- UI presentations and client types
- MCP tools and agent-facing surfaces

### Safe Regeneration

Teams can change specs and regenerate confidently because the system boundaries are explicit and reviewable.

### Incremental Adoption

Teams start where the pain is real. One module, one workflow, one unstable surface at a time.

### Studio

The operating product built on top of the same foundation. Studio exists to package the loop, not replace the underlying system story.
