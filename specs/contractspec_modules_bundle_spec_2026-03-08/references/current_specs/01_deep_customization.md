# Deep Customization: Notion-Like Issue Richness

- **Extends:** [pm_issue_depth_and_relations/03_custom_fields.md](../pm_issue_depth_and_relations/03_custom_fields.md)
- **Created:** 2026-03-07
- **Status:** Active

---

## Objective

Bring PM issues to Notion-like richness: relation fields, computed rollups, formulas, multi-people assignees, multi-supertag support, workspace field libraries, status automations, issue templates, saved views, and field validation—all while keeping the supertag paradigm and ContractSpec alignment.

---

## Current State

### Existing Field Types (8)

| Type | Notes |
|------|-------|
| `text` | Single-line or multi-line |
| `number` | Integer or decimal |
| `date` | Date or datetime |
| `checkbox` | Boolean |
| `select` | Single choice from options |
| `options` | Multi-choice from options |
| `instance` | Reference to another entity (generic) |
| `url` | Hyperlink |

---

## New Field Kinds

### Relation

References other entities (issues, meetings, decisions, etc.). Config: `targetEntityType`, `linkType`, `cardinality` (one/many).

```json
{
  "fieldType": "relation",
  "config": {
    "targetEntityType": "issue",
    "linkType": "blocks",
    "cardinality": "many"
  }
}
```

### Rollup

Computed aggregation from a relation field. Config: `relationFieldId`, `aggregate` (count, sum, avg, min, max), `sourceFieldId` (optional, for sum/avg).

```json
{
  "fieldType": "rollup",
  "config": {
    "relationFieldId": "field_blocks",
    "aggregate": "count"
  }
}
```

### Formula

Calculated from other field values. Config: `expression` (string, e.g. `{field_a} + {field_b}`), `resultType` (number, text, date, checkbox).

```json
{
  "fieldType": "formula",
  "config": {
    "expression": "{story_points} * {count}",
    "resultType": "number"
  }
}
```

### People

Multi-assignee, reviewers, stakeholders. Config: `role` (assignee, reviewer, stakeholder), `maxCount` (optional).

```json
{
  "fieldType": "people",
  "config": {
    "role": "assignee",
    "maxCount": 5
  }
}
```

---

## Multi-Supertag Support

An issue can have **multiple** types applied (e.g. `#bug` + `#customer-facing`). Each type adds its fields. Field resolution:

- **Collision**: Same field name from multiple types → resolved by type application order (first wins).
- **Inheritance**: All types inherit from `#pm-issue`; fields are merged.
- **Schema**: `PmIssueTypeJoin` (issueId, issueTypeId, sortOrder).

---

## Workspace Field Library

Reusable field definitions shared across issue types.

### PmFieldTemplate

| Field | Type | Required |
|-------|------|----------|
| `fieldTemplateId` | string | yes |
| `workspaceId` | string | yes |
| `name` | string | yes |
| `fieldType` | enum | yes |
| `config` | JSON | no |
| `sortOrder` | number | yes |
| `createdAt` | datetime | yes |
| `updatedAt` | datetime | yes |

`PmIssueTypeField` can reference `fieldTemplateId` when adding a field from the library.

---

## Status Automations

### PmStatusAutomation

| Field | Type | Required |
|-------|------|----------|
| `automationId` | string | yes |
| `workspaceId` | string | yes |
| `name` | string | yes |
| `trigger` | enum | yes |
| `triggerConfig` | JSON | no |
| `action` | enum | yes |
| `actionConfig` | JSON | no |
| `enabled` | boolean | yes |
| `createdAt` | datetime | yes |
| `updatedAt` | datetime | yes |

**Triggers**: `all_sub_issues_closed`, `blocker_resolved`, `priority_changed`, `assigned`, `due_date_passed`.

**Actions**: `auto_close`, `auto_reopen`, `assign_to`, `notify`, `create_sub_issue`.

**Example**: All sub-issues closed → auto-close parent.

---

## Issue Templates

### PmIssueTypeTemplate

