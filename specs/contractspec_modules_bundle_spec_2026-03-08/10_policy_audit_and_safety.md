# Policy, Audit, and Safety

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Ensure the bundle runtime obeys the same rigor ContractSpec applies elsewhere: policy-aware rendering, auditable changes, and safe AI assistance.

## Principle

A UI surface is a policy surface.

If a user is not allowed to:
- read a field,
- trigger an action,
- reveal a relationship,
- or persist a customization,

then the surface system must respect that before anything renders.

## Policy checkpoints

### 1. Surface eligibility

Can this actor access the route or surface at all?

### 2. Node visibility

Can this actor see:
- this field
- this relation
- this section
- this widget
- this raw payload viewer

### 3. Action availability

Can this actor:
- execute this operation
- invoke this bulk action
- use this command
- ask the assistant to perform this action

### 4. Customization permissions

Can this actor:
- rearrange panels
- save personal layout
- publish workspace layout
- install widgets
- approve AI proposals

## Required policy effects

A PDP decision should support at least:
- allow
- deny
- redact
- disable-with-reason
- require-approval
- allow-session-only

## Suggested evaluation output

```ts
export interface UiPolicyDecision {
  targetId: string;
  effect: "allow" | "deny" | "redact" | "disable" | "require-approval";
  reason?: string;
  redactions?: string[];
}
```

## Rendering implications

### Deny
Hide the node or surface entirely.

### Redact
Show the structure, but remove or mask sensitive content.

### Disable
Show the action but disable it and explain why.

### Require approval
Allow the interaction to be proposed, but do not commit without approval.

## Assistant safety model

The assistant must be policy-aware in two ways.

### 1. Input shaping
Do not give the model raw context it should not see.

### 2. Output shaping
Do not allow the model to propose actions or patches outside allowed capabilities.

## Audit log requirements

Every meaningful mutation should write an audit event.

Examples:
- user saved personal layout
- user published workspace layout
- AI proposed patch
- AI patch approved
- AI patch rejected
- overlay failed validation
- policy denied action
- field hidden by policy
- relation panel redacted

## Suggested audit event shape

```ts
export interface BundleAuditEvent {
  eventId: string;
  at: string;
  actorId?: string;
  source: "user" | "assistant" | "system" | "policy";
  bundleKey: string;
  surfaceId?: string;
  eventType:
    | "surface.resolved"
    | "patch.proposed"
    | "patch.approved"
    | "patch.rejected"
    | "overlay.saved"
    | "overlay.applied"
    | "overlay.failed"
    | "policy.denied"
    | "policy.redacted";
  payload: Record<string, unknown>;
}
```

## Rollback model

Durable changes must be reversible.

For every accepted patch or overlay:
- store the forward ops
- store inverse ops
- store who/what approved it
- store scope
- store reason

That supports:
- undo
- rollback
- diff view
- postmortem analysis

## Sensitive surfaces

Some surfaces should be marked as high-sensitivity:
- policy editors
- raw config editors
- PII-heavy entity views
- high-impact automation editors

For these surfaces:
- default to deliberate pace
- require clearer approval
- keep more verbose audit trails
- restrict AI patching more aggressively

## Voice and media gating

If a surface supports voice or hybrid modes, policy must still decide:
- who can access it
- whether transcripts are stored
- whether audio can be generated or only consumed
- whether sensitive content may be narrated

## Safe defaults

### Default allowlist for AI patching

Allow by default:
- `set-focus`
- `insert-node` into assistant/helper slots
- `set-layout` within current session

Require stronger checks for:
- `remove-node`
- `hide-field`
- `promote-action`
- workspace persistence

## Transparent explanations

When something is hidden or disabled, give the user a reason when appropriate.

Good:
- “This field is hidden because it contains restricted finance data.”
- “Publishing this layout requires workspace admin approval.”

Bad:
- silent disappearance
- unexplained disabled buttons
- AI saying “I can’t do that” with no useful context

## Final stance

AI-native does not mean soft governance.

If anything, AI-native interfaces need **stronger** policy and audit semantics because the system is making more adaptive decisions, not fewer. Humans already manage to create enough chaos with static UIs. Let’s not give stochastic tools a blank check.
