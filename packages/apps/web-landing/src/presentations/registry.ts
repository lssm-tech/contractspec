import type {
  PresentationDescriptorV2,
  PresentationSourceComponentReact,
} from '@lssm/lib.contracts/presentations.v2';
import type { ComponentMap } from './types';

// Import page components - Root/Marketing pages (from web-landing app, not bundle)
import ClientPage from '@/app/client-page';
import ProductClientPage from '@/app/product/product-client';
import PricingClient from '@/app/pricing/pricing-client';
import ContactClient from '@/app/contact/contactClient';
import ChangelogPage from '@/app/changelog/page';

import {
  DocsIndexPage,
  // Getting Started
  InstallationPage,
  HelloWorldPage,
  CLIPage,
  DataViewTutorialPage,
  // Specs
  SpecsOverviewPage,
  SpecsCapabilitiesPage,
  SpecsDataViewsPage,
  SpecsWorkflowsPage,
  SpecsPolicyPage,
  SpecsOverlaysPage,
  // Libraries
  LibrariesOverviewPage,
  LibrariesContractsPage,
  LibrariesAiAgentPage,
  LibrariesAnalyticsPage,
  LibrariesAccessibilityPage,
  LibrariesContentGenPage,
  LibrariesCostTrackingPage,
  LibrariesDataBackendPage,
  LibrariesDataViewsPage,
  LibrariesDesignSystemPage,
  LibrariesEvolutionPage,
  LibrariesGraphQLPage,
  LibrariesGrowthPage,
  LibrariesMultiTenancyPage,
  LibrariesObservabilityPage,
  LibrariesOverlayEnginePage,
  LibrariesPersonalizationPage,
  LibrariesProgressiveDeliveryPage,
  LibrariesResiliencePage,
  LibrariesRuntimePage,
  LibrariesSchemaPage,
  LibrariesSLOPage,
  LibrariesSupportBotPage,
  LibrariesTestingPage,
  LibrariesUIKitPage,
  LibrariesWorkflowsPage,
  LibrariesWorkflowComposerPage,
  // Architecture
  ArchitectureOverviewPage,
  ArchitectureAppConfigPage,
  ArchitectureMultiTenancyPage,
  ArchitectureIntegrationBindingPage,
  ArchitectureKnowledgeBindingPage,
  // Advanced
  AdvancedRenderersPage,
  AdvancedMCPPage,
  AdvancedTelemetryPage,
  AdvancedWorkflowMonitoringPage,
  AdvancedOverlayEditorPage,
  AdvancedSpecExperimentsPage,
  // Safety
  SafetyOverviewPage,
  SafetySigningPage,
  SafetyAuditingPage,
  SafetyMigrationsPage,
  SafetyPDPPage,
  SafetyTenantIsolationPage,
  // Integrations
  IntegrationsOverviewPage,
  IntegrationsCircuitBreakersPage,
  IntegrationsElevenLabsPage,
  IntegrationsGmailPage,
  IntegrationsGoogleCalendarPage,
  IntegrationsOpenAIPage,
  IntegrationsPostmarkPage,
  IntegrationsPowensPage,
  IntegrationsQdrantPage,
  IntegrationsResendPage,
  IntegrationsS3Page,
  IntegrationsSpecModelPage,
  IntegrationsStripePage,
  IntegrationsTwilioPage,
  // Knowledge
  KnowledgeOverviewPage,
  KnowledgeCategoriesPage,
  KnowledgeExamplesPage,
  KnowledgeSourcesPage,
  KnowledgeSpacesPage,
  // Comparison
  ComparisonOverviewPage,
  ComparisonAutomationPlatformsPage,
  ComparisonEnterprisePlatformsPage,
  ComparisonInternalToolBuildersPage,
  ComparisonWorkflowEnginesPage,
  ComparisonWindmillPage,
  // Ops
  OpsAutoEvolutionPage,
  OpsDistributedTracingPage,
  // Manifesto
  ManifestoPage,
  // Studio
  StudioOverviewPage,
  StudioGettingStartedPage,
  StudioVisualBuilderPage,
  StudioIntegrationsPage,
  StudioDeploymentsPage,
  StudioBYOKPage,
} from '@lssm/bundle.contractspec-studio/presentation/components/docs';

