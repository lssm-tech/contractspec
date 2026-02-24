---
name: mode-switch
description: 'Implement mode-aware and preference-aware features across Guided / Pro / Autopilot and PreferenceDimensions'
targets: ['*']
claudecode:
  allowed-tools:
    - 'Bash'
    - 'Read'
    - 'Write'
    - 'Glob'
    - 'Grep'
---

# Mode + Preference-Aware Feature Skill

This skill guides you through implementing features that vary by mode capabilities and/or by `PreferenceDimensions`. It ensures correct capability gating, preference resolution and constraints, audit trail coverage, and feature flag integration.

Treat this as a two-layer model:

- `UiMode` (`guided`, `pro`, `autopilot`) controls access, entitlements, and safety gates.
- `PreferenceDimensions` controls UX adaptation (`guidance`, `density`, `dataDepth`, `control`, `media`, `pace`, `narrative`).

## Usage

Invoke when:

- Adding a new feature that should behave differently per mode
- Adding a new feature that should adapt by one or more preference dimensions
- Adding a new API route that needs capability gating
- Modifying an existing feature to be mode-aware or preference-aware
- Adding a new capability to the capabilities matrix

## Process

### Step 0: Classify the Behavior Layer

Before coding, classify the feature as one of:

1. Capability-gated behavior (mode/entitlement dependent)
2. Preference-adaptive behavior (UX only)
3. Both (most common for advanced surfaces)

Rule of thumb:

- If behavior changes who can do something, it is mode/capability governance.
- If behavior changes how the same capability is presented, it is preference governance.

### Step 1: Identify Capabilities and Preference Dimensions

Determine which capability keys and/or preference dimensions the feature touches.

Capability matrix source:

- `packages/libs/contracts-contractspec-studio/src/mode/capabilities-matrix.ts`

Existing capability keys:

| Key                           | Description                       |
| ----------------------------- | --------------------------------- |
| `connect_sources`             | Connect feedback sources          |
| `manual_sync`                 | Trigger manual sync               |
| `scheduled_sync`              | Configure scheduled syncs         |
| `patterns_compute`            | Run pattern correlation           |
| `pattern_editing`             | Edit/merge patterns               |
| `focus_creation`              | Create Focus items                |
| `brief_generation`            | Generate Brief                    |
| `patch_intent_generation`     | Generate Action Item Intent       |
| `impact_report`               | Run deterministic impact report   |
| `export_work_items`           | Export Work Items                 |
| `auto_export`                 | Automatic export (Autopilot only) |
| `checks_scheduling`           | Schedule Checks                   |
| `checks_outcome_verification` | Verify Check outcomes             |
| `stakeholder_brief_text`      | Send text stakeholder brief       |
| `stakeholder_voice_note`      | Generate/send voice note          |
| `vision_pack`                 | Generate vision pack              |
| `advanced_policies`           | Configure advanced rules/policies |
| `audit_trail`                 | View audit trail                  |

If the feature requires a NEW capability, add it to:

1. `CapabilityKey` type in `packages/libs/contracts-contractspec-studio/src/mode/types.ts`
2. `CAPABILITIES_MATRIX` in `packages/libs/contracts-contractspec-studio/src/mode/capabilities-matrix.ts`
3. `OPERATION_CAPABILITY_MAP` in `packages/bundles/example-product/src/modules/mode/capability-gate.ts`

Preference contract sources:

- `packages/libs/contracts-contractspec-studio/src/preferences/types.ts`
- `packages/libs/contracts-contractspec-studio/src/preferences/presets.ts`
- `packages/libs/contracts-contractspec-studio/src/preferences/constraints.ts`
- `packs/vibecoding-tooling/skills/mode-switch/PREFERENCE_DIMENSIONS.md`

If you add or change a preference dimension/value, update all relevant contracts (types, schema, presets, numeric maps if ordinal, resolver tests, and UI labels).

### Step 2: Check Mode Availability, Preset Baselines, and Constraints

For each capability the feature uses, verify the availability:

| Availability  | Meaning                 | UI Behavior                        | API Behavior          |
| ------------- | ----------------------- | ---------------------------------- | --------------------- |
| `available`   | Full access             | Show normally                      | Allow request         |
| `gated`       | Access with constraints | Show with constraint badge/tooltip | Allow with validation |
| `unavailable` | Blocked                 | Hide or show disabled state        | Return 403            |

