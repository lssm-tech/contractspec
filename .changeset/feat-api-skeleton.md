---
'@contractspec/lib.surface-runtime': patch
---

feat(surface-runtime): API skeleton Phase 0 — validators, example bundle, adapter lint

- Add validateLayoutSlots: throws when layout references undeclared slot
- Add validateBundleNodeKinds: returns warnings for node kinds without dedicated renderers
- Integrate validateLayoutSlots into defineModuleBundle
- Add example pm-workbench.bundle.ts in src/examples/
- Add lint:adapters script to enforce no third-party UI imports outside src/adapters/
- Document adapter rule in README
