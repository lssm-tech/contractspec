Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/lib.design-system: unknown -> 4.4.3

Required steps:
- [auto] Use the floating PageOutline variant for wide desktop shells: AppShell now uses the floating outline automatically on wide desktop and hides it on smaller web layouts; direct PageOutline consumers can still opt in with `variant="floating"` or `variant="compact"`.
  - Use `variant="floating"` for direct web PageOutline usage that should reduce when inactive.
  - Keep `variant="rail"` or `variant="compact"` where a static inline outline is still preferred.
  - Place any custom small-screen outline UI outside AppShell if a product needs one.