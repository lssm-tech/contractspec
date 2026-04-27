---
"@contractspec/lib.contracts-spec": major
---

Remove static Node crypto imports from browser-safe workflow, telemetry, and experiment runtime subpaths while keeping signing helpers isolated behind direct `control-plane/skills/*` subpaths.

Sticky experiment bucket assignments may shift because the evaluator now uses a browser-safe deterministic hash instead of Node SHA-256.
