---
"@contractspec/lib.contracts-runtime-client-react": minor
"@contractspec/lib.design-system": minor
"@contractspec/tool.bun": patch
---

Keep FormRender mobile-safe through the shared design-system renderer.

The React form renderer now supports host-provided layout slots and button-driven submission while preserving native web form behavior by default. The design-system renderer uses the shared `@contractspec/lib.design-system/renderers` path, preserves UI package imports for Metro alias remapping, and adds generated artifact checks so invalid root exports cannot ship again.

The shared Bun build tool now lets packages opt out of generated export-map rewrites, which keeps design-system's manually maintained root and focused renderer exports stable during no-bundle builds.