Then verify the preference baseline and constraints:

- Mode selects baseline preset through `MODE_PRESET_MAP` (`guided`, `pro`, `autopilot`)
- Resolution order is `mode -> preset -> global overrides -> area overrides -> constraints`
- Mode constraints are enforced through `MODE_CONSTRAINTS` and surfaced in `constraintsApplied`

Current constrained values (Guided):

- `media: voice` -> fallback `hybrid`
- `control: full` -> fallback `advanced`

### Step 3: Implement Client-Side Capability Gating and Preference Adaptation

Use the mode context hooks. Never check mode strings directly.

```tsx
// In a React component
import {
  useCapability,
  useMode,
} from '@contractspec/bundle.example-product/presentation/components/mode';

export function MyFeature() {
  const { accessible, constraint } = useCapability('export_work_items');
  const { config } = useMode();

  if (!accessible) {
    return null; // or <UpgradePrompt />
  }

  return (
    <div>
      {constraint && <ConstraintBadge text={constraint} />}
      {/* Feature content */}
      {config.ceremonyStepped ? <SteppedWizard /> : <DirectAction />}
    </div>
  );
}
```

Use preference hooks for UX adaptation (layout, pacing, narrative, guidance depth, media rendering):

```tsx
import { usePreference } from '@contractspec/bundle.example-product/presentation/components/preferences';

const {
  guidance,
  density,
  pace,
  narrative,
  constraintsApplied,
  setPreference,
} = usePreference();

// Example: UX adaptation is preference-driven, not raw-mode-driven.
const showSteppedFlow = guidance === 'wizard' || guidance === 'walkthrough';
const useCompactLayout = density === 'detailed' || density === 'dense';
const fastTransitions = pace === 'rapid';

// If user requested a constrained value, show reason from constraintsApplied.
```

Do not use raw mode checks for behavior that should follow preferences.

- Bad: `if (mode === 'guided') { showTooltips = true; }`
- Good: derive from `guidance`, `density`, `pace`, `narrative`, or the bridge config

### Step 4: Implement Server-Side Gating

Every API route that maps to a capability MUST call `assertCapability()`:

```typescript
import {
  assertCapability,
  CapabilityGatedError,
} from '@contractspec/bundle.example-product/modules/mode';
import { getModeState } from '@/app/api/mode/store';

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  // Get current mode
  const modeState = await getModeState(auth.organizationId);
  const mode = modeState?.currentMode ?? 'guided';

  // Gate by capability
  try {
    assertCapability('export_work_items', mode);
  } catch (err) {
    if (err instanceof CapabilityGatedError) {
      return NextResponse.json(
        { error: err.message, capability: err.capability, mode: err.mode },
        { status: 403 }
      );
    }
    throw err;
  }

  // Proceed with operation
  const body = await request.json();
  // ...
}
```

For preference routes/services:

- Validate payloads using preference schemas (`PreferenceDimensionsSchema`, `PartialPreferenceDimensionsSchema`)
- Resolve and constrain values server-side (`resolvePreferences` or `applyConstraints`) before persistence or response composition
- Never trust client values for constrained dimensions

### Step 5: Add Audit Trail Entry

For any state-changing operation, record an audit entry.

Mode/capability operations:

```typescript
import { recordAudit } from '@contractspec/bundle.example-product/modules/mode';

// After successful operation:
recordAudit({
  workspaceId,
  userId,
  action: 'capability_gate', // or 'mode_switch', 'autopilot_run', etc.
  mode: currentMode,
  details: {
    type: 'capability_gate',
    capability: 'export_work_items',
    result: 'allowed',
    constraint: null,
  },
});
```

Preference operations:

```typescript
import { recordPreferenceAudit } from '@contractspec/bundle.example-product/modules/preferences';

recordPreferenceAudit({
  workspaceId,
  userId,
  action: 'preference_set',
  details: {
    type: 'preference_set',
    dimension: 'density',
    previousValue: 'standard',
    newValue: 'detailed',
  },
});
```

If constraints are applied, also emit analytics/audit detail so users and operators can understand why values were clamped.

