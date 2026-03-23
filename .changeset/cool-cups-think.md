---
"@contractspec/app.api-library": patch
"vscode-contractspec": patch
---

Stabilize release validation and package-scoped test fixtures so workspace checks fail only on real regressions.

- Make the release manifest verifier treat npm 404 responses as non-retryable errors.
- Resolve the VS Code snippet fixture relative to the test file so it works from repo-wide test runs.
- Seed channel runtime capability grants in the API library integration tests to match production host configuration.
