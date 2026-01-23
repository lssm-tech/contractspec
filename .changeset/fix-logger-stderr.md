---
'@contractspec/app.cli-contractspec': patch
---

Fix impact command to use silent logger for JSON output format to prevent log messages from corrupting machine-readable output in CI pipelines.
