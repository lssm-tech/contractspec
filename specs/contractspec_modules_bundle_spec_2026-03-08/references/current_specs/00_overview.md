# PM Issue Depth, Relations, Custom Fields & Cross-Module Integration

- **Spec:** PM workbench surface spec (pilot for surface runtime)
- **Created:** 2026-03-07
- **Status:** Active
- **Pilot bundle:** `@contractspec/bundle.workspace` or `@contractspec/bundle.library` (`packages/bundles/workspace`, `packages/bundles/library`)
- **Surface runtime:** `@contractspec/lib.surface-runtime` (`packages/libs/surface-runtime`)

---

## Objective

Rebuild PM issues from shallow (title/description/priority) to a deep, relation-rich, customizable, AI-native entity system -- connected to every domain module and powered by the supertag/custom-field paradigm from the knowledge graph spec.

## Current State

The PM issue model carries only: `title`, `description`, `priority` (p0-p3), `status` (6 states), `estimateHours`, `assigneeId`, `dueAt`, plus `projectId`, `cycleId`, `patchIntentId`, and `PmDependency` (blocks/relates_to/parent_of).

Missing: sub-issues, labels/tags, comments, attachments, watchers, custom fields, cross-domain links, activity history, and deep integration with meetings, schedule, loop, and decisions.

## Architecture: Three-Layer Approach

### Layer 1: Issue Core Deepening

Brings PM issues to competitor parity (Linear/Jira/Plane baseline):
- Sub-issue hierarchy (self-referential parent/child)
- Labels and tags
- Threaded comments with rich text
- Attachments
- Watchers and @-mentions
- Activity history with agent/user/system distinction
- Cross-domain link system

### Layer 2: Custom Fields via Supertag Integration

Lets users add/remove/edit fields on issues (like Notion databases):
- Issue types as supertags (`#bug`, `#feature`, `#epic`, `#task`, `#spike`)
- 8 field types: text, number, date, checkbox, select, options, instance, url
- Supertag inheritance for field composition
- Dynamic field rendering in UI
- Migration path to Plan 12 knowledge graph

### Layer 3: Cross-Domain Relations

Connects every PM issue to meetings, schedule, loop runs, decisions, bookings, and content ops:
- Unified `PmIssueLink` system with typed cross-domain references
- Meeting Intelligence bridge (auto-link extracted action items/decisions)
- Schedule bridge (two-way sync between issues and time blocks)
- Loop signal bridge (PM events as loop signals, loop outcomes as issues)
- Decision bridge (focus/opportunity -> issue creation with causal links)
- Graph node projection prep for Plan 12

### Layer 4: AI-Native Agentic Integration

Makes AI agents first-class participants in issue lifecycle:
- Agent-authored activity tracking (actorType: user/agent/system)
- Smart defaults and auto-population (labels, priority, links, assignments)
- Issue creation from any source (MCP, meeting extraction, loop outcome)
- Governed autonomy per mode (Guided/Pro/Autopilot)

## Success Metrics

- Issue depth score: average number of non-empty fields per issue
- Relation density: average cross-domain links per issue
- Custom field adoption: % of workspaces with at least one custom issue type
- Agent contribution rate: % of activity records authored by agents
- Cross-module handoff latency: time from meeting extraction to PM issue creation

## Spec Files

| File | Description |
|------|-------------|
| [01_data_model.md](./01_data_model.md) | Full schema definitions |
| [02_cross_domain_relations.md](./02_cross_domain_relations.md) | Relation taxonomy and bridge patterns |
| [03_custom_fields.md](./03_custom_fields.md) | Supertag-based custom field system |
| [04_ai_native_patterns.md](./04_ai_native_patterns.md) | Agent integration and auto-enrichment |
| [implementation_plan.md](./implementation_plan.md) | Phased delivery plan |
