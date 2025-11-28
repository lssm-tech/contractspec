You are working inside the **ContractSpec Studio** monorepo.

ContractSpec is a **spec-first, policy-safe application compiler** for the AI era:

- The **spec / IR is the canonical source of truth** for the system.
- It generates and regenerates **DB, API, UI, events, jobs, policies, and cross-cutting infra** from that spec.
- Human and AI developers should primarily **edit the spec**, then regenerate code, rather than patching generated code directly.
- Generated code must be **standard, readable, ownable**, and runnable without proprietary runtimes.
- ContractSpec is the **deterministic layer** that keeps AI-written and human-written systems coherent and safe over time.

Use the existing technical rules in the workspace for stack, libraries, and coding style. This prompt focuses on **product, domain, architecture, and priorities**.

---

## Global goals for all work

Across cross-cutting modules and examples, your objectives are:

1. **Spec-first design**
   - Domain concepts and behavior live in ContractSpec.
   - Code is a projection of the spec and can be regenerated deterministically.
   - When behavior changes are needed, prefer editing the spec and regenerating.

2. **Multi-surface coverage**
   - Wherever relevant, keep DB schemas, APIs, UI, events, jobs, policies, and analytics consistent.
   - Regeneration must align all surfaces.

3. **Safe regeneration**
   - Changes in the spec must:
     - produce **clear, reviewable diffs**,
     - be **reversible**,
     - avoid silently breaking public contracts or critical flows.

4. **No hard vendor lock-in**
   - Generated code must rely on **standard tech** (TypeScript, Node, web frameworks, etc.).
   - Apps should be runnable independently of ContractSpec at runtime.
   - Users own their code and should be able to export it.

5. **Incremental adoption**
   - ContractSpec should be adoptable **module-by-module**, not only through big-bang rewrites.
   - Integration strategies should support wrapping or extending existing apps.

---

## Ownership & lock-in principles (non-negotiable)

When designing modules and examples:

- Users **own 100% of the generated code**.
- Code must be:
  - readable,
  - idiomatic for the chosen stack,
  - runnable without a proprietary ContractSpec runtime.
- The spec and IR should be **transparent and documented**, not opaque.
- It must always be possible to:
  - export the whole generated project,
  - continue maintaining it without ContractSpec if necessary.

If a design increases lock-in or hides too much logic in a non-standard runtime, prefer a different design.

---

## AI behavior guidelines (for you as an agent)

- Prefer **editing specs** (contracts, entities, workflows, policies, integrations) and then regenerating, rather than patching generated code across multiple layers.
- **Explain changes**:
  - what changed in the spec,
  - why,
  - expected impact on API, UI, DB, events, jobs.
- Do not introduce “magic” behavior that:
  - can’t be diffed,
  - can’t be explained,
  - can’t be audited.
- Respect guardrails:
  - no designs that create strong vendor lock-in,
  - no hidden coupling outside the spec.

---

## Cross-cutting modules (build once, reuse everywhere)

These are **core primitives** that many examples will depend on. Implement them as ContractSpec modules/packages that can be reused across apps.

### 1. Identity, Organizations & RBAC

**Goal:**  
Provide a reusable identity and authorization foundation for multi-tenant, multi-role applications.

**Scope:**

- `User`
- `Org` (organization / tenant)
- `OrgMembership` (role per org)
- Basic RBAC policy primitives:
  - org-level roles: `owner`, `admin`, `member`
  - resource-level permissions (e.g. `can_manage_project`, `can_view_billing`)

**Spec responsibilities:**

- Expression of roles and permissions at spec level.
- Rules like:
  - “Who can create orgs?”
  - “Who can invite members?”
  - “Who can access resource X?”

**Usage:**

- Reused by: SaaS boilerplate, CRM, Agent console, Marketplace, Service OS, Wealth app, Team Hub, etc.

---

### 2. Event Bus & Audit Trail

**Goal:**  
Provide a consistent way to model events and audits across all apps.

**Scope:**

- Event definitions:
  - name, domain, payload schema, severity
- Audit log:
  - `actor` (user/agent/system)
  - `target` (resource reference)
  - payload / diff
  - timestamp

**Spec responsibilities:**

- Declare domain events like `deal.created`, `order.completed`, `agent.run.failed`, `invoice.sent`, etc.
- Attach events to domain actions and workflows.
- Provide retention and privacy metadata where needed.

