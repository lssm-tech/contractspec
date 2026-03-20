---
"@contractspec/app.api-library": minor
"@contractspec/app.cli-contractspec": minor
"@contractspec/app.web-landing": minor
"@contractspec/bundle.library": minor
"@contractspec/bundle.marketing": minor
"@contractspec/example.agent-console": minor
"@contractspec/example.ai-chat-assistant": minor
"@contractspec/example.data-grid-showcase": minor
"@contractspec/example.integration-hub": minor
"@contractspec/example.marketplace": minor
"@contractspec/example.messaging-agent-actions": minor
"@contractspec/example.minimal": minor
"@contractspec/example.opencode-cli": minor
"@contractspec/example.saas-boilerplate": minor
"@contractspec/example.visualization-showcase": minor
"@contractspec/integration.providers-impls": minor
"@contractspec/integration.runtime": minor
"@contractspec/lib.contracts-integrations": minor
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.ui-kit-web": minor
"@contractspec/module.examples": minor
---

Harden the meetup-ready examples lane around `agent-console`, `ai-chat-assistant`, `minimal`, `opencode-cli`, and the new `messaging-agent-actions` example.

Add maturity-aware example validation, Telegram provider support across the messaging runtime and API library, curated docs/showcase pages, deterministic proof artifacts, and a real curated preflight runner that executes the underlying checks directly instead of masking shell-spawn failures.
