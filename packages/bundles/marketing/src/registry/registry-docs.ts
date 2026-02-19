import { TagsEnum } from '@contractspec/lib.contracts-spec/ownership';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import {
  createComponentPresentation,
  DOCS_CONTEXT,
  DOCS_GOAL,
  tagsFromPath,
} from './factory';
import type { ComponentMap } from './types';

// Import doc page components from local marketing bundle
// Note: Imports are relative to src/registry (../components/docs/...)

// Advanced
import { AdvancedMCPPage } from '@contractspec/bundle.library/components/docs/advanced/AdvancedMCPPage';
import { AdvancedOverlayEditorPage } from '@contractspec/bundle.library/components/docs/advanced/AdvancedOverlayEditorPage';
import { AdvancedRenderersPage } from '@contractspec/bundle.library/components/docs/advanced/AdvancedRenderersPage';
import { AdvancedSpecExperimentsPage } from '@contractspec/bundle.library/components/docs/advanced/AdvancedSpecExperimentsPage';
import { AdvancedTelemetryPage } from '@contractspec/bundle.library/components/docs/advanced/AdvancedTelemetryPage';
import { AdvancedWorkflowMonitoringPage } from '@contractspec/bundle.library/components/docs/advanced/AdvancedWorkflowMonitoringPage';

// Architecture
import { ArchitectureAppConfigPage } from '@contractspec/bundle.library/components/docs/architecture/ArchitectureAppConfigPage';
import { ArchitectureIntegrationBindingPage } from '@contractspec/bundle.library/components/docs/architecture/ArchitectureIntegrationBindingPage';
import { ArchitectureKnowledgeBindingPage } from '@contractspec/bundle.library/components/docs/architecture/ArchitectureKnowledgeBindingPage';
import { ArchitectureMultiTenancyPage } from '@contractspec/bundle.library/components/docs/architecture/ArchitectureMultiTenancyPage';
import { ArchitectureOverviewPage } from '@contractspec/bundle.library/components/docs/architecture/ArchitectureOverviewPage';

// Comparison
import { ComparisonAutomationPlatformsPage } from '@contractspec/bundle.library/components/docs/comparison/ComparisonAutomationPlatformsPage';
import { ComparisonEnterprisePlatformsPage } from '@contractspec/bundle.library/components/docs/comparison/ComparisonEnterprisePlatformsPage';
import { ComparisonInternalToolBuildersPage } from '@contractspec/bundle.library/components/docs/comparison/ComparisonInternalToolBuildersPage';
import { ComparisonOverviewPage } from '@contractspec/bundle.library/components/docs/comparison/ComparisonOverviewPage';
import { ComparisonWindmillPage } from '@contractspec/bundle.library/components/docs/comparison/ComparisonWindmillPage';
import { ComparisonWorkflowEnginesPage } from '@contractspec/bundle.library/components/docs/comparison/ComparisonWorkflowEnginesPage';

// Getting Started
import { CLIPage } from '@contractspec/bundle.library/components/docs/getting-started/CLIPage';
import { DataViewTutorialPage } from '@contractspec/bundle.library/components/docs/getting-started/DataViewTutorialPage';
import { HelloWorldPage } from '@contractspec/bundle.library/components/docs/getting-started/HelloWorldPage';
import { InstallationPage } from '@contractspec/bundle.library/components/docs/getting-started/InstallationPage';
import { StartHerePage } from '@contractspec/bundle.library/components/docs/getting-started/StartHerePage';
import { TroubleshootingPage } from '@contractspec/bundle.library/components/docs/getting-started/TroubleshootingPage';
import { CompatibilityPage } from '@contractspec/bundle.library/components/docs/getting-started/CompatibilityPage';

