---
targets:
  - '*'
root: false
description: 'Enforce Guided / Pro / Autopilot mode contracts, capabilities matrix, guardrails, and safety invariants'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'Mode governance: Guided / Pro / Autopilot boundaries and safety'
  globs:
    - '**/*'
---

# Mode Governance: Guided / Pro / Autopilot

"All three modes run the same loop. They differ only in defaults, automation, and gating. Never break mode boundaries silently."

## Core Loop (shared by all modes)

**Feedback -> Patterns -> Focus -> Brief -> Action Item Intent -> Impact -> Export -> Check -> Stakeholder brief**

Every mode executes this loop. Modes differ on:

- How much user input is required
- How often the loop runs
- What gets automated
- Who can perform actions (roles/entitlements)

## Mode Definitions

### Guided (default for new users)

- Step-by-step wizard with strong guardrails
- Minimal choices, pre-filled templates, constrained configuration
- Primary outcome: first successful loop in < 15 minutes
- `ModeConfig`: `ceremonyStepped: true`, `helpTooltips: true`, `layoutDensity: 'comfortable'`, `integrationConfigLevel: 'simple'`

### Pro (power-user mode)

- Full control: editable Brief, Action Item Intent, filters, pattern tuning
- Explicit risk and policy controls with confirmation on high-risk actions
- Primary outcome: repeatable weekly workflow for real teams
- `ModeConfig`: `showIds: true`, `showAdvancedFields: true`, `ceremonyStepped: false`, `integrationConfigLevel: 'advanced'`

### Autopilot (background, plan-gated)

- Scheduled runs + feedback sync triggers
- Produces drafts, exports, checks, stakeholder briefs automatically
- Always gated by risk thresholds and "Needs Review" queue
- Primary outcome: continuous improvement loop without manual prompting
- Requires: workspace admin, healthy feedback streams, min feedback threshold

## Capabilities Matrix (source of truth)

The canonical matrix lives in `packages/libs/contracts-contractspec-studio/src/mode/capabilities-matrix.ts`.

Key rules:

- `available`: feature works with no restrictions
- `gated`: feature works with constraints (shown to user)
- `unavailable`: feature is blocked in this mode

Critical boundaries:
| Capability | Guided | Pro | Autopilot |
|---|---|---|---|
| Scheduled sync | unavailable | gated | available |
| Pattern editing | unavailable | available | gated (review queue) |
| Auto-export | unavailable | unavailable | gated (risk-gated, OFF by default) |
| Advanced policies | unavailable | available | available |
| Voice note (auto) | gated (manual) | gated (manual) | available |

## Safety Invariants (never violate)

1. **No auto-commit in v0**: Planning + export only. Never push code directly.
2. **Everything auditable**: Every state-changing operation MUST call `recordAudit()`. Feedback IDs, rules fired, exports created must be traceable.
3. **Everything reversible**: Cancel exports, pause Autopilot, revert mode switches. No one-way doors.
4. **No silent failures**: Fallbacks must be explicit and visible to the user.
5. **Auto-export defaults OFF**: Unless the user explicitly enables it in Autopilot config.
6. **Autopilot = workspace admin only**: `validateWorkspaceAdmin()` must gate all Autopilot config changes.
7. **Needs Review queue is mandatory**: Every Autopilot run must produce either `certified` or `needs_review` status.
8. **Hard usage caps enforced**: Autopilot runs, exports, and chunks have hard caps to prevent runaway costs.

## Implementation Requirements

### Client-side (React)

- Always use `useMode()` or `useCapability()` from `mode-context.tsx` to check mode state
- Never compare mode strings directly outside the mode context
- Use `canAccess(capability)` for conditional rendering, not `isPro` / `isGuided` booleans (those are convenience only)
- Feature-flag gate Pro mode behind `MODE_PRO_ENABLED`
- Feature-flag gate Guided default behind `GUIDED_MODE_DEFAULT`
- Show disabled/paywall state for Autopilot when entitlements don't include it

### Server-side (API routes)

- Every route in `OPERATION_CAPABILITY_MAP` MUST call `assertCapability(capabilityKey, mode)` before executing
- Mode switch (`/api/mode` PUT) MUST call `recordAudit()` with action `'mode_switch'`
- `computeEntitlements()` MUST receive the workspace's actual billing state, not `null`
- Capability gate violations return 403 with structured error body

### State machine (per spec section 08)

- Loop steps should track state: `idle -> running -> succeeded | fallback | failed`
- No step can end without a transition to a next action
- Autopilot run lifecycle: `planned -> running -> certified | needs_review | failed | suppressed`

### Feature flags

- `GUIDED_MODE_DEFAULT` -- default new users to Guided
- `MODE_PRO_ENABLED` -- gate Pro mode availability
- `AUTOPILOT_ENABLED` -- gate Autopilot at plan level
- `AUTOPILOT_AUTO_EXPORT_ENABLED` -- gate auto-export (user toggle)
- `AUTOPILOT_NEEDS_REVIEW_QUEUE` -- gate review queue UI
- `AUTOPILOT_VOICE_NOTIFICATION` -- gate voice notes in Autopilot
- `AUTOPILOT_SYNC_TRIGGERS` -- gate sync-triggered runs

## Anti-patterns (forbidden)

```typescript
// BAD: Raw mode string comparison outside context
if (mode === 'pro') {
  showAdvancedFields();
}

// GOOD: Use capability check
const { accessible } = useCapability('advanced_policies');
if (accessible) {
  showAdvancedFields();
}
```

```typescript
// BAD: Skipping audit trail on state changes
await saveModeState(newState);
return NextResponse.json(result);

// GOOD: Always record audit
await saveModeState(newState);
recordAudit({
  workspaceId,
  userId,
  action: 'mode_switch',
  mode: targetMode,
  details: {
    type: 'mode_switch',
    previousMode,
    currentMode: targetMode,
    trigger,
  },
});
return NextResponse.json(result);
```

```typescript
// BAD: Hardcoded entitlements
const entitlements = computeEntitlements(null);

// GOOD: Pass actual billing context
const subscription = await getWorkspaceSubscription(workspaceId);
const entitlements = computeEntitlements(subscription);
```

```typescript
// BAD: API route without capability gating
export async function POST(request: Request) {
  const body = await request.json();
  return doOperation(body);
}

// GOOD: Gate by capability
export async function POST(request: Request) {
  const mode = await getCurrentMode(workspaceId);
  assertCapability('export_work_items', mode);
  const body = await request.json();
  return doOperation(body);
}
```

## Heuristics

- Does every mode-sensitive UI component use `useMode()` or `useCapability()`?
- Does every API route in `OPERATION_CAPABILITY_MAP` call `assertCapability()`?
- Does every state-changing operation call `recordAudit()`?
- Is Autopilot gated behind plan entitlements on both client and server?
- Are Pro features gated behind `MODE_PRO_ENABLED` feature flag?
- Does the Guided mode provide pre-filled defaults for every required field?
- Are all mode transitions logged to PostHog AND the audit trail?
- Is auto-export explicitly OFF by default in Autopilot config?
- Does the Needs Review queue exist and is it mandatory for all Autopilot runs?

## References

- See `contracts-first.md` for spec-first development patterns
- See `ai-agent.md` for traceability and reversibility principles
- See `security.md` for access control and permission checks
- See `observability.md` for logging and audit requirements
- See `ux.md` for ceremonial flow and feedback loops
- See `posthog-integration.md` for feature flag and analytics conventions
- See `specs/cursor_for_pm_modes_guide_pro_autopilot/` for the full mode specification