**Usage:**

- Powering logging, analytics, notifications, workflows, and debugging across all examples.

---

### 3. Notification & Messaging Center

**Goal:**  
Model notifications in a consistent, reusable way.

**Scope:**

- `NotificationChannel`: email, in-app, webhook, etc.
- `Template`: message body with variables/placeholders.
- `NotificationRule` / trigger:
  - event → recipients → channels → template.
- Delivery records:
  - queued, sent, failed, retries.

**Spec responsibilities:**

- Map domain events to notifications:
  - e.g. `user.invited`, `invoice.overdue`, `workflow.approval_requested`.
- Define who gets notified and through which channels.
- Basic user/org preferences (opt-in/out by channel).

**Usage:**

- Used for invites, reminders, order updates, workflow approvals, learning nudges, etc.

---

### 4. Background Jobs & Scheduler

**Goal:**  
Provide a generic system for asynchronous and scheduled work.

**Scope:**

- `Job`:
  - type, payload, status, attempts, scheduled_at, last_error.
- Job handlers / types:
  - e.g. `send_notification`, `sync_integration`, `recalculate_metrics`, `expire_trial`.
- Scheduling:
  - support for recurring jobs (interval/cron-like spec).

**Spec responsibilities:**

- Declare job types and constraints:
  - max retries, backoff policy, timeout.
- Associate jobs with events or schedules:
  - e.g. run nightly metrics, periodic sync, reminder jobs.

**Usage:**

- Integrations sync, notification delivery, metrics aggregation, periodic cleanups, learning reminders.

---

### 5. Feature Flags & Experiments

**Goal:**  
Enable safe feature rollouts and experiments across apps.

**Scope:**

- `FeatureFlag`:
  - key, description, status (on/off/gradual).
- Targeting:
  - by org, user, plan, or segment.
- Optional experiments:
  - variants, split ratios, monitored metrics.

**Spec responsibilities:**

- Define flags and where they apply:
  - UI blocks, endpoints, behavior branches.
- Ensure critical flows are protected and not randomly experimented on.

**Usage:**

- Gradual rollouts for new features in CRM, Agent console, Marketplace, Wealth app, learning flows, etc.

---

### 6. Files, Documents & Attachments

**Goal:**  
Provide a consistent way to manage files and document attachments.

**Scope:**

- `File` / `Document`:
  - id, owner, org, mime_type, size, storage location/provider, created_at.
- Attachments:
  - linking files to entities: deals, requests, jobs, assets, invoices, learning steps.

**Spec responsibilities:**

- Define which entities can have attachments.
- Access control for files:
  - who can upload, view, delete.
- Basic retention rules.

**Usage:**

- Proposals, contracts, reports, photos, invoices, tax statements, learning materials.

---

### 7. Usage, Metering & Billing Core

**Goal:**  
Define a generic metering system for usage-based features and billing.

**Scope:**

- `UsageRecord`:
  - subject (org/user),
  - metric key (`regenerations`, `agent_runs`, `api_calls`, `active_clients`, etc.),
  - quantity, period.
- `MetricDefinition`:
  - name, unit, aggregation (daily/monthly), description.
- Integration hooks with plans/billing where needed.

**Spec responsibilities:**

- Define billable metrics and how they are counted.
- Associate metrics with pricing/plans externally (if required at this stage).

**Usage:**

- For ContractSpec Studio itself (regeneration, projects, seats).
- For vertical apps that might meter by jobs, clients, processed docs, etc.

---

### 8. Learning Journey / Self-Taught Engine

**Goal:**  
Provide a **Learning Journey Engine** that can orchestrate self-guided + product-integrated learning paths.

**Scope:**

- `Learner` profile (usually a user).
- `Track`:
  - e.g. “Get started with SaaS boilerplate”, “CRM basics”, “Equitya onboarding”.
- `Module` / `Unit` within a track.
- `Step`:
  - can contain:
    - content (lesson/explanation),
    - optional bound product action (e.g. “create first deal”, “connect bank”),
    - completion condition (event-driven).
- `Progress` for learner/track.

**Spec responsibilities:**

- Describe the structure of tracks, modules, steps.
- Bind steps to actual product events:
  - completion is not just “next clicked” but “action happened”.

**Usage:**

- Onboarding to ContractSpec Studio itself.
- Vertical self-taught journeys in Equitya, ArtisanOS, etc.

