---
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.contracts-runtime-server-rest": minor
"@contractspec/lib.contracts-runtime-client-react": minor
---

Add PWA update management contracts and runtime helpers.

The new PWA contract surface declares app manifests, release update policy, a `pwa.update.check` query, and update prompt telemetry events. REST server helpers evaluate app defaults plus per-release overrides, while React client helpers expose required/blocking and optional update state with host-owned service worker activation.