### Step 6: Add Feature Flag Check (if applicable)

If the feature is behind a feature flag:

```typescript
// Server-side
import { isFeatureEnabled } from '@/lib/posthog/server';
import { FeatureFlag } from '@contractspec/lib.contracts-contractspec-studio';

const enabled = await isFeatureEnabled(FeatureFlag.MODE_PRO_ENABLED);

// Client-side
import { useFeatureFlag } from '@/lib/posthog/client';
import { FeatureFlag } from '@contractspec/lib.contracts-contractspec-studio';

const proEnabled = useFeatureFlag(FeatureFlag.MODE_PRO_ENABLED);
```

Preference-adaptive features may also use preference flags (for example `PREFERENCE_SYSTEM_ENABLED`, `PREFERENCE_UI_VISIBLE`, `PREFERENCE_AREA_OVERRIDES`) when present in contracts.

### Step 7: Write Tests

Write tests for both governance layers:

1. Mode x capability matrix tests (`assertCapability` behavior)
2. Mode x preference constraint tests (for constrained values)
3. Resolution order tests (`preset + global overrides + area overrides + constraints`)
4. Bridge tests (`deriveModeConfig` stays consistent with preference values)

Example mode/capability test:

```typescript
import { describe, it, expect } from 'bun:test';
import { assertCapability, CapabilityGatedError } from './capability-gate';

describe('MyFeature capability gating', () => {
  describe.each(['guided', 'pro', 'autopilot'] as const)('%s mode', (mode) => {
    it('should respect capability matrix for export_work_items', () => {
      // For guided: gated (manual only)
      // For pro: gated (manual only)
      // For autopilot: gated (auto-export risk-gated)
      expect(() => assertCapability('export_work_items', mode)).not.toThrow();
    });

    it('should block unavailable capabilities', () => {
      if (mode === 'guided') {
        expect(() => assertCapability('auto_export', mode)).toThrow(
          CapabilityGatedError
        );
      }
    });
  });
});
```

Example constraint test:

```typescript
import { resolvePreferences } from '@contractspec/lib.contracts-contractspec-studio/preferences';

it('clamps guided voice media to hybrid', () => {
  const resolved = resolvePreferences('guided', { media: 'voice' });
  expect(resolved.global.media).toBe('hybrid');
  expect(resolved.constraintsApplied.some((c) => c.dimension === 'media')).toBe(
    true
  );
});
```

### Step 8: Verify Autopilot Safety (if applicable)

If the feature interacts with Autopilot:

1. Check that `validateWorkspaceAdmin()` gates config changes
2. Check that `validateFeedbackThreshold()` gates runs
3. Check that `validateAutoExport()` gates auto-exports with confidence check
4. Check that `validateUsageCaps()` enforces hard limits
5. Verify the "Needs Review" queue receives items when risk threshold is exceeded
6. Verify preference changes (such as `pace: rapid`) do not bypass Autopilot safety gates

## Verification Checklist

- [ ] Capability key identified and exists in `CAPABILITIES_MATRIX`
- [ ] Preference dimensions touched are identified (and documented if behavior changed)
- [ ] Client uses `useCapability()` for access and preference hooks for UX behavior
- [ ] Server calls `assertCapability()` before executing gated operations
- [ ] `OPERATION_CAPABILITY_MAP` includes the API operation name
- [ ] Preference payloads validated with preference schemas and constrained server-side
- [ ] `recordAudit()` / `recordPreferenceAudit()` called for state-changing operations
- [ ] Feature flag checked where applicable
- [ ] Tests cover mode x capability and mode x constrained-dimension scenarios
- [ ] Guided / Pro / Autopilot presets resolve as expected for touched dimensions
- [ ] Constrained values surface clear user-facing reasons
- [ ] Autopilot behavior remains gated behind risk thresholds and review queue
- [ ] No raw HTML -- uses design system components
- [ ] TypeScript types are strict (no `any`)

## Output

After completion, report:

- Capability keys used
- Preference dimensions used
- Constraint behavior (if any) and fallback rationale
- Files created or modified
- Test coverage per mode and per constrained dimension case
- Any new feature flags or capabilities added
- Audit trail actions recorded
