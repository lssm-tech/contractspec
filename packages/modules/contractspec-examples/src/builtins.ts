import type { ExampleDefinition } from './types';

// Import manifests ONLY via the side-effect-free `/example` entrypoints.
import AgentConsole from '@lssm/example.agent-console/example';
import AiSupportBot from '@lssm/example.ai-support-bot/example';
import AnalyticsDashboard from '@lssm/example.analytics-dashboard/example';
import ContentGeneration from '@lssm/example.content-generation/example';
import CrmPipeline from '@lssm/example.crm-pipeline/example';
import IntegrationHub from '@lssm/example.integration-hub/example';
import IntegrationStripe from '@lssm/example.integration-stripe/example';
import KbUpdatePipeline from '@lssm/example.kb-update-pipeline/example';
import KnowledgeCanon from '@lssm/example.knowledge-canon/example';
import LearningPatterns from '@lssm/example.learning-patterns/example';
import LearningJourneyAmbientCoach from '@lssm/example.learning-journey-ambient-coach/example';
import LearningJourneyCrmOnboarding from '@lssm/example.learning-journey-crm-onboarding/example';
import LearningJourneyDuoDrills from '@lssm/example.learning-journey-duo-drills/example';
import LearningJourneyPlatformTour from '@lssm/example.learning-journey-platform-tour/example';
import LearningJourneyQuestChallenges from '@lssm/example.learning-journey-quest-challenges/example';
import LearningJourneyRegistry from '@lssm/example.learning-journey-registry/example';
import LearningJourneyStudioOnboarding from '@lssm/example.learning-journey-studio-onboarding/example';
import LearningJourneyUiCoaching from '@lssm/example.learning-journey-ui-coaching/example';
import LearningJourneyUiGamified from '@lssm/example.learning-journey-ui-gamified/example';
import LearningJourneyUiOnboarding from '@lssm/example.learning-journey-ui-onboarding/example';
import LearningJourneyUiShared from '@lssm/example.learning-journey-ui-shared/example';
import LifecycleCli from '@lssm/example.lifecycle-cli/example';
import LifecycleDashboard from '@lssm/example.lifecycle-dashboard/example';
import LocaleJurisdictionGate from '@lssm/example.locale-jurisdiction-gate/example';
import Marketplace from '@lssm/example.marketplace/example';
import OpenbankingPowens from '@lssm/example.openbanking-powens/example';
import Personalization from '@lssm/example.personalization/example';
import PolicySafeKnowledgeAssistant from '@lssm/example.policy-safe-knowledge-assistant/example';
import SaasBoilerplate from '@lssm/example.saas-boilerplate/example';
import ServiceBusinessOs from '@lssm/example.service-business-os/example';
import TeamHub from '@lssm/example.team-hub/example';
import VersionedKnowledgeBase from '@lssm/example.versioned-knowledge-base/example';
import WealthSnapshot from '@lssm/example.wealth-snapshot/example';
import WorkflowSystem from '@lssm/example.workflow-system/example';

export const EXAMPLE_REGISTRY: readonly ExampleDefinition[] = [
  AgentConsole,
  AiSupportBot,
  AnalyticsDashboard,
  ContentGeneration,
  CrmPipeline,
  IntegrationHub,
  IntegrationStripe,
  KbUpdatePipeline,
  KnowledgeCanon,
  LearningPatterns,
  LearningJourneyAmbientCoach,
  LearningJourneyCrmOnboarding,
  LearningJourneyDuoDrills,
  LearningJourneyPlatformTour,
  LearningJourneyQuestChallenges,
  LearningJourneyRegistry,
  LearningJourneyStudioOnboarding,
  LearningJourneyUiCoaching,
  LearningJourneyUiGamified,
  LearningJourneyUiOnboarding,
  LearningJourneyUiShared,
  LifecycleCli,
  LifecycleDashboard,
  LocaleJurisdictionGate,
  Marketplace,
  OpenbankingPowens,
  Personalization,
  PolicySafeKnowledgeAssistant,
  SaasBoilerplate,
  ServiceBusinessOs,
  TeamHub,
  VersionedKnowledgeBase,
  WealthSnapshot,
  WorkflowSystem,
];
