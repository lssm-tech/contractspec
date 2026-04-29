# Customer Upgrade Guide



### Add reusable BYOK and environment alias UI helpers for integration setup.
- @contractspec/bundle.library@3.10.0 (minor)
- Integrator: OSS consumers can render managed/BYOK credential setup blocks and monorepo-aware env alias previews from integration manifests.



### Add reusable BYOK and environment alias UI helpers for integration setup.
- No manual migration steps recorded.

### Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- @contractspec/lib.contracts-spec@6.3.0 (minor)
- @contractspec/lib.contracts-integrations@3.9.0 (minor)
- @contractspec/integration.runtime@3.10.0 (minor)
- @contractspec/bundle.workspace@4.7.0 (minor)
- Integrator: Monorepos can declare logical environment variables once and materialize framework-specific aliases such as NEXT_PUBLIC_* and EXPO_PUBLIC_* per app target.
- Customer: BYOK setup can be validated from shared contracts without placing raw secrets in specs, docs, reports, or generated env examples.



### Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- Customer: BYOK setup can be validated from shared contracts without placing raw secrets in specs, docs, reports, or generated env examples.
- No manual migration steps recorded.

### Teach the Integration Hub example to model managed/BYOK credential setup and monorepo-aware env aliases.
- @contractspec/example.integration-hub@3.9.0 (minor)
- Integrator: The Integration Hub example now exposes credential setup manifests, safe secret references, and app-specific Next/Expo env aliases for managed and BYOK integrations.



### Teach the Integration Hub example to model managed/BYOK credential setup and monorepo-aware env aliases.
- No manual migration steps recorded.

### Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
- @contractspec/lib.design-system@4.4.2 (patch)
- Integrator: AppShell consumers get a floating desktop PageOutline that no longer reserves a right content column, while mobile and native outline behavior remains menu-contained.



### Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
- No manual migration steps recorded.