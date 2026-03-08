---
'@contractspec/lib.surface-runtime': minor
---

feat(surface-runtime): UI adapters and React renderer (Phase 2)

- Add adapter interfaces for BlockNote, dnd-kit, Floating UI, Motion, resizable-panels, AI SDK
- Implement adapter stubs (no direct third-party imports)
- Add layoutRoot to ResolvedSurfacePlan for renderer
- Implement BundleProvider with plan and preferences context
- Implement BundleRenderer with RegionRenderer, SlotRenderer, panel groups
- Map pace preference to motion tokens (deliberate/balanced/rapid)
- Panel layout persistence via localStorage (restoreLayout/saveLayout)
