# AI Agent Guide -- `@contractspec/eslint-plugin-design-system`

Scope: `packages/tools/eslint-plugin-design-system/*`

ESLint plugin that enforces design-system usage (e.g., `prefer-design-system` rule) so apps and bundles never use raw HTML elements when a design-system component exists.

## Quick Context

- **Layer**: tool
- **Consumers**: all frontend packages via shared ESLint config

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | ESLint plugin object with rules |

Source is shipped directly (`src/index.js`) -- no build step.

## Guardrails

- Rule implementations live in `src/` -- keep each rule in its own file
- Tests use plain Node.js (`node ./tests/<rule>.test.js`), not a test runner
- Peer-depends on `eslint ^9` -- do not add runtime dependencies
- Adding or renaming a rule requires updating the shared ESLint config that consumes this plugin

## Local Commands

- Test: `node ./tests/prefer-design-system.test.js`
