# Spec-Driven Development (SDD)

**Spec-Driven Development** is a way to build software where the **specification is the source of truth**, not a “documentation artifact we promise to update later”.

If you’ve ever shipped something that *looked right* in code review and still broke production because the DB, API, client, docs, and policies drifted apart… welcome. SDD is what you do when you’re tired of reality diverging from your repo.

This package provides a practical SDD toolchain (currently powered by **ContractSpec**) while keeping the README focused on the **method**, not just the tooling.

---

## What “Spec-Driven” actually means

SDD is **not** “we wrote an OpenAPI file once”.
SDD is:

- You express **intent** in a structured, reviewable spec
- The spec is **executable** (it can generate or validate artifacts)
- Changes are managed through **contract diffs**, not vibes
- The spec sits **above** implementations and keeps them coherent over time

A good spec is:
- **Typed** (or at least structurally constrained)
- **Diffable** (PR review works)
- **Enforceable** (CI can fail you)
- **Composable** (small specs > giant documents)

---

## Why this exists

Traditional workflow (a.k.a. “drift by design”):

1. Implement code
2. Update docs “later”
3. Ship
4. Debug why clients don’t match the backend
5. Repeat until burnout

SDD workflow (boring in the best way):

1. Define / update spec
2. Review spec changes (diffs + breaking-change flags)
3. Generate / update code + SDKs + docs + tests
4. Validate implementation against spec in CI
5. Ship with fewer surprises

This matters more when:
- You have **multiple surfaces** (DB + API + Web + Mobile + integrations)
- You use **AI coding** (fast output, high drift risk)
- You need **governance** (policies, PII rules, permissions, compliance)

---

## What belongs in a spec

A spec can describe *more than endpoints*.

Typical useful layers:

- **Domain models**: entities, value objects, enums, invariants  
- **Operations**: commands/queries, inputs/outputs, error shapes  
- **Events**: event names, payloads, versioning rules  
- **Policies**: auth rules, PII classification, access constraints  
- **Examples**: representative requests/responses, edge cases  
- **UI contracts (optional)**: view models, forms, display schemas

The goal is **coherence**. Your system should have one “truth spine” that everything else attaches to.

---

## What does *not* belong in a spec

Specs should avoid becoming implementation fan-fiction.

Usually keep out:
- Framework choices (“use Next.js”, “use NestJS”) unless required
- Internal function names
- Micro-optimizations
- Detailed component trees (unless you’re explicitly generating UI)

Put those in design docs or architecture notes if you want, but don’t let them poison the contract.

---

## The SDD loop (the part people skip)

SDD is only real if you do **diffs and gates**.

A healthy loop looks like:

1. **Propose change**  
   Update the spec as the first PR commit.

2. **Review contract diff**  
   Humans review *impact*, not just code.  
   - What breaks?
   - What needs migration?
   - What needs versioning?

3. **Regenerate artifacts**  
   Update SDKs, stubs, docs, types, schemas, fixtures.

4. **Validate implementation**  
   CI checks that implementations match the contract (and policies).

5. **Ship with intent preserved**  
   The “why” remains attached to the system, not lost in chat logs.

This is the main reason SDD pairs well with AI:
the spec is the constraint system that prevents silent drift.

---

## “Isn’t this just contract-first?”

Adjacent, but broader.

- **Contract-first** often means “API schema first”.
- **Spec-driven** means “system intent first”, across multiple surfaces:
  API, events, models, policies, examples, and sometimes UI boundaries.

If your “contract” only covers endpoints, you’re still leaving a lot of drift vectors open.

---

## What this package provides

`spec-driven-development` is a **tooling distribution** that helps you practice SDD in real projects, including:

- Keeping specs as **versioned artifacts**
- Producing **diffs** to detect breaking changes
- Generating / syncing artifacts to reduce manual duplication
- Enforcing constraints in **CI** (so reality cannot “quietly” diverge)

At the moment, this package is powered by **ContractSpec** (same engine, different framing).

---

## Install

```bash
npm install spec-driven-development
# or
pnpm add spec-driven-development
# or
yarn add spec-driven-development
# or
bun add spec-driven-development
````

---

## Usage

This package is meant to be used as a CLI/tooling workflow inside your repo.

Start here:

```bash
npx spec-driven-development --help
# or
bunx spec-driven-development --help
```

If your project/team already uses the canonical tool name, you may also want:

* `contractspec` (same underlying engine, more product/tooling oriented docs)

---

## Practical tips (so SDD doesn’t become “SDD theater”)

* **Make the spec reviewable**: small, composable files beat one mega-spec.
* **Treat examples as tests**: if examples rot, your spec is lying.
* **Version events** intentionally**: event drift is the silent killer of systems.
* **Put PII + auth in the spec**: policies are part of reality, not “later work”.
* **Gate breaking changes in CI**: humans are fallible, CI is relentless (good).

---

## Who this is for

* Teams shipping APIs + clients who are tired of drift
* AI-assisted builders who want **constraints and coherence**
* Platform/tooling folks who want safer change management
* Anyone who hears “it’s just a rename” and flinches

---

## License

MIT (or see repository for details).