---

## Application examples (reference apps) & priorities

You will implement a set of example applications inside the Studio. Each should:

- Reuse the cross-cutting modules where applicable.
- Be spec-first, multi-surface (DB/API/UI/events/permissions).
- Demonstrate **safe regeneration**: changing the spec updates all surfaces coherently.

Organize these under a clear structure (e.g., `examples/`), each with:

- ContractSpec definitions (spec/IR).
- Generated adapters (API, UI, jobs, etc.).
- A short README explaining purpose, entities, flows, and what to look at for regeneration.

### Phase 1 – Core product examples (highest priority)

#### 1) AI-Native SaaS Boilerplate (Auth + Orgs + Billing)

_Priority: 1_

**Goal:**  
Provide a realistic SaaS base that many AI-native products could adopt.

**Scope:**

- Users, orgs, memberships (reuse Identity & RBAC module).
- Roles: owner/admin/member.
- Projects/workspaces as core resource.
- Basic billing & plan awareness (can leverage Usage & Billing core later).
- Settings and simple audit log (via Event & Audit module).

**Why it matters:**

- Mirrors the starting point of many startups and agencies.
- Stresses multi-tenant logic, RBAC, and plan-based feature gating.
- Acts as a base for other examples if desired.

**Constraints:**

- Permissions and org/role rules expressed in the spec.
- Regeneration must keep project/tenant boundaries safe.
- Generated code is standard stack, no proprietary runtime.

---

#### 2) CRM & Deal Pipeline (with Kanban)

_Priority: 2_

**Goal:**  
Model a small CRM with contacts, companies, deals, pipeline stages, and tasks.

**Scope:**

- Contacts, companies, deals.
- Pipeline stages (kanban-style).
- Tasks / reminders.
- Search/filter endpoints.
- Events: `deal.created`, `deal.moved`, `task.completed` (via Event module).

**Why it matters:**

- Very common and highly relatable.
- Demonstrates cross-entity relationships, UI views, and regen when changing pipelines or fields.

**Constraints:**

- Pipeline and required fields defined in the spec.
- Changes to pipeline or fields propagate to forms, validation, and UI.
- Regeneration must avoid breaking existing clients when possible.

---

#### 3) AI Agent Ops Console (“AgentControl”)

_Priority: 3_

**Goal:**  
Provide a console for managing AI agents, tools, and runs.

**Scope:**

- Tools registry (name, schemas, rate limits, auth).
- Agents: model, tools, policies, config.
- Runs: history, status, logs.
- Events: `run.started`, `tool.called`, `run.failed`, `run.completed`.

**Why it matters:**

- Direct match to AI-first ICP.
- Shows ContractSpec as a spec layer for tools, agents, and operations.

**Constraints:**

- Tool and agent definitions live in the spec.
- UI should allow listing/inspect tools, agents, runs.
- Regeneration must preserve run records and agent semantics.

---

### Phase 2 – State, policy and multi-party flows

#### 4) Workflow / Approval System (State Machine)

_Priority: 4_

**Goal:**  
Implement a generic approval workflow system driven by state machines and policies.

**Scope:**

- Items/requests with states (draft, submitted, approved, rejected, etc.).
- Workflow definitions: states + allowed transitions.
- Role-based permissions on transitions.
- Comments and history (via events/audit).

**Why it matters:**

- Ideal to showcase policy logic at spec level.
- Demonstrates UI + API actions driven by the same state machine.

**Constraints:**

- State machine clearly expressed in the spec.
- Regeneration must update allowed transitions and UI actions without silently breaking existing items.
- Integrate with RBAC and Audit modules.

---

#### 5) Marketplace (2-sided, payouts & reviews)

_Priority: 5_

**Goal:**  
Build a generic marketplace between providers and clients.

**Scope:**

- Providers and clients (reuse Identity/Org where possible).
- Listings.
- Orders and order lifecycle.
- Commission and payout model.
- Reviews/ratings.

**Why it matters:**

- Exercises multi-actor flows and money logic.
- Very relevant to agencies and product builders.

**Constraints:**

- Commission logic and order states defined in the spec.
- Events like `order.created`, `order.completed`, `payout.queued`, `review.posted`.
- Regeneration must not silently alter payment semantics.

---

### Phase 3 – Integrations and analytics

#### 6) Integration Hub (3rd-Party Sync Center)

_Priority: 6_