// Integrations
import { IntegrationsCircuitBreakersPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsCircuitBreakersPage';
import { IntegrationsElevenLabsPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsElevenLabsPage';
import { IntegrationsGmailPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsGmailPage';
import { IntegrationsGoogleCalendarPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsGoogleCalendarPage';
import { IntegrationsOpenAIPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsOpenAIPage';
import { IntegrationsOverviewPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsOverviewPage';
import { IntegrationsPostmarkPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsPostmarkPage';
import { IntegrationsPowensPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsPowensPage';
import { IntegrationsQdrantPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsQdrantPage';
import { IntegrationsResendPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsResendPage';
import { IntegrationsS3Page } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsS3Page';
import { IntegrationsSpecModelPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsSpecModelPage';
import { IntegrationsStripePage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsStripePage';
import { IntegrationsTwilioPage } from '@contractspec/bundle.library/components/docs/integrations/IntegrationsTwilioPage';

// Knowledge
import { KnowledgeCategoriesPage } from '@contractspec/bundle.library/components/docs/knowledge/KnowledgeCategoriesPage';
import { KnowledgeExamplesPage } from '@contractspec/bundle.library/components/docs/knowledge/KnowledgeExamplesPage';
import { KnowledgeOverviewPage } from '@contractspec/bundle.library/components/docs/knowledge/KnowledgeOverviewPage';
import { KnowledgeSourcesPage } from '@contractspec/bundle.library/components/docs/knowledge/KnowledgeSourcesPage';
import { KnowledgeSpacesPage } from '@contractspec/bundle.library/components/docs/knowledge/KnowledgeSpacesPage';

// Libraries
import { LibrariesAccessibilityPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesAccessibilityPage';
import { LibrariesAiAgentPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesAiAgentPage';
import { LibrariesAnalyticsPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesAnalyticsPage';
import { LibrariesContentGenPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesContentGenPage';
import { LibrariesContractsPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesContractsPage';
import { LibrariesCostTrackingPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesCostTrackingPage';
import { LibrariesDataBackendPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesDataBackendPage';
import { LibrariesDataViewsPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesDataViewsPage';
import { LibrariesDesignSystemPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesDesignSystemPage';
import { LibrariesEvolutionPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesEvolutionPage';
import { LibrariesGraphQLPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesGraphQLPage';
import { LibrariesGrowthPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesGrowthPage';
import { LibrariesMultiTenancyPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesMultiTenancyPage';
import { LibrariesObservabilityPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesObservabilityPage';
import { LibrariesOverlayEnginePage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesOverlayEnginePage';
import { LibrariesOverviewPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesOverviewPage';
import { LibrariesPersonalizationPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesPersonalizationPage';
import { LibrariesProgressiveDeliveryPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesProgressiveDeliveryPage';
import { LibrariesResiliencePage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesResiliencePage';
import { LibrariesRuntimePage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesRuntimePage';
import { LibrariesSchemaPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesSchemaPage';
import { LibrariesSLOPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesSLOPage';
import { LibrariesSupportBotPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesSupportBotPage';
import { LibrariesTestingPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesTestingPage';
import { LibrariesUIKitPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesUIKitPage';
import { LibrariesWorkflowComposerPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesWorkflowComposerPage';
import { LibrariesWorkflowsPage } from '@contractspec/bundle.library/components/docs/libraries/LibrariesWorkflowsPage';

// Manifesto
import { ManifestoPage } from '@contractspec/bundle.library/components/docs/manifesto/ManifestoPage';

// Ops
import { OpsAutoEvolutionPage } from '@contractspec/bundle.library/components/docs/ops/AutoEvolutionOpsPage';
import { OpsDistributedTracingPage } from '@contractspec/bundle.library/components/docs/ops/DistributedTracingOpsPage';

// Safety
import { SafetyAuditingPage } from '@contractspec/bundle.library/components/docs/safety/SafetyAuditingPage';
import { SafetyMigrationsPage } from '@contractspec/bundle.library/components/docs/safety/SafetyMigrationsPage';
import { SafetyOverviewPage } from '@contractspec/bundle.library/components/docs/safety/SafetyOverviewPage';
import { SafetyPDPPage } from '@contractspec/bundle.library/components/docs/safety/SafetyPDPPage';
import { SafetySigningPage } from '@contractspec/bundle.library/components/docs/safety/SafetySigningPage';
import { SafetyTenantIsolationPage } from '@contractspec/bundle.library/components/docs/safety/SafetyTenantIsolationPage';

// Specs
import { SpecsCapabilitiesPage } from '@contractspec/bundle.library/components/docs/specs/SpecsCapabilitiesPage';
import { SpecsDataViewsPage } from '@contractspec/bundle.library/components/docs/specs/SpecsDataViewsPage';
import { SpecsOverlaysPage } from '@contractspec/bundle.library/components/docs/specs/SpecsOverlaysPage';
import { SpecsOverviewPage } from '@contractspec/bundle.library/components/docs/specs/SpecsOverviewPage';
import { SpecsPolicyPage } from '@contractspec/bundle.library/components/docs/specs/SpecsPolicyPage';
import { SpecsWorkflowsPage } from '@contractspec/bundle.library/components/docs/specs/SpecsWorkflowsPage';

// Studio
import { StudioOverviewPage } from '@contractspec/bundle.library/components/docs/studio/StudioOverviewPage';

// Docs Index
import { DocsIndexPage } from '@contractspec/bundle.library/components/docs/DocsIndexPage';

/**
 * Component map for documentation page React rendering.
 */
export const docsComponentMap: ComponentMap = {
  DocsIndexPage,
  // Getting Started
  InstallationPage,
  StartHerePage,
  TroubleshootingPage,
  CompatibilityPage,
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
  // Studio docs
  StudioOverviewPage,
};

/** Helper to create a docs presentation entry */
function docsEntry(
  route: string,
  key: string,
  componentKey: string,
  description: string
): [string, PresentationSpec] {
  return [
    route,
    createComponentPresentation({
      key,
      componentKey,
      description,
      goal: DOCS_GOAL,
      context: DOCS_CONTEXT,
      tags: [TagsEnum.Docs, ...tagsFromPath(route)],
    }),
  ];
}

/**
 * Presentation specs for documentation pages.
 */
export const docsPresentations: [string, PresentationSpec][] = [
  // Docs index
  docsEntry(
    '/docs',
    'web-landing.docs.index',
    'DocsIndexPage',
    'ContractSpec documentation index page'
  ),

  // Getting Started
  docsEntry(
    '/docs/getting-started/start-here',
    'web-landing.docs.start-here',
    'StartHerePage',
    'ContractSpec start here onboarding guide'
  ),
  docsEntry(
    '/docs/getting-started/troubleshooting',
    'web-landing.docs.troubleshooting',
    'TroubleshootingPage',
    'ContractSpec getting started troubleshooting'
  ),
  docsEntry(
    '/docs/getting-started/compatibility',
    'web-landing.docs.compatibility',
    'CompatibilityPage',
    'ContractSpec compatibility and requirements'
  ),
  docsEntry(
    '/docs/getting-started/installation',
    'web-landing.docs.installation',
    'InstallationPage',
    'ContractSpec installation guide'
  ),
  docsEntry(
    '/docs/getting-started/hello-world',
    'web-landing.docs.hello-world',
    'HelloWorldPage',
    'ContractSpec hello world tutorial'
  ),
  docsEntry(
    '/docs/getting-started/cli',
    'web-landing.docs.cli',
    'CLIPage',
    'ContractSpec CLI reference guide'
  ),
  docsEntry(
    '/docs/getting-started/dataviews',
    'web-landing.docs.dataviews-tutorial',
    'DataViewTutorialPage',
    'ContractSpec DataView tutorial'
  ),

  // Specs
  docsEntry(
    '/docs/specs',
    'web-landing.docs.specs.overview',
    'SpecsOverviewPage',
    'ContractSpec specifications overview'
  ),
  docsEntry(
    '/docs/specs/capabilities',
    'web-landing.docs.specs.capabilities',
    'SpecsCapabilitiesPage',
    'ContractSpec capabilities'
  ),
  docsEntry(
    '/docs/specs/dataviews',
    'web-landing.docs.specs.dataviews',
    'SpecsDataViewsPage',
    'ContractSpec DataViews specification'
  ),
  docsEntry(
    '/docs/specs/workflows',
    'web-landing.docs.specs.workflows',
    'SpecsWorkflowsPage',
    'ContractSpec workflows specification'
  ),
  docsEntry(
    '/docs/specs/policy',
    'web-landing.docs.specs.policy',
    'SpecsPolicyPage',
    'ContractSpec policy specification'
  ),
  docsEntry(
    '/docs/specs/overlays',
    'web-landing.docs.specs.overlays',
    'SpecsOverlaysPage',
    'ContractSpec overlays specification'
  ),

  // Libraries
  docsEntry(
    '/docs/libraries',
    'web-landing.docs.libraries.overview',
    'LibrariesOverviewPage',
    'ContractSpec libraries overview'
  ),
  docsEntry(
    '/docs/libraries/contracts',
    'web-landing.docs.libraries.contracts',
    'LibrariesContractsPage',
    'ContractSpec contracts library'
  ),
  docsEntry(
    '/docs/libraries/ai-agent',
    'web-landing.docs.libraries.ai-agent',
    'LibrariesAiAgentPage',
    'ContractSpec AI agent library'
  ),
  docsEntry(
    '/docs/libraries/analytics',
    'web-landing.docs.libraries.analytics',
    'LibrariesAnalyticsPage',
    'ContractSpec analytics library'
  ),
  docsEntry(
    '/docs/libraries/accessibility',
    'web-landing.docs.libraries.accessibility',
    'LibrariesAccessibilityPage',
    'ContractSpec accessibility library'
  ),
  docsEntry(
    '/docs/libraries/content-gen',
    'web-landing.docs.libraries.content-gen',
    'LibrariesContentGenPage',
    'ContractSpec content generation library'
  ),
  docsEntry(
    '/docs/libraries/cost-tracking',
    'web-landing.docs.libraries.cost-tracking',
    'LibrariesCostTrackingPage',
    'ContractSpec cost tracking library'
  ),
  docsEntry(
    '/docs/libraries/data-backend',
    'web-landing.docs.libraries.data-backend',
    'LibrariesDataBackendPage',
    'ContractSpec data backend library'
  ),
  docsEntry(
    '/docs/libraries/data-views',
    'web-landing.docs.libraries.data-views',
    'LibrariesDataViewsPage',
    'ContractSpec data views library'
  ),
  docsEntry(
    '/docs/libraries/design-system',
    'web-landing.docs.libraries.design-system',
    'LibrariesDesignSystemPage',
    'ContractSpec design system library'
  ),
  docsEntry(
    '/docs/libraries/evolution',
    'web-landing.docs.libraries.evolution',
    'LibrariesEvolutionPage',
    'ContractSpec evolution library'
  ),
  docsEntry(
    '/docs/libraries/graphql',
    'web-landing.docs.libraries.graphql',
    'LibrariesGraphQLPage',
    'ContractSpec GraphQL library'
  ),
  docsEntry(
    '/docs/libraries/growth',
    'web-landing.docs.libraries.growth',
    'LibrariesGrowthPage',
    'ContractSpec growth library'
  ),
  docsEntry(
    '/docs/libraries/multi-tenancy',
    'web-landing.docs.libraries.multi-tenancy',
    'LibrariesMultiTenancyPage',
    'ContractSpec multi-tenancy library'
  ),
  docsEntry(
    '/docs/libraries/observability',
    'web-landing.docs.libraries.observability',
    'LibrariesObservabilityPage',
    'ContractSpec observability library'
  ),
  docsEntry(
    '/docs/libraries/overlay-engine',
    'web-landing.docs.libraries.overlay-engine',
    'LibrariesOverlayEnginePage',
    'ContractSpec overlay engine library'
  ),
  docsEntry(
    '/docs/libraries/personalization',
    'web-landing.docs.libraries.personalization',
    'LibrariesPersonalizationPage',
    'ContractSpec personalization library'
  ),
  docsEntry(
    '/docs/libraries/progressive-delivery',
    'web-landing.docs.libraries.progressive-delivery',
    'LibrariesProgressiveDeliveryPage',
    'ContractSpec progressive delivery library'
  ),
  docsEntry(
    '/docs/libraries/resilience',
    'web-landing.docs.libraries.resilience',
    'LibrariesResiliencePage',
    'ContractSpec resilience library'
  ),
  docsEntry(
    '/docs/libraries/runtime',
    'web-landing.docs.libraries.runtime',
    'LibrariesRuntimePage',
    'ContractSpec runtime library'
  ),
  docsEntry(
    '/docs/libraries/schema',
    'web-landing.docs.libraries.schema',
    'LibrariesSchemaPage',
    'ContractSpec schema library'
  ),
  docsEntry(
    '/docs/libraries/slo',
    'web-landing.docs.libraries.slo',
    'LibrariesSLOPage',
    'ContractSpec SLO library'
  ),
  docsEntry(
    '/docs/libraries/support-bot',
    'web-landing.docs.libraries.support-bot',
    'LibrariesSupportBotPage',
    'ContractSpec support bot library'
  ),
  docsEntry(
    '/docs/libraries/testing',
    'web-landing.docs.libraries.testing',
    'LibrariesTestingPage',
    'ContractSpec testing library'
  ),
  docsEntry(
    '/docs/libraries/ui-kit',
    'web-landing.docs.libraries.ui-kit',
    'LibrariesUIKitPage',
    'ContractSpec UI kit library'
  ),
  docsEntry(
    '/docs/libraries/workflows',
    'web-landing.docs.libraries.workflows',
    'LibrariesWorkflowsPage',
    'ContractSpec workflows library'
  ),
  docsEntry(
    '/docs/libraries/workflow-composer',
    'web-landing.docs.libraries.workflow-composer',
    'LibrariesWorkflowComposerPage',
    'ContractSpec workflow composer library'
  ),

  // Architecture
  docsEntry(
    '/docs/architecture',
    'web-landing.docs.architecture.overview',
    'ArchitectureOverviewPage',
    'ContractSpec architecture overview'
  ),
  docsEntry(
    '/docs/architecture/app-config',
    'web-landing.docs.architecture.app-config',
    'ArchitectureAppConfigPage',
    'ContractSpec app configuration'
  ),
  docsEntry(
    '/docs/architecture/multi-tenancy',
    'web-landing.docs.architecture.multi-tenancy',
    'ArchitectureMultiTenancyPage',
    'ContractSpec multi-tenancy architecture'
  ),
  docsEntry(
    '/docs/architecture/integration-binding',
    'web-landing.docs.architecture.integration-binding',
    'ArchitectureIntegrationBindingPage',
    'ContractSpec integration binding'
  ),
  docsEntry(
    '/docs/architecture/knowledge-binding',
    'web-landing.docs.architecture.knowledge-binding',
    'ArchitectureKnowledgeBindingPage',
    'ContractSpec knowledge binding'
  ),

  // Advanced
  docsEntry(
    '/docs/advanced/renderers',
    'web-landing.docs.advanced.renderers',
    'AdvancedRenderersPage',
    'ContractSpec renderers documentation'
  ),
  docsEntry(
    '/docs/advanced/mcp',
    'web-landing.docs.advanced.mcp',
    'AdvancedMCPPage',
    'ContractSpec MCP documentation'
  ),
  docsEntry(
    '/docs/advanced/telemetry',
    'web-landing.docs.advanced.telemetry',
    'AdvancedTelemetryPage',
    'ContractSpec telemetry documentation'
  ),
  docsEntry(
    '/docs/advanced/workflow-monitoring',
    'web-landing.docs.advanced.workflow-monitoring',
    'AdvancedWorkflowMonitoringPage',
    'ContractSpec workflow monitoring'
  ),
  docsEntry(
    '/docs/advanced/overlay-editor',
    'web-landing.docs.advanced.overlay-editor',
    'AdvancedOverlayEditorPage',
    'ContractSpec overlay editor'
  ),
  docsEntry(
    '/docs/advanced/spec-experiments',
    'web-landing.docs.advanced.spec-experiments',
    'AdvancedSpecExperimentsPage',
    'ContractSpec spec experiments'
  ),

  // Safety
  docsEntry(
    '/docs/safety',
    'web-landing.docs.safety.overview',
    'SafetyOverviewPage',
    'ContractSpec safety overview'
  ),
  docsEntry(
    '/docs/safety/signing',
    'web-landing.docs.safety.signing',
    'SafetySigningPage',
    'ContractSpec signing and attestation'
  ),
  docsEntry(
    '/docs/safety/auditing',
    'web-landing.docs.safety.auditing',
    'SafetyAuditingPage',
    'ContractSpec auditing documentation'
  ),
  docsEntry(
    '/docs/safety/migrations',
    'web-landing.docs.safety.migrations',
    'SafetyMigrationsPage',
    'ContractSpec migrations documentation'
  ),
  docsEntry(
    '/docs/safety/pdp',
    'web-landing.docs.safety.pdp',
    'SafetyPDPPage',
    'ContractSpec Policy Decision Point'
  ),
  docsEntry(
    '/docs/safety/tenant-isolation',
    'web-landing.docs.safety.tenant-isolation',
    'SafetyTenantIsolationPage',
    'ContractSpec tenant isolation'
  ),

  // Integrations
  docsEntry(
    '/docs/integrations',
    'web-landing.docs.integrations.overview',
    'IntegrationsOverviewPage',
    'ContractSpec integrations overview'
  ),
  docsEntry(
    '/docs/integrations/circuit-breakers',
    'web-landing.docs.integrations.circuit-breakers',
    'IntegrationsCircuitBreakersPage',
    'ContractSpec circuit breakers'
  ),
  docsEntry(
    '/docs/integrations/elevenlabs',
    'web-landing.docs.integrations.elevenlabs',
    'IntegrationsElevenLabsPage',
    'ContractSpec ElevenLabs integration'
  ),
  docsEntry(
    '/docs/integrations/gmail',
    'web-landing.docs.integrations.gmail',
    'IntegrationsGmailPage',
    'ContractSpec Gmail integration'
  ),
  docsEntry(
    '/docs/integrations/google-calendar',
    'web-landing.docs.integrations.google-calendar',
    'IntegrationsGoogleCalendarPage',
    'ContractSpec Google Calendar'
  ),
  docsEntry(
    '/docs/integrations/openai',
    'web-landing.docs.integrations.openai',
    'IntegrationsOpenAIPage',
    'ContractSpec OpenAI integration'
  ),
  docsEntry(
    '/docs/integrations/postmark',
    'web-landing.docs.integrations.postmark',
    'IntegrationsPostmarkPage',
    'ContractSpec Postmark integration'
  ),
  docsEntry(
    '/docs/integrations/powens',
    'web-landing.docs.integrations.powens',
    'IntegrationsPowensPage',
    'ContractSpec Powens integration'
  ),
  docsEntry(
    '/docs/integrations/qdrant',
    'web-landing.docs.integrations.qdrant',
    'IntegrationsQdrantPage',
    'ContractSpec Qdrant integration'
  ),
  docsEntry(
    '/docs/integrations/resend',
    'web-landing.docs.integrations.resend',
    'IntegrationsResendPage',
    'ContractSpec Resend integration'
  ),
  docsEntry(
    '/docs/integrations/s3',
    'web-landing.docs.integrations.s3',
    'IntegrationsS3Page',
    'ContractSpec S3 integration'
  ),
  docsEntry(
    '/docs/integrations/spec-model',
    'web-landing.docs.integrations.spec-model',
    'IntegrationsSpecModelPage',
    'ContractSpec spec model integration'
  ),
  docsEntry(
    '/docs/integrations/stripe',
    'web-landing.docs.integrations.stripe',
    'IntegrationsStripePage',
    'ContractSpec Stripe integration'
  ),
  docsEntry(
    '/docs/integrations/twilio',
    'web-landing.docs.integrations.twilio',
    'IntegrationsTwilioPage',
    'ContractSpec Twilio integration'
  ),

  // Knowledge
  docsEntry(
    '/docs/knowledge',
    'web-landing.docs.knowledge.overview',
    'KnowledgeOverviewPage',
    'ContractSpec knowledge overview'
  ),
  docsEntry(
    '/docs/knowledge/categories',
    'web-landing.docs.knowledge.categories',
    'KnowledgeCategoriesPage',
    'ContractSpec knowledge categories'
  ),
  docsEntry(
    '/docs/knowledge/examples',
    'web-landing.docs.knowledge.examples',
    'KnowledgeExamplesPage',
    'ContractSpec knowledge examples'
  ),
  docsEntry(
    '/docs/knowledge/sources',
    'web-landing.docs.knowledge.sources',
    'KnowledgeSourcesPage',
    'ContractSpec knowledge sources'
  ),
  docsEntry(
    '/docs/knowledge/spaces',
    'web-landing.docs.knowledge.spaces',
    'KnowledgeSpacesPage',
    'ContractSpec knowledge spaces'
  ),

  // Comparison
  docsEntry(
    '/docs/comparison',
    'web-landing.docs.comparison.overview',
    'ComparisonOverviewPage',
    'ContractSpec comparison overview'
  ),
  docsEntry(
    '/docs/comparison/automation-platforms',
    'web-landing.docs.comparison.automation-platforms',
    'ComparisonAutomationPlatformsPage',
    'Comparison with automation platforms'
  ),
  docsEntry(
    '/docs/comparison/enterprise-platforms',
    'web-landing.docs.comparison.enterprise-platforms',
    'ComparisonEnterprisePlatformsPage',
    'Comparison with enterprise platforms'
  ),
  docsEntry(
    '/docs/comparison/internal-tool-builders',
    'web-landing.docs.comparison.internal-tool-builders',
    'ComparisonInternalToolBuildersPage',
    'Comparison with internal tool builders'
  ),
  docsEntry(
    '/docs/comparison/workflow-engines',
    'web-landing.docs.comparison.workflow-engines',
    'ComparisonWorkflowEnginesPage',
    'Comparison with workflow engines'
  ),
  docsEntry(
    '/docs/comparison/windmill',
    'web-landing.docs.comparison.windmill',
    'ComparisonWindmillPage',
    'Comparison with Windmill'
  ),

  // Ops
  docsEntry(
    '/docs/ops/auto-evolution',
    'web-landing.docs.ops.auto-evolution',
    'OpsAutoEvolutionPage',
    'ContractSpec auto-evolution operations'
  ),
  docsEntry(
    '/docs/ops/distributed-tracing',
    'web-landing.docs.ops.distributed-tracing',
    'OpsDistributedTracingPage',
    'ContractSpec distributed tracing'
  ),

  // Manifesto
  docsEntry(
    '/docs/manifesto',
    'web-landing.docs.manifesto',
    'ManifestoPage',
    'ContractSpec manifesto'
  ),

  // Studio docs
  docsEntry(
    '/docs/studio',
    'web-landing.docs.studio.overview',
    'StudioOverviewPage',
    'ContractSpec Studio overview'
  ),
];
