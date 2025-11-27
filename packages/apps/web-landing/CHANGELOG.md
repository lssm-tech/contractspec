# @lssm/apps.web-contractspec-landing

## 0.2.3

### Patch Changes

- Updated dependencies
  - @lssm/bundle.contractspec-studio@0.3.1
  - @lssm/lib.database-contractspec-studio@0.3.1
  - @lssm/lib.design-system@1.11.1
  - @lssm/lib.progressive-delivery@3.0.1
  - @lssm/lib.ui-kit-web@1.11.1

## 0.2.2

### Patch Changes

- Updated dependencies [b1d0876]
  - @lssm/bundle.contractspec-studio@0.1.0
  - @lssm/lib.progressive-delivery@1.0.0
  - @lssm/lib.ui-kit-web@1.9.0

## 1.4.0

### Zero-Touch Operations

Added deployment automation, SLO monitoring, cost tracking, and anomaly detection capabilities.

### New Features

- Progressive delivery with canary and blue-green strategies
- Real-time SLO monitoring with burn-rate alerts
- Per-operation cost tracking and budget management
- Automated anomaly detection with root-cause analysis
- Operational runbooks for deployment safety

### New Libraries

- `@lssm/lib.progressive-delivery` – strategies, controllers, traffic shifting, rollback manager
- `@lssm/lib.slo` – definitions, tracker, burn-rate monitor, incident integration
- `@lssm/lib.cost-tracking` – sample attribution, budgets, optimization recommender
- `@lssm/lib.observability` – anomaly toolkit (baseline calculator, detector, root-cause analyzer, alert manager)

## 1.3.0

### Personalization & Customization

Added tools for tenant-specific customization without code forks.

### New Features

- Signed overlay system for safe tenant customization
- Behavior tracking for usage analytics
- Dynamic workflow composition per tenant
- Visual overlay editor for non-technical users

### New Libraries

- `@lssm/lib.overlay-engine` – spec runtime, signing, validator, React hooks
- `@lssm/lib.personalization` – behavior tracker, analyzer, adapter
- `@lssm/lib.workflow-composer` – tenant workflow extensions
- `@lssm/app.overlay-editor` – drag-and-drop overlay builder with signing

## 1.2.0

### Self-Learning & Evolution

Added automated spec evolution and testing from production traffic.

### New Features

- Telemetry-driven intent detection
- AI-powered spec suggestions with approval workflow
- Spec experimentation framework with guardrails
- Golden test generation from production traffic

### New Libraries

- `@lssm/lib.evolution` – spec analyzer, generator, approval integration
- `@lssm/lib.observability` – intent detector + evolution pipeline hooks
- `@lssm/lib.growth/spec-experiments` – staged rollouts, guardrails, auto-rollback
- `@lssm/lib.testing` – traffic recorder + golden test generator/adapters

## 1.1.0

### AI-Native Operations

Added AI automation for support, analytics, and growth operations.

### New Features

- AI support bot with ticket classification and auto-resolution
- Human-in-the-loop approval workflows
- Growth experiment framework
- Advanced analytics (funnels, cohorts, churn prediction)

### New Libraries

- `@lssm/lib.ai-agent` – agent runtime, memory, and approval workflow
- `@lssm/lib.support-bot` – classifier, RAG resolver, auto-responder, tool wiring
- `@lssm/lib.content-gen` – blog/landing/email/social generators plus SEO tooling
- `@lssm/lib.analytics` – funnels, cohorts, churn, and hypotheses
- `@lssm/lib.growth` – experiments, stats engine, tracker
- `@lssm/lib.design-system` – ApprovalQueue + AgentMonitor UI for human-in-the-loop reviews

## 1.0.0

### Foundation Release

Complete platform foundation with core capabilities.

### Major Features

- **DataViews**: Query generator, enhanced renderer components, runtime engine
- **Workflows**: Retry logic, compensation strategy, SLA monitoring, persistence
- **Multi-Tenancy**: Row-Level Security (RLS), tenant provisioning, isolation validation
- **Observability**: OpenTelemetry integration with tracing, metrics, structured logging
- **Resilience**: Circuit breakers, retry utilities, timeout wrappers, fallback strategies

### Documentation

- Comprehensive documentation for all core features
- Migration guides and tutorials
- Library reference pages

### New Libraries

- `@lssm/lib.multi-tenancy` - Tenant isolation and provisioning
- `@lssm/lib.observability` - OpenTelemetry integration
- `@lssm/lib.resilience` - Circuit breakers and resilience patterns

## 0.2.1

### Patch Changes

- add right-sidebar

## 0.2.0

### Minor Changes

- fix