**Goal:**  
Model a generic sync center for external integrations.

**Scope:**

- `Integration` types (Slack, Notion, GitHub, etc.).
- `Connection` per org/user (credentials, status).
- Sync jobs + logs (reuse Jobs & Scheduler).
- Mappings of remote → local entities.
- Events for sync lifecycle.

**Why it matters:**

- Demonstrates ContractSpec’s ability to shape integration behaviors.
- Useful for agencies and platform teams.

**Constraints:**

- Remain provider-agnostic where possible.
- Job types and mappings at spec level.
- Regeneration must preserve sync job history.

---

#### 7) Analytics & Events Dashboard (Multi-tenant)

_Priority: 7_

**Goal:**  
A basic analytics system built on top of the Event Bus.

**Scope:**

- Event type registry (reuse Event module).
- Ingestion endpoints.
- Simple queries:
  - by event type,
  - by timeframe,
  - by org.
- Dashboard views (counts, charts).

**Why it matters:**

- Uses events as a foundation for metrics and dashboards.
- Shows co-evolution of event schemas and analytics.

**Constraints:**

- Event schemas and metrics definitions should live in the spec.
- Regeneration must keep dashboards aligned with event changes.
- Support multi-tenant isolation.

---

### Phase 4 – Verticalized and workflow-heavy examples

#### 8) Service Business OS (Jobs, Quotes, Invoices)

_Priority: 8_

**Goal:**  
Implement a small back-office for service businesses.

**Scope:**

- Clients.
- Quotes/proposals.
- Jobs/interventions.
- Invoices and payments.
- Calendar or schedule view.

**Why it matters:**

- Applicable to artisan/field-service and agency-type verticals.
- Good lifecycle: quote → job → invoice.

**Constraints:**

- States and transitions (e.g., quote accepted, job scheduled, invoice paid) defined in the spec.
- Events: `quote.accepted`, `job.completed`, `invoice.sent`.
- Regeneration must keep accounting-related flows coherent.

---

#### 9) Team Hub (Tasks, Rituals, Announcements)

_Priority: 9_

**Goal:**  
A lightweight internal tool with tasks, rituals, and announcements.

**Scope:**

- Spaces/projects.
- Tasks.
- Rituals (recurring meetings/check-ins).
- Announcements.

**Why it matters:**

- Embeds your “ritual” / “ceremony” design philosophy.
- Another realistic multi-entity internal app.

**Constraints:**

- Ritual configuration (schedule, participants, type) specified in the spec.
- Events for ritual occurrences and task completions.
- Regeneration must not break existing ritual schedules.

---

#### 10) Wealth Snapshot Mini-App (Mini-Equitya)

_Priority: 10_

**Goal:**  
Provide a simple wealth snapshot for a person or household.

**Scope:**

- Accounts.
- Assets and liabilities.
- Net worth and basic indicators (runway, savings rate).
- Simple goals.

**Why it matters:**

- Exercises a more complex financial domain.
- Connects ContractSpec to future Equitya/Wealth AI verticals.

**Constraints:**

- Domain must stay minimal but consistent.
- Indicators and goal rules defined in the spec where possible.
- Regeneration must not silently change financial meaning.

---

## Using cross-cutting modules inside examples

For each example:

- Reuse the Identity & RBAC module for auth, orgs, and roles.
- Emit domain events through the Event Bus.
- Attach Notifications via Notification Center where appropriate.
- Use Jobs & Scheduler for async or periodic work.
- Use Files/Attachments for documents where relevant.
- Use Usage & Metering where you want to track billable or important usage.
- Use Learning Journey module to define onboarding/education flows where appropriate.
- Use Feature Flags when introducing optional or experimental behavior.

---

## Execution order (high-level)

1. Implement core cross-cutting modules:
   - Identity & RBAC,
   - Event Bus & Audit Trail,
   - Notification Center (initial),
   - Background Jobs & Scheduler (basic).
2. Implement Phase 1 examples on top of them.
3. Expand cross-cutting modules (Files, Usage/Metering, Feature Flags, Learning Journeys).
4. Implement Phase 2–4 examples, reusing cross-cutting modules.
5. Continuously validate **spec-first**, **multi-surface**, **safe regeneration** behavior.

Focus on correctness, clarity, reusability, and alignment with ContractSpec’s role as the **spec + compiler + governance layer for AI-era software**.
