---
targets:
  - '*'
root: false
globs:
  - '**/*'
cursor:
  alwaysApply: true
  globs:
    - '**/*'
---

Intentful Feedback and Ceremonial Flow
"All user interactions must express intent clearly, provide meaningful feedback, and contribute to a coherent experiential flow. Ceremonial moments (onboarding, transitions, thresholds) should encode narrative and social meaning, not ornamental fluff."

Principles:
Intent-first Design: Every action should be discoverable, understandable, and undoable. Design anticipates user intent and reacts accordingly.

Feedback Loops: Immediate and visible feedback for every gesture — tap, swipe, submit, wait. Micro-interactions guide the user through state changes.

Temporal Semantics: Use transition timing, delay, or rhythm to signal the weight of an action (e.g., farewell rituals vs. checkbox taps).

Ceremonial Design: Identify and ritualize transitions (arrival, departure, role shift, goal achieved) using ambient, narrative, or symbolic cues.

Cognitive Friction: Minimize effort required to complete goals, but preserve meaningful pauses where intention matters (e.g., irreversible decisions).

List Interaction Contract:

- Every listing must expose quick actions at list level (at minimum search/filter and refresh; include create/import when the domain supports creation).
- Every listed item must expose explicit actions (at minimum view; include edit/delete/retry/sync as relevant to the entity lifecycle).
- Dangerous actions (delete/remove/disconnect/pause/rebuild/reset) must require explicit confirmation with clear consequence copy.
- Mutations should be user-tolerant: prefer undo for reversible actions; otherwise provide success/error feedback with recovery guidance.
- Confirmation prompts must name the affected entity (e.g., member/team/integration) and the expected impact.
- For reversible mutations, expose undo inline in feedback (toast/banner) with a short recovery window.

Heuristics:
✅ Does every action give visible or ambient feedback?
✅ Is there a clear beginning, middle, and end to flows?
✅ Are important transitions marked with ritual or ceremony?
✅ Can the interface teach itself by showing, not telling?
✅ Accessibility: ARIA roles/labels, keyboard/focus order, prefers-reduced-motion supported, contrast upheld.
✅ Mobile-friendly spacing/tap targets; feedback within 200ms, completion paths as short as possible.
✅ Undo/confirm patterns for destructive or irreversible actions; show progress for long-running tasks.
✅ Do list screens include quick actions (search/filter/refresh/create/import as appropriate)?
✅ Do list items expose explicit actions (view + domain-relevant edit/delete/retry/sync)?
✅ Do destructive confirms explicitly name the entity and consequence before commit?
✅ Key feedback and transitions emit analytics events with success/error/latency metadata.
