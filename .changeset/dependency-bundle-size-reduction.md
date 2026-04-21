---
"@contractspec/lib.ui-kit": major
"@contractspec/integration.providers-impls": major
"@contractspec/lib.runtime-sandbox": major
"@contractspec/lib.example-shared-ui": major
"@contractspec/lib.video-gen": major
"@contractspec/lib.ui-kit-web": minor
"@contractspec/app.cli-contractspec": minor
"@contractspec/app.api-library": patch
"@contractspec/app.registry-packs": patch
"vscode-contractspec": patch
"@contractspec/example.project-management-sync": patch
"@contractspec/example.voice-providers": patch
"@contractspec/example.meeting-recorder-providers": patch
"@contractspec/example.integration-posthog": patch
"contractspec": patch
---

Reduce published install and bundle size by moving heavy optional runtime stacks to optional peers, narrowing provider implementation barrels, adding a dependency audit script, and tightening app bundle externals for optional SDK families.
