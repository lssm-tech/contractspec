# Preference Dimensions

The preference system exposes 7 orthogonal dimensions that control how the UI adapts to the user. Each dimension is independent -- changing one does not force changes in others.

## 1. Guidance

Controls how much help, explanation, and hand-holding the UI provides.

| Value         | Label        | Behavior                                                                                                     |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------ |
| `none`        | No guidance  | Zero help text, no ceremonies, no step indicators. For users who know exactly what they're doing.            |
| `hints`       | Subtle hints | Contextual hints appear on hover or focus. No persistent help UI. Keyboard shortcut badges visible.          |
| `tooltips`    | Tooltips     | Always-visible help icons (?) with tooltips. Section-level "What is this?" links.                            |
| `walkthrough` | Walkthrough  | Step indicators, inline explanations, progress bars. Collapsible "Why this matters" sections.                |
| `wizard`      | Full wizard  | Ceremony dialogs, forced step-by-step flow, pre-filled defaults, "Next" buttons. Celebrations on completion. |

**Constraints**: No mode-level constraint. Any user in any mode can adjust guidance freely. However, Guided mode preset defaults to `wizard` because that's the expected onboarding experience.

**Numeric mapping**: `none=0, hints=1, tooltips=2, walkthrough=3, wizard=4` -- allows `>=` comparisons in code.

## 2. Density

Controls visual spacing, panel expansion, and how much content is visible at once.

| Value      | Label    | Behavior                                                                                                          |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `minimal`  | Minimal  | Card-based layout, key metrics only, no tables. Large whitespace. One primary action per view. Marketing default. |
| `compact`  | Compact  | Condensed tables, collapsed panels by default. Moderate whitespace. Summary cards with expandable detail.         |
| `standard` | Standard | Balanced layout. Tables and cards mixed. Default panel expansion. Current "normal" experience.                    |
| `detailed` | Detailed | Expanded panels by default. All table columns visible. Side panels open. More inline detail.                      |
| `dense`    | Dense    | Maximum content density. No collapse. Split views. Multiple data tables visible. Power-user layout.               |

**Constraints**: None. Density is purely visual.

**Relationship to Safe Place Config**: The existing `Compact/Detailed` toggle in Safe Place maps to `compact` and `detailed` in this system. Migration preserves user choice.

**Numeric mapping**: `minimal=0, compact=1, standard=2, detailed=3, dense=4`

## 3. Data Depth

Controls how much data is loaded, displayed, and accessible per content surface.

| Value        | Label      | Behavior                                                                                                   |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `summary`    | Summary    | Top 3-5 items. Key metrics only. One-line descriptions. No nested data. Quick to scan.                     |
| `standard`   | Standard   | Default pagination (10-20 items). Standard detail level. Related items linked but not inlined.             |
| `detailed`   | Detailed   | Larger result sets (50+). Sub-details expanded. Related data inlined. Source references visible.           |
| `exhaustive` | Exhaustive | All available data loaded. Nested structures expanded. Raw data accessible. API response viewer available. |

**Constraints**: `exhaustive` may be gated by performance considerations. The resolver may downgrade to `detailed` if the data set exceeds a threshold.

**Numeric mapping**: `summary=0, standard=1, detailed=2, exhaustive=3`

## 4. Control

Controls how many options, toggles, and configuration surfaces are visible.

| Value        | Label      | Behavior                                                                                               |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------ |
| `restricted` | Restricted | Minimal options. Strong defaults. No overrides. "Just do it for me."                                   |
| `standard`   | Standard   | Common options visible. Advanced behind "Show more" toggles. Sensible defaults with ability to change. |
| `advanced`   | Advanced   | All options visible. Power toggles accessible. Keyboard shortcuts active. Batch operations available.  |
| `full`       | Full       | Raw configuration. API access. Developer tools. Custom policy editing. Override everything.            |

**Constraints**: `full` control requires Pro or Autopilot mode (maps to `advanced_policies` capability). Guided mode users can set control to `standard` but not `full`.

**Numeric mapping**: `restricted=0, standard=1, advanced=2, full=3`

## 5. Media Channel

Controls the preferred content representation format.

| Value    | Label          | Behavior                                                                                                           |
| -------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `text`   | Text-focused   | Text-heavy rendering. Lists, descriptions, prose summaries. Minimal charts. Accessible and screen-reader friendly. |
| `visual` | Visual-focused | Charts, diagrams, images, visual summaries. Data as graphs. Pattern clusters as visual maps.                       |
| `voice`  | Voice-enabled  | Voice notes, audio summaries, TTS for briefs. Voice input for feedback. Audio-first interaction where available.   |
| `hybrid` | Hybrid         | Adaptive mix. Text + visuals + optional voice. System picks best format per content type.                          |

**Constraints**: `voice` requires Pro or Autopilot mode (maps to `stakeholder_voice_note` capability). Guided mode users can use `text`, `visual`, or `hybrid` but `voice` is gated.

## 6. Pace

Controls interaction speed, confirmation requirements, animation timing, and transition behavior.

