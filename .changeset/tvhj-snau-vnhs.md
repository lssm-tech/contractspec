---
'@contractspec/bundle.workspace': minor
'@contractspec/app.cli-contractspec': minor
---

feat: add --baseline option to view command for PR change summaries

- Add `diffFiles()` method to GitAdapter for listing changed files between refs
- Add `generateViews()` service function with baseline filtering and audience validation
- Add `listSpecsForView()` helper for spec file resolution
- Add `--baseline <ref>` option to `contractspec view` command
- Update GitHub Actions workflow to show only changed contracts in PR comments
- Refactor CLI to delegate all business logic to bundle service
