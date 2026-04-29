# Patch Notes



### Add reusable BYOK and environment alias UI helpers for integration setup.
- Slug: byok-env-ui-kit
- Date: 2026-04-29
- Breaking: no
- @contractspec/bundle.library@3.10.0 (minor)
- Maintainer: Integration UI helpers preserve redaction guarantees by displaying secret references and required status without serializing raw secret values.

### Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- Slug: byok-monorepo-env-config
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-integrations@3.9.0 (minor)
- @contractspec/integration.runtime@3.10.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- Maintainer: Integration specs can expose managed/BYOK credential manifests while runtime reports redact secret and sensitive values.

### Teach the Integration Hub example to model managed/BYOK credential setup and monorepo-aware env aliases.
- Slug: integration-hub-byok-env-example
- Date: 2026-04-29
- Breaking: no
- @contractspec/example.integration-hub@3.9.0 (minor)
- Maintainer: Maintainers get regression-covered setup fixtures that exercise public-prefix aliasing without exposing secret fields through client env names.

### Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
- Slug: notion-page-outline
- Date: 2026-04-29
- Breaking: no
- @contractspec/lib.design-system@4.4.2 (patch)
- Maintainer: Design-system maintainers can opt PageOutline into a floating variant while preserving existing rail and compact variants.