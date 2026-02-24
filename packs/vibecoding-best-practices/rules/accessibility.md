---
targets:
  - '*'
root: false
description: 'Accessibility checklist (ARIA, keyboard, contrast, motion)'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'Accessibility checklist (ARIA, keyboard, contrast, motion)'
  globs:
    - '**/*'
---

# Accessibility

Requirements:

- ARIA: set appropriate roles/labels; name/role/value exposed.
- Keyboard: all actions reachable by keyboard; visible focus states; logical tab order.
- Focus: manage focus on dialogs/alerts; return focus after close.
- Confirmation safety: destructive-action confirmations must use accessible dialog patterns (focus trap, keyboard controls, clear title/description).
- Confirmation clarity: dialog copy should identify the target entity and outcome in plain language before confirmation.
- Contrast: meet WCAG 2.1 AA (4.5:1 for text); respect design tokens.
- Motion: honor `prefers-reduced-motion`; avoid auto-playing animations.
- States: implement loading/empty/error/success with accessible messaging.
- Feedback: undo/success/error toasts and status banners must be announced accessibly (`role="status"`/`role="alert"` or equivalent).

Testing:

- Run axe (or equivalent) on affected views; fix blocking issues.
- Verify keyboard-only flows for critical paths.
- Screen reader smoke test for new dialogs/forms.
- Validate destructive-action confirmation and undo flows with keyboard and screen reader.