/**
 * Component map for React rendering.
 * Maps componentKey to actual React components.
 */
export const componentMap: ComponentMap = {
  // Root pages
  LandingPage: ClientPage,
  DocsIndexPage: DocsIndexPage,
  PricingPage: PricingClient,
  ProductPage: ProductClientPage,
  ContactPage: ContactClient,
  ChangelogPage: ChangelogPage,

  // Getting Started
  InstallationPage: InstallationPage,
  HelloWorldPage: HelloWorldPage,
  CLIPage: CLIPage,
  DataViewTutorialPage: DataViewTutorialPage,

  // Specs
  SpecsOverviewPage: SpecsOverviewPage,
  SpecsCapabilitiesPage: SpecsCapabilitiesPage,
  SpecsDataViewsPage: SpecsDataViewsPage,
  SpecsWorkflowsPage: SpecsWorkflowsPage,
  SpecsPolicyPage: SpecsPolicyPage,
  SpecsOverlaysPage: SpecsOverlaysPage,

  // Libraries
  LibrariesOverviewPage: LibrariesOverviewPage,
  LibrariesContractsPage: LibrariesContractsPage,
  LibrariesAiAgentPage: LibrariesAiAgentPage,
  LibrariesAnalyticsPage: LibrariesAnalyticsPage,
  LibrariesAccessibilityPage: LibrariesAccessibilityPage,
  LibrariesContentGenPage: LibrariesContentGenPage,
  LibrariesCostTrackingPage: LibrariesCostTrackingPage,
  LibrariesDataBackendPage: LibrariesDataBackendPage,
  LibrariesDataViewsPage: LibrariesDataViewsPage,
  LibrariesDesignSystemPage: LibrariesDesignSystemPage,
  LibrariesEvolutionPage: LibrariesEvolutionPage,
  LibrariesGraphQLPage: LibrariesGraphQLPage,
  LibrariesGrowthPage: LibrariesGrowthPage,
  LibrariesMultiTenancyPage: LibrariesMultiTenancyPage,
  LibrariesObservabilityPage: LibrariesObservabilityPage,
  LibrariesOverlayEnginePage: LibrariesOverlayEnginePage,
  LibrariesPersonalizationPage: LibrariesPersonalizationPage,
  LibrariesProgressiveDeliveryPage: LibrariesProgressiveDeliveryPage,
  LibrariesResiliencePage: LibrariesResiliencePage,
  LibrariesRuntimePage: LibrariesRuntimePage,
  LibrariesSchemaPage: LibrariesSchemaPage,
  LibrariesSLOPage: LibrariesSLOPage,
  LibrariesSupportBotPage: LibrariesSupportBotPage,
  LibrariesTestingPage: LibrariesTestingPage,
  LibrariesUIKitPage: LibrariesUIKitPage,
  LibrariesWorkflowsPage: LibrariesWorkflowsPage,
  LibrariesWorkflowComposerPage: LibrariesWorkflowComposerPage,

  // Architecture
  ArchitectureOverviewPage: ArchitectureOverviewPage,
  ArchitectureAppConfigPage: ArchitectureAppConfigPage,
  ArchitectureMultiTenancyPage: ArchitectureMultiTenancyPage,
  ArchitectureIntegrationBindingPage: ArchitectureIntegrationBindingPage,
  ArchitectureKnowledgeBindingPage: ArchitectureKnowledgeBindingPage,

  // Advanced
  AdvancedRenderersPage: AdvancedRenderersPage,
  AdvancedMCPPage: AdvancedMCPPage,
  AdvancedTelemetryPage: AdvancedTelemetryPage,
  AdvancedWorkflowMonitoringPage: AdvancedWorkflowMonitoringPage,
  AdvancedOverlayEditorPage: AdvancedOverlayEditorPage,
  AdvancedSpecExperimentsPage: AdvancedSpecExperimentsPage,

  // Safety
  SafetyOverviewPage: SafetyOverviewPage,
  SafetySigningPage: SafetySigningPage,
  SafetyAuditingPage: SafetyAuditingPage,
  SafetyMigrationsPage: SafetyMigrationsPage,
  SafetyPDPPage: SafetyPDPPage,
  SafetyTenantIsolationPage: SafetyTenantIsolationPage,

  // Integrations
  IntegrationsOverviewPage: IntegrationsOverviewPage,
  IntegrationsCircuitBreakersPage: IntegrationsCircuitBreakersPage,
  IntegrationsElevenLabsPage: IntegrationsElevenLabsPage,
  IntegrationsGmailPage: IntegrationsGmailPage,
  IntegrationsGoogleCalendarPage: IntegrationsGoogleCalendarPage,
  IntegrationsOpenAIPage: IntegrationsOpenAIPage,
  IntegrationsPostmarkPage: IntegrationsPostmarkPage,
  IntegrationsPowensPage: IntegrationsPowensPage,
  IntegrationsQdrantPage: IntegrationsQdrantPage,
  IntegrationsResendPage: IntegrationsResendPage,
  IntegrationsS3Page: IntegrationsS3Page,
  IntegrationsSpecModelPage: IntegrationsSpecModelPage,
  IntegrationsStripePage: IntegrationsStripePage,
  IntegrationsTwilioPage: IntegrationsTwilioPage,

  // Knowledge
  KnowledgeOverviewPage: KnowledgeOverviewPage,
  KnowledgeCategoriesPage: KnowledgeCategoriesPage,
  KnowledgeExamplesPage: KnowledgeExamplesPage,
  KnowledgeSourcesPage: KnowledgeSourcesPage,
  KnowledgeSpacesPage: KnowledgeSpacesPage,

  // Comparison
  ComparisonOverviewPage: ComparisonOverviewPage,
  ComparisonAutomationPlatformsPage: ComparisonAutomationPlatformsPage,
  ComparisonEnterprisePlatformsPage: ComparisonEnterprisePlatformsPage,
  ComparisonInternalToolBuildersPage: ComparisonInternalToolBuildersPage,
  ComparisonWorkflowEnginesPage: ComparisonWorkflowEnginesPage,
  ComparisonWindmillPage: ComparisonWindmillPage,

  // Ops
  OpsAutoEvolutionPage: OpsAutoEvolutionPage,
  OpsDistributedTracingPage: OpsDistributedTracingPage,

  // Manifesto
  ManifestoPage: ManifestoPage,

  // Studio
  StudioOverviewPage: StudioOverviewPage,
  StudioGettingStartedPage: StudioGettingStartedPage,
  StudioVisualBuilderPage: StudioVisualBuilderPage,
  StudioIntegrationsPage: StudioIntegrationsPage,
  StudioDeploymentsPage: StudioDeploymentsPage,
  StudioBYOKPage: StudioBYOKPage,
};