| Value        | Label      | Behavior                                                                                                                                                  |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deliberate` | Deliberate | Confirmation dialogs on all destructive actions. Slower animations (300ms+). Step-by-step transitions. Undo always prominent.                             |
| `balanced`   | Balanced   | Confirmation on risky actions only. Standard animations (150-200ms). Smooth transitions. Undo available in toast.                                         |
| `rapid`      | Rapid      | Minimal confirmations (destructive only). Fast/no animations (0-100ms). Instant transitions. Batch operations default. Respects `prefers-reduced-motion`. |

**Constraints**: None, but `rapid` pace combined with Autopilot mode will still enforce safety gates on auto-export and auto-certify actions regardless of pace preference.

**Numeric mapping**: `deliberate=0, balanced=1, rapid=2`

**Animation mapping**:

- `deliberate`: `transition-duration: 300ms`, entrance animations enabled, loading skeletons shown for 500ms minimum
- `balanced`: `transition-duration: 150ms`, entrance animations enabled, loading skeletons shown for 200ms minimum
- `rapid`: `transition-duration: 50ms`, entrance animations disabled (or instant), no artificial loading delays. Always respects `prefers-reduced-motion: reduce`.

## 7. Narrative

Controls the order in which information is presented -- conclusion-first vs evidence-first.

| Value       | Label            | Behavior                                                                                                                                                |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `top-down`  | Conclusion first | Show the result/verdict/summary first, then supporting evidence, then raw data. "Here's what matters, here's why." Executive/deductive thinking style.  |
| `bottom-up` | Evidence first   | Show raw data/evidence first, then derived patterns, then conclusions. "Here's what we see, here's what it means." Analytical/inductive thinking style. |
| `adaptive`  | Context-adaptive | System chooses based on content type. Dashboards default top-down. Detail views default bottom-up. User can flip per-view.                              |

**Constraints**: None.

**See also**: `04_narrative_flow.md` for detailed breakdown per content type.

---

## Dimension Independence

These dimensions are intentionally orthogonal. Valid combinations include:

- `guidance=wizard` + `density=dense` -- Lots of help text AND lots of content (training mode for a power tool)
- `guidance=none` + `density=minimal` -- Zero help, minimal content (expert who wants a clean dashboard)
- `narrative=bottom-up` + `dataDepth=summary` -- Evidence-first BUT only show top items (quick scan of raw signals)
- `pace=rapid` + `guidance=walkthrough` -- Fast transitions but with step indicators (knows the flow, moves quickly through it)

Not all combinations make equal sense, but the system allows them. Presets provide sensible starting points.

## TypeScript Representation

```typescript
type GuidanceLevel = 'none' | 'hints' | 'tooltips' | 'walkthrough' | 'wizard';
type DensityLevel = 'minimal' | 'compact' | 'standard' | 'detailed' | 'dense';
type DataDepthLevel = 'summary' | 'standard' | 'detailed' | 'exhaustive';
type ControlLevel = 'restricted' | 'standard' | 'advanced' | 'full';
type MediaChannel = 'text' | 'visual' | 'voice' | 'hybrid';
type PaceLevel = 'deliberate' | 'balanced' | 'rapid';
type NarrativeFlow = 'top-down' | 'bottom-up' | 'adaptive';

interface PreferenceDimensions {
  guidance: GuidanceLevel;
  density: DensityLevel;
  dataDepth: DataDepthLevel;
  control: ControlLevel;
  media: MediaChannel;
  pace: PaceLevel;
  narrative: NarrativeFlow;
}
```

## Numeric Comparison Helpers

Dimensions with ordinal values expose numeric mappings for `>=` comparisons:

```typescript
// Instead of: if (guidance === "walkthrough" || guidance === "wizard")
// Use:        if (guidanceLevel >= GuidanceLevel.Walkthrough)

const GUIDANCE_LEVELS = {
  none: 0,
  hints: 1,
  tooltips: 2,
  walkthrough: 3,
  wizard: 4,
} as const;
const DENSITY_LEVELS = {
  minimal: 0,
  compact: 1,
  standard: 2,
  detailed: 3,
  dense: 4,
} as const;
const DATA_DEPTH_LEVELS = {
  summary: 0,
  standard: 1,
  detailed: 2,
  exhaustive: 3,
} as const;
const CONTROL_LEVELS = {
  restricted: 0,
  standard: 1,
  advanced: 2,
  full: 3,
} as const;
const PACE_LEVELS = { deliberate: 0, balanced: 1, rapid: 2 } as const;
```

`MediaChannel` and `NarrativeFlow` are categorical (not ordinal) and should use direct equality checks.

## 2026-02-21 Voice Conversational Note

- Conversational voice workflows require `media` to be `voice` or `hybrid`.
- `pace` is mapped to narration `PacingConfig` when generating TTS output.
- Capability and feature-flag checks still take precedence over user preference intent.

## 2026-02-24 Competition-Killer Surface Note

The same 7 dimensions are required for new operate routes introduced by the competition-killer pack (`/operate/pm`, `/operate/schedule`, `/operate/booking`, `/operate/meetings`, `/operate/agent-swarm`).

No surface may bypass this model by using fixed mode-only UI behavior.

## 2026-03-04 Full-Surface Verification Note

The same 7 dimensions are required for:

- canonical operations-family overview routes (`/operate/operations`, `/operate/operations/runs`, `/operate/operations/queue`, `/operate/operations/audit`), and
- all preference-enabled non-operate surfaces (web app shell pages, marketing pages, desktop routes).

Every in-scope page must be represented in a verification matrix with explicit accountability for all dimensions.
