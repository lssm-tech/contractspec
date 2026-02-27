---
'@contractspec/lib.contracts-spec': patch
'@contractspec/lib.contracts-integrations': patch
'@contractspec/integration.providers-impls': patch
'@contractspec/integration.runtime': patch
'@contractspec/app.api-library': patch
'@contractspec/app.web-landing': patch
---

Fix lint stability across workspaces by pinning ESLint's AJV resolver compatibility and removing an incompatible minimatch override that caused jsx-a11y runtime failures.

Apply strict-type and lint compliance updates across health contracts and channel runtime code paths, including empty-interface aliases, dynamic env cleanup in integration tests, and normalized array typing with full lint/build/test validation.
