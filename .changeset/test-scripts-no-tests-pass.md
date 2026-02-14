---
'@contractspec/bundle.alpic': patch
'@contractspec/example.agent-console': patch
'@contractspec/example.ai-support-bot': patch
'@contractspec/example.calendar-google': patch
'@contractspec/example.content-generation': patch
'@contractspec/example.crm-pipeline': patch
'@contractspec/example.email-gmail': patch
'@contractspec/example.in-app-docs': patch
'@contractspec/example.integration-posthog': patch
'@contractspec/example.integration-stripe': patch
'@contractspec/example.integration-supabase': patch
'@contractspec/example.knowledge-canon': patch
'@contractspec/example.learning-journey-ui-coaching': patch
'@contractspec/example.learning-journey-ui-gamified': patch
'@contractspec/example.learning-journey-ui-onboarding': patch
'@contractspec/example.learning-journey-ui-shared': patch
'@contractspec/example.lifecycle-cli': patch
'@contractspec/example.lifecycle-dashboard': patch
'@contractspec/example.meeting-recorder-providers': patch
'@contractspec/example.openbanking-powens': patch
'@contractspec/example.personalization': patch
'@contractspec/example.project-management-sync': patch
'@contractspec/example.saas-boilerplate': patch
'@contractspec/example.voice-providers': patch
'@contractspec/integration.example-generator': patch
'@contractspec/integration.runtime': patch
'@contractspec/lib.ai-providers': patch
'@contractspec/lib.analytics': patch
'@contractspec/lib.content-gen': patch
'@contractspec/lib.cost-tracking': patch
'@contractspec/lib.design-system': patch
'@contractspec/lib.evolution': patch
'@contractspec/lib.example-shared-ui': patch
'@contractspec/lib.knowledge': patch
'@contractspec/lib.lifecycle': patch
'@contractspec/lib.observability': patch
'@contractspec/lib.overlay-engine': patch
'@contractspec/lib.personalization': patch
'@contractspec/lib.plugins': patch
'@contractspec/lib.support-bot': patch
'@contractspec/lib.ui-kit-web': patch
'@contractspec/lib.workflow-composer': patch
'@contractspec/tool.create-contractspec-plugin': patch
'vscode-contractspec': patch
---

fix: make workspace test runs resilient when packages have no tests

Updates package test scripts to pass cleanly when no matching test files exist:

- Uses `bun test --pass-with-no-tests` in Bun-based packages that currently ship without test files.
- Uses `jest --passWithNoTests` for the UI kit web package.
- Adds `.vscode-test.mjs` for `vscode-contractspec` so VS Code extension test runs have an explicit config and stop failing on missing default configuration.

This keeps `turbo run test` deterministic across the monorepo while preserving existing test execution behavior where tests are present.
