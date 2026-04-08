# Builder Product Strategy

## Strategic thesis

Builder should start with a **prosumers + operator** wedge, not with the fantasy that every mainstream user wants a generalized autonomous platform on day one.

The product strategy is:
1. lower the barrier enough that a motivated non-engineer or prosumer can start,
2. win on security, stability, and ubiquity,
3. make data integration and context ingestion unusually strong,
4. let advanced users choose local runtime,
5. let mainstream users choose managed runtime,
6. shift value toward concrete applications rather than “agent platform” theater.

## Target profiles

### 1. Power user / prosumer
Examples:
- startup operator,
- technical founder who does not want to hand-roll infra,
- consultant,
- product manager,
- advanced tinkerer.

Needs:
- local runtime option,
- provider choice,
- better control over data locality,
- strong diagnostics,
- ability to work from mobile when away from desktop.

### 2. Non-engineer operator
Examples:
- founder,
- operations lead,
- office manager,
- growth / sales / support lead,
- subject-matter expert.

Needs:
- managed runtime by default,
- zero-setup or near-zero-setup onboarding,
- guided authoring,
- mobile-first review and approvals,
- strong safety rails.

### 3. Team admin / governance owner
Needs:
- policy packs,
- role-based approvals,
- export controls,
- audit and replay,
- provider allowlists,
- runtime mode policy.

## Design principles

### Low barrier first
The system should make first success easy:
- chat,
- voice,
- upload docs,
- import Studio data,
- start from a managed workspace or a local runtime handshake.

### Security and stability over agent theatrics
A stable boring system beats a clever flaky one.
If a feature increases autonomy but weakens explainability, replay, or approval integrity, default to the safer shape.

### Ubiquity means mobile parity
Users who live in Telegram or WhatsApp must not become second-class operators.
Function parity matters more than interface symmetry.

### Data integration is a first-class product surface
Builder should be unusually good at consuming:
- documents,
- snapshots,
- media,
- conversational context,
- structured records,
- approved Studio memory.

### Apps over platform mythology
Mainstream users buy outcomes, not systems diagrams.
Builder should bias toward templates, app classes, and guided outcomes.

## Success metrics

Early:
- first usable draft in under 15 minutes for managed users,
- first local runtime connected in under 20 minutes for power users,
- mobile approval completion rate,
- percentage of exports with complete evidence bundles.

Later:
- template-to-export conversion,
- managed retention,
- local-to-managed migration success,
- incident-free high-risk review rate,
- percentage of provider runs accepted after harness verification.

## Recommended first app classes

- internal ops dashboards,
- form and approval workflows,
- lightweight CRM / backoffice tools,
- portal-style apps,
- knowledge/process assistants with governed actions,
- constrained multi-channel service consoles.

## Strategic anti-goals

Do not lead with:
- “build any software from one prompt,”
- “replace software engineers,”
- “fully autonomous repo mutation from WhatsApp,”
- “hardware as the permanent core identity.”

Hardware or local runtime can be a wedge.
It should not become the prison.
