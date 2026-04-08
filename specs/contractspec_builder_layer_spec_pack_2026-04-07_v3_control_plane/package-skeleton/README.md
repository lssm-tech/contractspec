# Package Skeleton for Builder v3

## Suggested tree

```text
packages/
  libs/
    builder-spec/
    builder-runtime/
    provider-spec/
    provider-runtime/
    mobile-control/
  modules/
    builder-workbench/
    mobile-review/
  integrations/
    channel.telegram/
    channel.whatsapp/
    runtime.managed/
    runtime.local/
    runtime.hybrid/
    provider.codex/
    provider.claude-code/
    provider.gemini/
    provider.copilot/
    provider.stt/
    provider.local-model/
```

## Notes

- `builder-spec` and `provider-spec` should contain contracts only.
- `builder-runtime` owns source fusion, lane orchestration, approval orchestration, preview/export orchestration.
- `provider-runtime` owns adapters, routing, fallback, comparison, and receipt normalization.
- `mobile-review` should be responsive and deep-link friendly from Telegram/WhatsApp.
- `runtime.local` should expose registration, heartbeat, capability handshake, and trust profile APIs.
- `runtime.managed` should expose hosted previews, exports, and operator controls.
