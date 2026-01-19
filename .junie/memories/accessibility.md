# Accessibility

Requirements:

- ARIA: set appropriate roles/labels; name/role/value exposed.
- Keyboard: all actions reachable by keyboard; visible focus states; logical tab order.
- Focus: manage focus on dialogs/alerts; return focus after close.
- Contrast: meet WCAG 2.1 AA (4.5:1 for text); respect design tokens.
- Motion: honor `prefers-reduced-motion`; avoid auto-playing animations.
- States: implement loading/empty/error/success with accessible messaging.

Testing:

- Run axe (or equivalent) on affected views; fix blocking issues.
- Verify keyboard-only flows for critical paths.
- Screen reader smoke test for new dialogs/forms.