/**
 * Helper to create a React component presentation descriptor.
 */
function createComponentPresentation(
  name: string,
  componentKey: string,
  description: string,
  version = 1
): PresentationDescriptorV2 {
  const source: PresentationSourceComponentReact = {
    type: 'component',
    framework: 'react',
    componentKey,
  };

  return {
    meta: {
      name,
      version,
      description,
    },
    source,
    targets: ['react', 'markdown'],
  };
}

/**
 * Presentation descriptors for all static pages.
 * Maps route paths to PresentationDescriptorV2 definitions.
 */
export const presentationRegistry = new Map<string, PresentationDescriptorV2>([
  // Root pages
  [
    '/',
    createComponentPresentation(
      'web-landing.home',
      'LandingPage',
      'ContractSpec landing page - Stabilize your AI-generated code',
      1
    ),
  ],
  [
    '/docs',
    createComponentPresentation(
      'web-landing.docs.index',
      'DocsIndexPage',
      'ContractSpec documentation index page',
      1
    ),
  ],
  [
    '/pricing',
    createComponentPresentation(
      'web-landing.pricing',
      'PricingPage',
      'ContractSpec pricing information',
      1
    ),
  ],
  [
    '/product',
    createComponentPresentation(
      'web-landing.product',
      'ProductPage',
      'ContractSpec product overview',
      1
    ),
  ],
  [
    '/contact',
    createComponentPresentation(
      'web-landing.contact',
      'ContactPage',
      'Contact ContractSpec team',
      1
    ),
  ],
  [
    '/changelog',
    createComponentPresentation(
      'web-landing.changelog',
      'ChangelogPage',
      'ContractSpec changelog and release notes',
      1
    ),
  ],

  // Getting Started
  [
    '/docs/getting-started/installation',
    createComponentPresentation(
      'web-landing.docs.installation',
      'InstallationPage',
      'ContractSpec installation guide',
      1
    ),
  ],
  [
    '/docs/getting-started/hello-world',
    createComponentPresentation(
      'web-landing.docs.hello-world',
      'HelloWorldPage',
      'ContractSpec hello world tutorial - your first operation',
      1
    ),
  ],
  [
    '/docs/getting-started/cli',
    createComponentPresentation(
      'web-landing.docs.cli',
      'CLIPage',
      'ContractSpec CLI reference guide',
      1
    ),
  ],
  [
    '/docs/getting-started/dataviews',
    createComponentPresentation(
      'web-landing.docs.dataviews-tutorial',
      'DataViewTutorialPage',
      'ContractSpec DataView tutorial - display data with DataViews',
      1
    ),
  ],

  // Specs
  [
    '/docs/specs',
    createComponentPresentation(
      'web-landing.docs.specs.overview',
      'SpecsOverviewPage',
      'ContractSpec specifications overview',
      1
    ),
  ],
  [
    '/docs/specs/capabilities',
    createComponentPresentation(
      'web-landing.docs.specs.capabilities',
      'SpecsCapabilitiesPage',
      'ContractSpec capabilities - commands, queries, events, presentations',
      1
    ),
  ],
  [
    '/docs/specs/dataviews',
    createComponentPresentation(
      'web-landing.docs.specs.dataviews',
      'SpecsDataViewsPage',
      'ContractSpec DataViews specification',
      1
    ),
  ],
  [
    '/docs/specs/workflows',
    createComponentPresentation(
      'web-landing.docs.specs.workflows',
      'SpecsWorkflowsPage',
      'ContractSpec workflows specification',
      1
    ),
  ],
  [
    '/docs/specs/policy',
    createComponentPresentation(
      'web-landing.docs.specs.policy',
      'SpecsPolicyPage',
      'ContractSpec policy specification',
      1
    ),
  ],
  [
    '/docs/specs/overlays',
    createComponentPresentation(
      'web-landing.docs.specs.overlays',
      'SpecsOverlaysPage',
      'ContractSpec overlays specification',
      1
    ),
  ],

  // Libraries
  [
    '/docs/libraries',
    createComponentPresentation(
      'web-landing.docs.libraries.overview',
      'LibrariesOverviewPage',
      'ContractSpec libraries overview',
      1
    ),
  ],
  [
    '/docs/libraries/contracts',
    createComponentPresentation(
      'web-landing.docs.libraries.contracts',
      'LibrariesContractsPage',
      'ContractSpec contracts library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/ai-agent',
    createComponentPresentation(
      'web-landing.docs.libraries.ai-agent',
      'LibrariesAiAgentPage',
      'ContractSpec AI agent library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/analytics',
    createComponentPresentation(
      'web-landing.docs.libraries.analytics',
      'LibrariesAnalyticsPage',
      'ContractSpec analytics library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/accessibility',
    createComponentPresentation(
      'web-landing.docs.libraries.accessibility',
      'LibrariesAccessibilityPage',
      'ContractSpec accessibility library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/content-gen',
    createComponentPresentation(
      'web-landing.docs.libraries.content-gen',
      'LibrariesContentGenPage',
      'ContractSpec content generation library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/cost-tracking',
    createComponentPresentation(
      'web-landing.docs.libraries.cost-tracking',
      'LibrariesCostTrackingPage',
      'ContractSpec cost tracking library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/data-backend',
    createComponentPresentation(
      'web-landing.docs.libraries.data-backend',
      'LibrariesDataBackendPage',
      'ContractSpec data backend library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/data-views',
    createComponentPresentation(
      'web-landing.docs.libraries.data-views',
      'LibrariesDataViewsPage',
      'ContractSpec data views library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/design-system',
    createComponentPresentation(
      'web-landing.docs.libraries.design-system',
      'LibrariesDesignSystemPage',
      'ContractSpec design system library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/evolution',
    createComponentPresentation(
      'web-landing.docs.libraries.evolution',
      'LibrariesEvolutionPage',
      'ContractSpec evolution library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/graphql',
    createComponentPresentation(
      'web-landing.docs.libraries.graphql',
      'LibrariesGraphQLPage',
      'ContractSpec GraphQL library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/growth',
    createComponentPresentation(
      'web-landing.docs.libraries.growth',
      'LibrariesGrowthPage',
      'ContractSpec growth library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/multi-tenancy',
    createComponentPresentation(
      'web-landing.docs.libraries.multi-tenancy',
      'LibrariesMultiTenancyPage',
      'ContractSpec multi-tenancy library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/observability',
    createComponentPresentation(
      'web-landing.docs.libraries.observability',
      'LibrariesObservabilityPage',
      'ContractSpec observability library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/overlay-engine',
    createComponentPresentation(
      'web-landing.docs.libraries.overlay-engine',
      'LibrariesOverlayEnginePage',
      'ContractSpec overlay engine library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/personalization',
    createComponentPresentation(
      'web-landing.docs.libraries.personalization',
      'LibrariesPersonalizationPage',
      'ContractSpec personalization library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/progressive-delivery',
    createComponentPresentation(
      'web-landing.docs.libraries.progressive-delivery',
      'LibrariesProgressiveDeliveryPage',
      'ContractSpec progressive delivery library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/resilience',
    createComponentPresentation(
      'web-landing.docs.libraries.resilience',
      'LibrariesResiliencePage',
      'ContractSpec resilience library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/runtime',
    createComponentPresentation(
      'web-landing.docs.libraries.runtime',
      'LibrariesRuntimePage',
      'ContractSpec runtime library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/schema',
    createComponentPresentation(
      'web-landing.docs.libraries.schema',
      'LibrariesSchemaPage',
      'ContractSpec schema library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/slo',
    createComponentPresentation(
      'web-landing.docs.libraries.slo',
      'LibrariesSLOPage',
      'ContractSpec SLO library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/support-bot',
    createComponentPresentation(
      'web-landing.docs.libraries.support-bot',
      'LibrariesSupportBotPage',
      'ContractSpec support bot library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/testing',
    createComponentPresentation(
      'web-landing.docs.libraries.testing',
      'LibrariesTestingPage',
      'ContractSpec testing library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/ui-kit',
    createComponentPresentation(
      'web-landing.docs.libraries.ui-kit',
      'LibrariesUIKitPage',
      'ContractSpec UI kit library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/workflows',
    createComponentPresentation(
      'web-landing.docs.libraries.workflows',
      'LibrariesWorkflowsPage',
      'ContractSpec workflows library documentation',
      1
    ),
  ],
  [
    '/docs/libraries/workflow-composer',
    createComponentPresentation(
      'web-landing.docs.libraries.workflow-composer',
      'LibrariesWorkflowComposerPage',
      'ContractSpec workflow composer library documentation',
      1
    ),
  ],

  // Architecture
  [
    '/docs/architecture',
    createComponentPresentation(
      'web-landing.docs.architecture.overview',
      'ArchitectureOverviewPage',
      'ContractSpec architecture overview',
      1
    ),
  ],
  [
    '/docs/architecture/app-config',
    createComponentPresentation(
      'web-landing.docs.architecture.app-config',
      'ArchitectureAppConfigPage',
      'ContractSpec app configuration documentation',
      1
    ),
  ],
  [
    '/docs/architecture/multi-tenancy',
    createComponentPresentation(
      'web-landing.docs.architecture.multi-tenancy',
      'ArchitectureMultiTenancyPage',
      'ContractSpec multi-tenancy architecture documentation',
      1
    ),
  ],
  [
    '/docs/architecture/integration-binding',
    createComponentPresentation(
      'web-landing.docs.architecture.integration-binding',
      'ArchitectureIntegrationBindingPage',
      'ContractSpec integration binding architecture documentation',
      1
    ),
  ],
  [
    '/docs/architecture/knowledge-binding',
    createComponentPresentation(
      'web-landing.docs.architecture.knowledge-binding',
      'ArchitectureKnowledgeBindingPage',
      'ContractSpec knowledge binding architecture documentation',
      1
    ),
  ],

  // Advanced
  [
    '/docs/advanced/renderers',
    createComponentPresentation(
      'web-landing.docs.advanced.renderers',
      'AdvancedRenderersPage',
      'ContractSpec renderers documentation',
      1
    ),
  ],
  [
    '/docs/advanced/mcp',
    createComponentPresentation(
      'web-landing.docs.advanced.mcp',
      'AdvancedMCPPage',
      'ContractSpec MCP (Model Context Protocol) documentation',
      1
    ),
  ],
  [
    '/docs/advanced/telemetry',
    createComponentPresentation(
      'web-landing.docs.advanced.telemetry',
      'AdvancedTelemetryPage',
      'ContractSpec telemetry documentation',
      1
    ),
  ],
  [
    '/docs/advanced/workflow-monitoring',
    createComponentPresentation(
      'web-landing.docs.advanced.workflow-monitoring',
      'AdvancedWorkflowMonitoringPage',
      'ContractSpec workflow monitoring documentation',
      1
    ),
  ],
  [
    '/docs/advanced/overlay-editor',
    createComponentPresentation(
      'web-landing.docs.advanced.overlay-editor',
      'AdvancedOverlayEditorPage',
      'ContractSpec overlay editor documentation',
      1
    ),
  ],
  [
    '/docs/advanced/spec-experiments',
    createComponentPresentation(
      'web-landing.docs.advanced.spec-experiments',
      'AdvancedSpecExperimentsPage',
      'ContractSpec spec experiments documentation',
      1
    ),
  ],

  // Safety
  [
    '/docs/safety',
    createComponentPresentation(
      'web-landing.docs.safety.overview',
      'SafetyOverviewPage',
      'ContractSpec safety overview',
      1
    ),
  ],
  [
    '/docs/safety/signing',
    createComponentPresentation(
      'web-landing.docs.safety.signing',
      'SafetySigningPage',
      'ContractSpec signing and attestation documentation',
      1
    ),
  ],
  [
    '/docs/safety/auditing',
    createComponentPresentation(
      'web-landing.docs.safety.auditing',
      'SafetyAuditingPage',
      'ContractSpec auditing documentation',
      1
    ),
  ],
  [
    '/docs/safety/migrations',
    createComponentPresentation(
      'web-landing.docs.safety.migrations',
      'SafetyMigrationsPage',
      'ContractSpec migrations documentation',
      1
    ),
  ],
  [
    '/docs/safety/pdp',
    createComponentPresentation(
      'web-landing.docs.safety.pdp',
      'SafetyPDPPage',
      'ContractSpec Policy Decision Point (PDP) documentation',
      1
    ),
  ],
  [
    '/docs/safety/tenant-isolation',
    createComponentPresentation(
      'web-landing.docs.safety.tenant-isolation',
      'SafetyTenantIsolationPage',
      'ContractSpec tenant isolation documentation',
      1
    ),
  ],

  // Integrations
  [
    '/docs/integrations',
    createComponentPresentation(
      'web-landing.docs.integrations.overview',
      'IntegrationsOverviewPage',
      'ContractSpec integrations overview',
      1
    ),
  ],
  [
    '/docs/integrations/circuit-breakers',
    createComponentPresentation(
      'web-landing.docs.integrations.circuit-breakers',
      'IntegrationsCircuitBreakersPage',
      'ContractSpec circuit breakers integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/elevenlabs',
    createComponentPresentation(
      'web-landing.docs.integrations.elevenlabs',
      'IntegrationsElevenLabsPage',
      'ContractSpec ElevenLabs integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/gmail',
    createComponentPresentation(
      'web-landing.docs.integrations.gmail',
      'IntegrationsGmailPage',
      'ContractSpec Gmail integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/google-calendar',
    createComponentPresentation(
      'web-landing.docs.integrations.google-calendar',
      'IntegrationsGoogleCalendarPage',
      'ContractSpec Google Calendar integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/openai',
    createComponentPresentation(
      'web-landing.docs.integrations.openai',
      'IntegrationsOpenAIPage',
      'ContractSpec OpenAI integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/postmark',
    createComponentPresentation(
      'web-landing.docs.integrations.postmark',
      'IntegrationsPostmarkPage',
      'ContractSpec Postmark integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/powens',
    createComponentPresentation(
      'web-landing.docs.integrations.powens',
      'IntegrationsPowensPage',
      'ContractSpec Powens integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/qdrant',
    createComponentPresentation(
      'web-landing.docs.integrations.qdrant',
      'IntegrationsQdrantPage',
      'ContractSpec Qdrant integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/resend',
    createComponentPresentation(
      'web-landing.docs.integrations.resend',
      'IntegrationsResendPage',
      'ContractSpec Resend integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/s3',
    createComponentPresentation(
      'web-landing.docs.integrations.s3',
      'IntegrationsS3Page',
      'ContractSpec S3 integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/spec-model',
    createComponentPresentation(
      'web-landing.docs.integrations.spec-model',
      'IntegrationsSpecModelPage',
      'ContractSpec spec model integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/stripe',
    createComponentPresentation(
      'web-landing.docs.integrations.stripe',
      'IntegrationsStripePage',
      'ContractSpec Stripe integration documentation',
      1
    ),
  ],
  [
    '/docs/integrations/twilio',
    createComponentPresentation(
      'web-landing.docs.integrations.twilio',
      'IntegrationsTwilioPage',
      'ContractSpec Twilio integration documentation',
      1
    ),
  ],

  // Knowledge
  [
    '/docs/knowledge',
    createComponentPresentation(
      'web-landing.docs.knowledge.overview',
      'KnowledgeOverviewPage',
      'ContractSpec knowledge overview',
      1
    ),
  ],
  [
    '/docs/knowledge/categories',
    createComponentPresentation(
      'web-landing.docs.knowledge.categories',
      'KnowledgeCategoriesPage',
      'ContractSpec knowledge categories documentation',
      1
    ),
  ],
  [
    '/docs/knowledge/examples',
    createComponentPresentation(
      'web-landing.docs.knowledge.examples',
      'KnowledgeExamplesPage',
      'ContractSpec knowledge examples documentation',
      1
    ),
  ],
  [
    '/docs/knowledge/sources',
    createComponentPresentation(
      'web-landing.docs.knowledge.sources',
      'KnowledgeSourcesPage',
      'ContractSpec knowledge sources documentation',
      1
    ),
  ],
  [
    '/docs/knowledge/spaces',
    createComponentPresentation(
      'web-landing.docs.knowledge.spaces',
      'KnowledgeSpacesPage',
      'ContractSpec knowledge spaces documentation',
      1
    ),
  ],

  // Comparison
  [
    '/docs/comparison',
    createComponentPresentation(
      'web-landing.docs.comparison.overview',
      'ComparisonOverviewPage',
      'ContractSpec comparison overview',
      1
    ),
  ],
  [
    '/docs/comparison/automation-platforms',
    createComponentPresentation(
      'web-landing.docs.comparison.automation-platforms',
      'ComparisonAutomationPlatformsPage',
      'ContractSpec comparison with automation platforms',
      1
    ),
  ],
  [
    '/docs/comparison/enterprise-platforms',
    createComponentPresentation(
      'web-landing.docs.comparison.enterprise-platforms',
      'ComparisonEnterprisePlatformsPage',
      'ContractSpec comparison with enterprise platforms',
      1
    ),
  ],
  [
    '/docs/comparison/internal-tool-builders',
    createComponentPresentation(
      'web-landing.docs.comparison.internal-tool-builders',
      'ComparisonInternalToolBuildersPage',
      'ContractSpec comparison with internal tool builders',
      1
    ),
  ],
  [
    '/docs/comparison/workflow-engines',
    createComponentPresentation(
      'web-landing.docs.comparison.workflow-engines',
      'ComparisonWorkflowEnginesPage',
      'ContractSpec comparison with workflow engines',
      1
    ),
  ],
  [
    '/docs/comparison/windmill',
    createComponentPresentation(
      'web-landing.docs.comparison.windmill',
      'ComparisonWindmillPage',
      'ContractSpec comparison with Windmill',
      1
    ),
  ],

  // Ops
  [
    '/docs/ops/auto-evolution',
    createComponentPresentation(
      'web-landing.docs.ops.auto-evolution',
      'OpsAutoEvolutionPage',
      'ContractSpec auto-evolution operations documentation',
      1
    ),
  ],
  [
    '/docs/ops/distributed-tracing',
    createComponentPresentation(
      'web-landing.docs.ops.distributed-tracing',
      'OpsDistributedTracingPage',
      'ContractSpec distributed tracing operations documentation',
      1
    ),
  ],

  // Manifesto
  [
    '/docs/manifesto',
    createComponentPresentation(
      'web-landing.docs.manifesto',
      'ManifestoPage',
      'ContractSpec manifesto - compiler not prison',
      1
    ),
  ],

  // Studio
  [
    '/docs/studio',
    createComponentPresentation(
      'web-landing.docs.studio.overview',
      'StudioOverviewPage',
      'ContractSpec Studio overview',
      1
    ),
  ],
  [
    '/docs/studio/getting-started',
    createComponentPresentation(
      'web-landing.docs.studio.getting-started',
      'StudioGettingStartedPage',
      'ContractSpec Studio getting started guide',
      1
    ),
  ],
  [
    '/docs/studio/visual-builder',
    createComponentPresentation(
      'web-landing.docs.studio.visual-builder',
      'StudioVisualBuilderPage',
      'ContractSpec Studio visual builder documentation',
      1
    ),
  ],
  [
    '/docs/studio/integrations',
    createComponentPresentation(
      'web-landing.docs.studio.integrations',
      'StudioIntegrationsPage',
      'ContractSpec Studio integrations documentation',
      1
    ),
  ],
  [
    '/docs/studio/deployments',
    createComponentPresentation(
      'web-landing.docs.studio.deployments',
      'StudioDeploymentsPage',
      'ContractSpec Studio deployments documentation',
      1
    ),
  ],
  [
    '/docs/studio/byok',
    createComponentPresentation(
      'web-landing.docs.studio.byok',
      'StudioBYOKPage',
      'ContractSpec Studio BYOK (Bring Your Own Key) documentation',
      1
    ),
  ],
]);

/**
 * Get presentation descriptor for a given route.
 * Returns undefined if no presentation exists for the route.
 */
export function getPresentationForRoute(
  route: string
): PresentationDescriptorV2 | undefined {
  // Normalize route (remove trailing slash, handle root)
  const normalizedRoute = route === '/' ? '/' : route.replace(/\/$/, '');
  return presentationRegistry.get(normalizedRoute);
}

/**
 * Check if a route has a presentation descriptor.
 */
export function hasPresentation(route: string): boolean {
  return getPresentationForRoute(route) !== undefined;
}

/**
 * Get all registered routes with presentations.
 */
export function getAllPresentationRoutes(): string[] {
  return Array.from(presentationRegistry.keys());
}
