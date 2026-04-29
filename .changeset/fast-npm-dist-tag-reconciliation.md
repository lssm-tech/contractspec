---
"contractspec": patch
---

Make npm release publishing stop waiting on per-package dist-tag read-after-write convergence.

The publish helper now treats a successful `npm dist-tag add` as reconciliation evidence and defers final registry convergence to the release manifest verifier, avoiding the repeated 5s/10s sleep loop seen across large release batches.
