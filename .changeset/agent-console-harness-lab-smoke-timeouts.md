---
"@contractspec/example.agent-console": patch
"@contractspec/example.harness-lab": patch
---

Fix the agent console smoke test by awaiting async button handlers, splitting the flow into smaller smoke cases, and wiring dashboard mutation refreshes so the visible agents and runs tabs update after create and execute actions. Also make the harness lab browser smoke tests skip when Chromium cannot launch in this environment and apply explicit timeouts for the browser evaluation paths.
