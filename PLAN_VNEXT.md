You are working inside the **ContractSpec Studio** monorepo.

ContractSpec is a **spec-first, policy-safe application compiler** for the AI era:

- The **spec / IR is the canonical source of truth** for the system.
- It generates and regenerates **DB, API, UI, events, jobs, policies, and cross-cutting infra** from that spec.
- Human and AI developers should primarily **edit the spec**, then regenerate code, rather than patching generated code directly.
- Generated code must be **standard, readable, ownable**, and runnable without proprietary runtimes.
- ContractSpec is the **deterministic layer** that keeps AI-written and human-written systems coherent and safe over time.

Use the existing technical rules in the workspace for stack, libraries, and coding style. This prompt focuses on **product, domain, architecture, and priorities**.

---

You are working inside the ContractSpec Studio monorepo.

Context:

- ContractSpec is a **spec-first, policy-safe application compiler**.
- The canonical truth is in the spec/IR; code is generated/regenerated from it.
- The **Learning Journey** module is already implemented and marked as ✅ Complete in `PLAN_VNEXT.md`, with:
  - tracks / modules / steps abstraction,
  - SRS / streak / XP engines,
  - progress events.
- There are already example apps like:
  - `@lssm/example.saas-boilerplate`
  - `@lssm/example.crm-pipeline`
  - `@lssm/example.agent-console`
  - `@lssm/example.workflow-system`
  - etc., all aligned to the stack & conventions described in `PLAN_VNEXT.md`.

Goal of this task:
Implement **three Learning Journey example packages** that focus on _learning & progression itself_, not on building new verticals from scratch.

Backwards compatibility note:

- You are allowed to introduce **breaking changes** in the Learning Journey module and its public API if that leads to a cleaner, more coherent design.
- You do **not** need to preserve backward compatibility with any temporary/early experimentation in this area, as long as the rest of the examples still work or can be trivially adapted.

---

## Step 0 – Understand existing Learning Journey implementation

1. Open and read `PLAN_VNEXT.md`, especially:
   - The "Cross-cutting Modules" section.
   - The `Learning Journey` entry.
   - How examples are described and registered (Phase 1/2/3/4 examples).
2. Scan the codebase for the Learning Journey implementation:
   - Example search terms:
     - `@lssm/module.learning`
     - `learning-journey`
     - `LearningJourneyTrack`
     - `SRS`, `XP`, `streak` in relevant libs/modules.
3. Identify:
   - Where the **spec-level definitions** for learning journeys live.
   - How **tracks / steps / progress events** are modeled (entities, events, contracts).
   - How this module integrates with:
     - identity & RBAC,
     - event bus,
     - notifications / jobs (if already wired),
     - usage/metering (if any hooks exist).

Do **not** write code yet. First, build a mental map and then propose a short implementation plan.

---

## Step 1 – Proposed implementation plan

Propose a concise plan (in comments or as a single markdown summary) that covers:

1. **Domain model** of Learning Journey (as it exists now):
   - Track, module, step.
   - Step completion / progress events.
   - XP, streak, SRS.
2. Any **small API redesigns** needed to cleanly support the 3 examples:
   - e.g. better typing for `completionCondition`,
   - clearer linkage between “events from other modules” and “step progress”.
3. The three example packages you will add, including **intended package names** and relationships:
   - `@lssm/example.learning-journey.studio-onboarding`
   - `@lssm/example.learning-journey.platform-tour`
   - `@lssm/example.learning-journey.crm-onboarding`
4. How each example will:
   - Define a **track** (and optional sub-modules/sections).
   - Bind steps to **events** coming from Studio, core modules, or CRM.
   - Award XP / streaks.
   - Optionally trigger **notifications** or scheduled nudges.
5. Where the examples will be **wired into Studio**:
   - E.g. template registry, onboarding flows, or a “Learning” section inside Studio, depending on what already exists.

When the plan is written, follow it and implement step by step.

---

## Step 2 – Example 1: Studio Onboarding Learning Journey

Business / product logic:

This journey is for a new user landing in ContractSpec Studio.  
Goal: **“First 30 minutes with Studio”** that takes a user from “what is this thing?” to “I’ve instantiated a template, modified the spec, regenerated, and played with the UI.”

Track concept:

- **Track key**: `studio_getting_started`
- Target persona: new Studio user (developer / builder).
- Outcome: user has:
  - spawned a template sandbox,
  - edited spec (not generated code),
  - triggered regeneration,
  - used Playground / Builder / Markdown / Evolution at least once.

Suggested steps (exact naming can be adapted to match code style):

1. `choose_template`
   - Description: “Pick a Phase 1 template and create a sandbox.”
   - Completion condition:
     - Receipt of an event like `studio.template.instantiated` or equivalent.
2. `edit_spec`
   - Description: “Edit the spec for your sandbox (no touching generated code).”
   - Completion:
     - An event like `spec.changed` / `spec.saved` in the sandbox.
3. `regenerate_app`
   - Description: “Regenerate the application from the spec.”
   - Completion:
     - `regeneration.completed` event.
4. `play_in_playground`
   - Description: “Use the Playground mode or any runtime mode to interact with the app.”
   - Completion:
     - `playground.session.started` or equivalent.
5. `try_evolution_mode`
   - Description: “Use Evolution mode once to request a change from AI and regenerate.”
   - Completion:
     - An event such as `studio.evolution.applied` or the closest existing one.

Implementation details:

- Create a new **example package** for this track following the same structure as the other example packages:
  - `@lssm/example.learning-journey.studio-onboarding`
  - Put spec definitions where the other examples define their schemas/specs.
- Define:
  - A `LearningJourneyTrack` (or equivalent entity) for `studio_getting_started`.
  - A set of `LearningJourneyStep` definitions keyed by the events above.
- Wiring:
  - Map real events from Studio to step completion using the existing bus / events system.
  - Award XP for each step (e.g. simple 10–25 XP per step).
  - Optionally define a **streak rule**:
    - e.g. completing all steps within 48 hours of first interaction.

Add minimal documentation (README in the package) explaining:

- What this track is.
- Which events complete each step.
- How to plug it into the UI (if there’s a Learning UI already).

---

## Step 3 – Example 2: Platform Primitives Tour

Business / product logic:

This journey is for a developer who wants to understand **all cross-cutting modules** by touching each of them once.  
It is intentionally product-agnostic: more like a “platform tour.”

Track concept:

- **Track key**: `platform_primitives_tour`
- Outcome: the user has:
  - created an org & member,
  - triggered an auditable event,
  - sent a notification,
  - scheduled and ran a job,
  - used a feature flag,
  - attached a file,
  - generated some metered usage.

Suggested steps (adapt event names to the actual codebase):

1. `identity_rbac`
   - “Create an org and add at least one member.”
   - Completion:
     - `identity.org.created` + `identity.org.member_added` or equivalent.
2. `event_bus_audit`
   - “Emit an auditable event.”
   - Completion:
     - `bus.event.emitted` with `audit` flag set, or an `audit_log.created` event.
3. `notifications`
   - “Send yourself (or a test user) a notification.”
   - Completion:
     - `notification.delivery.succeeded`.
4. `jobs_scheduler`
   - “Schedule a recurring or one-off background job and let it run at least once.”
   - Completion:
     - `job.scheduled` + `job.completed`.
5. `feature_flags`
   - “Create and flip a feature flag.”
   - Completion:
     - `feature_flag.created` + `feature_flag.updated` / evaluated.
6. `files_attachments`
   - “Attach a file to any entity.”
   - Completion:
     - `file.attached` or similar.
7. `usage_metering`
   - “Generate some usage for a metric (e.g. regenerations, agent runs).”
   - Completion:
     - `usage.recorded` or equivalent metering event.

Implementation details:

- New example package:
  - `@lssm/example.learning-journey.platform-tour`
- Define a single track `platform_primitives_tour` with the above steps.
- Bind step completion to the actual event names used by:
  - `@lssm/lib.identity`
  - `@lssm/lib.bus`
  - `@lssm/module.notifications`
  - `@lssm/lib.jobs`
  - `@lssm/lib.feature-flags`
  - `@lssm/lib.files`
  - `@lssm/lib.metering`
