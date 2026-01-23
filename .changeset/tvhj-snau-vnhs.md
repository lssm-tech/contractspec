---
'@contractspec/bundle.workspace': minor
'@contractspec/app.cli-contractspec': minor
---

feat: add --baseline option to view command for PR change summaries

- Add `diffFiles()` method to GitAdapter for listing changed files between refs
- Add `listSpecsForView()` service function with baseline filtering support
- Add `--baseline <ref>` option to `contractspec view` command
- Update GitHub Actions workflow to show only changed contracts in PR comments