| Field | Type | Required |
|-------|------|----------|
| `templateId` | string | yes |
| `workspaceId` | string | yes |
| `issueTypeId` | string | yes |
| `name` | string | yes |
| `prefilledFields` | JSON | no |
| `defaultLinks` | JSON | no |
| `autoEnrichRules` | JSON | no |
| `createdAt` | datetime | yes |
| `updatedAt` | datetime | yes |

- **prefilledFields**: Map of fieldId → default value.
- **defaultLinks**: Array of link templates (targetEntityType, linkType).
- **autoEnrichRules**: Trigger conditions for auto-enrich (e.g. on create, on status change).

---

## Saved Views

### PmIssueView

| Field | Type | Required |
|-------|------|----------|
| `viewId` | string | yes |
| `workspaceId` | string | yes |
| `name` | string | yes |
| `filter` | JSON | no |
| `sort` | JSON | no |
| `groupBy` | JSON | no |
| `displayType` | enum | yes |
| `config` | JSON | no |
| `createdAt` | datetime | yes |
| `updatedAt` | datetime | yes |

**Display types**: `board`, `list`, `table`, `timeline`, `calendar`.

**Filter**: `{ fieldId, operator, value }[]` (e.g. status = done, priority >= p1).

**Sort**: `{ fieldId, direction }[]`.

**GroupBy**: `{ fieldId }` (e.g. status, assignee).

---

## Field Sections

### PmFieldSection

Collapsible grouping for UI layout.

| Field | Type | Required |
|-------|------|----------|
| `sectionId` | string | yes |
| `issueTypeId` | string | yes |
| `name` | string | yes |
| `sortOrder` | number | yes |
| `collapsed` | boolean | no |
| `createdAt` | datetime | yes |
| `updatedAt` | datetime | yes |

Fields belong to a section via `PmIssueTypeField.sectionId`.

---

## Field Validation Rules

| Rule | Config | Notes |
|------|--------|-------|
| `required` | — | Field must have value |
| `min` | `number` | Min value for number/date |
| `max` | `number` | Max value for number/date |
| `regex` | `string` | Pattern for text |
| `dependentVisibility` | `{ fieldId, operator, value }` | Show only when condition met |

Stored in `PmIssueTypeField.config.validation`.

---

## Data Model Summary

| Model | Purpose |
|-------|---------|
| `PmFieldTemplate` | Workspace field library |
| `PmIssueTypeJoin` | Multi-supertag per issue |
| `PmStatusAutomation` | Trigger/action automations |
| `PmIssueTypeTemplate` | Pre-filled issue templates |
| `PmIssueView` | Saved filter/sort/group/display |
| `PmFieldSection` | Collapsible field grouping |

---

## Operations

| Domain | Operation | Description |
|--------|-----------|-------------|
| Field template | `pm.field-template.create` | Create reusable field |
| Field template | `pm.field-template.update` | Update config |
| Field template | `pm.field-template.delete` | Remove from library |
| Field template | `pm.field-template.list` | List workspace templates |
| Issue type | `pm.issue-type.join.add` | Add type to issue |
| Issue type | `pm.issue-type.join.remove` | Remove type from issue |
| Automation | `pm.status-automation.create` | Create automation |
| Automation | `pm.status-automation.update` | Update trigger/action |
| Automation | `pm.status-automation.delete` | Remove automation |
| Automation | `pm.status-automation.list` | List workspace automations |
| Template | `pm.issue-template.create` | Create issue template |
| Template | `pm.issue-template.update` | Update prefilled/defaults |
| Template | `pm.issue-template.delete` | Remove template |
| Template | `pm.issue-template.list` | List by issue type |
| View | `pm.issue-view.create` | Create saved view |
| View | `pm.issue-view.update` | Update filter/sort/group |
| View | `pm.issue-view.delete` | Remove view |
| View | `pm.issue-view.list` | List workspace views |
| Section | `pm.field-section.create` | Create section |
| Section | `pm.field-section.update` | Update name/order |
| Section | `pm.field-section.delete` | Remove section |

---

## Migration

- Extend `PmIssueTypeField.fieldType` enum with `relation`, `rollup`, `formula`, `people`.
- Add `sectionId` to `PmIssueTypeField`.
- Add `fieldTemplateId` to `PmIssueTypeField` (optional FK).
- Add `validation` to `PmIssueTypeField.config` schema.