- XP / streak:
  - XP for each step.
  - Optionally a **bonus XP** for finishing all steps.
- This example should highlight:
  - How to use Learning Journey purely as a **cross-module teaching layer** with no extra business entities.

Add a README describing:

- The developer persona.
- How to run through the steps manually.
- Where to inspect the recorded progress (DB/table/queries).

---

## Step 4 – Example 3: CRM “First Win” Onboarding Journey

Business / product logic:

This journey is attached to the existing **CRM Pipeline** example, and aims to help a new user go from **empty CRM** to **first closed-won deal**.

Track concept:

- **Track key**: `crm_first_win`
- Persona: user adopting the CRM template.
- Outcome: user has created basic CRM entities and successfully closed a deal as won.

Suggested steps (bind to the events already used by `@lssm/example.crm-pipeline`):

1. `create_pipeline`
   - “Create a pipeline and basic stages.”
   - Completion:
     - `crm.pipeline.created` plus at least N `crm.stage.created`.
2. `create_contact_and_company`
   - “Create a contact and a company.”
   - Completion:
     - `crm.contact.created`
     - `crm.company.created`.
3. `create_first_deal`
   - “Log your first deal.”
   - Completion:
     - `crm.deal.created`.
4. `move_deal_in_pipeline`
   - “Move a deal across at least 3 stages.”
   - Completion:
     - multiple `crm.deal.stage_moved` events.
5. `close_deal_won`
   - “Close a deal as won.”
   - Completion:
     - `crm.deal.closed` with `status = "won"` or equivalent.
6. (Optional) `setup_follow_up`
   - “Create a follow-up task and notification for a contact or deal.”
   - Completion:
     - `crm.task.created` + `notification.delivery.succeeded`.

Implementation details:

- New example package:
  - `@lssm/example.learning-journey.crm-onboarding`
- Reuse the CRM entities and events from `@lssm/example.crm-pipeline`.
- Only add:
  - Learning Journey track + steps.
  - Event bindings.
  - Optional on-completion XP and “small badge” (if there is a way to represent achievements/badges in the Learning Journey module; otherwise, keep it simple).

Add a README explaining:

- How this track attaches to the CRM Pipeline example.
- How a user is expected to progress.
- Where to see their journey state.

---

## Step 5 – API, UI & Docs Integration

1. Ensure Learning Journey API / contracts expose enough information for:
   - Listing tracks available to a user.
   - Showing progress per track and per step.
   - Marking steps as completed via events (no client-side hacks).
2. If there is a **Studio UI** component for Learning Journeys (or a dedicated page):
   - Register these three tracks so they show up in a meaningful place:
     - `studio_getting_started` could be highlighted prominently for new users.
     - `platform_primitives_tour` could live under “Developer / Platform”.
     - `crm_first_win` could be surfaced when the CRM template is instantiated.
3. Update or create **short documentation**:
   - Either in `docs/` or as READMEs in each example package.
   - Include:
     - Purpose of each track.
     - High-level structure (steps).
     - Where to look in the spec & code.

---

## Step 6 – Tests & Validation

1. Add **unit tests** or **integration tests** for the Learning Journey module and the new tracks:
   - For each track, test that when the relevant events are emitted, steps transition from “not started” → “in progress” → “completed”.
   - Test XP/streak logic for at least one track (e.g. `studio_getting_started`).
2. Ensure the monorepo:
   - Builds successfully.
   - Passes existing tests.
3. If necessary, update any tooling or generators that depend on Learning Journey definitions so they are aware of:
   - track IDs / keys,
   - step IDs / keys,
   - any new fields added in this refactor.

---

Constraints & style:

- Respect the stack, patterns, and naming conventions already used in:
  - other modules,
  - existing examples.
- Be explicit in the spec/IR. The Learning Journey definitions should be readable by humans and AI.
- Prefer clear, boring schema over clever abstractions.
- If the existing Learning Journey code is messy or inconsistent with `PLAN_VNEXT.md`, clean it up while implementing these examples.
