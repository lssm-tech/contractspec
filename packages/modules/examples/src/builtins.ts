import type { ExampleSpec } from '@contractspec/lib.contracts';

// Import manifests ONLY via the side-effect-free `/example` entrypoints.
import AgentConsole from '@contractspec/example.agent-console/example';
import AiSupportBot from '@contractspec/example.ai-support-bot/example';
import AnalyticsDashboard from '@contractspec/example.analytics-dashboard/example';
import ContentGeneration from '@contractspec/example.content-generation/example';
import CrmPipeline from '@contractspec/example.crm-pipeline/example';
import IntegrationHub from '@contractspec/example.integration-hub/example';
import IntegrationStripe from '@contractspec/example.integration-stripe/example';
import VoiceProviders from '@contractspec/example.voice-providers/example';
import KbUpdatePipeline from '@contractspec/example.kb-update-pipeline/example';
import KnowledgeCanon from '@contractspec/example.knowledge-canon/example';
import LearningPatterns from '@contractspec/example.learning-patterns/example';
import LearningJourneyAmbientCoach from '@contractspec/example.learning-journey-ambient-coach/example';
import LearningJourneyCrmOnboarding from '@contractspec/example.learning-journey-crm-onboarding/example';
import LearningJourneyDuoDrills from '@contractspec/example.learning-journey-duo-drills/example';
import LearningJourneyPlatformTour from '@contractspec/example.learning-journey-platform-tour/example';
import LearningJourneyQuestChallenges from '@contractspec/example.learning-journey-quest-challenges/example';
import LearningJourneyRegistry from '@contractspec/example.learning-journey-registry/example';
import LearningJourneyStudioOnboarding from '@contractspec/example.learning-journey-studio-onboarding/example';
import LearningJourneyUiCoaching from '@contractspec/example.learning-journey-ui-coaching/example';
import LearningJourneyUiGamified from '@contractspec/example.learning-journey-ui-gamified/example';
import LearningJourneyUiOnboarding from '@contractspec/example.learning-journey-ui-onboarding/example';
import LearningJourneyUiShared from '@contractspec/example.learning-journey-ui-shared/example';
import LifecycleCli from '@contractspec/example.lifecycle-cli/example';
import LifecycleDashboard from '@contractspec/example.lifecycle-dashboard/example';
import LocaleJurisdictionGate from '@contractspec/example.locale-jurisdiction-gate/example';
import Marketplace from '@contractspec/example.marketplace/example';
import OpenbankingPowens from '@contractspec/example.openbanking-powens/example';
import Personalization from '@contractspec/example.personalization/example';
import PolicySafeKnowledgeAssistant from '@contractspec/example.policy-safe-knowledge-assistant/example';
import SaasBoilerplate from '@contractspec/example.saas-boilerplate/example';
import ServiceBusinessOs from '@contractspec/example.service-business-os/example';
import TeamHub from '@contractspec/example.team-hub/example';
import VersionedKnowledgeBase from '@contractspec/example.versioned-knowledge-base/example';
import WealthSnapshot from '@contractspec/example.wealth-snapshot/example';
import WorkflowSystem from '@contractspec/example.workflow-system/example';

export const EXAMPLE_REGISTRY: readonly ExampleSpec[] = [
  AgentConsole,
  AiSupportBot,
  AnalyticsDashboard,
  ContentGeneration,
  CrmPipeline,
  IntegrationHub,
  IntegrationStripe,
  VoiceProviders,
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
