export * from './lifecycle/atoms/LifecycleStageCard';
export * from './lifecycle/molecules/RecommendationsList';
export * from './lifecycle/organisms/LifecycleJourney';
export * from './lifecycle/organisms/MilestoneTracker';
export * from './lifecycle/organisms/StageTransitionCeremony';
export * from './studio';
// Integration and library components are now in bundle.library
// export {
//     AgentDashboard, AnalyticsDashboard, BuilderPanel, ContractSpecRegistryClient, ConversationList, CrmDashboard, EvolutionDashboard,
//     EvolutionSidebar, FloatingAssistant, IntegrationDashboard, LearningCoach, LocalDataIndicator, MarkdownView, MarketplaceDashboard, MessageComposer,
//     MessageThread,
//     MessagingWorkspace, OverlayContextProvider, PersonalizationInsights, PolicySafeKnowledgeAssistantDashboard, RecipeList,
//     SaasDashboard, SaveToStudioButton, SpecEditorPanel, TEMPLATE_REGISTRY, TaskForm, TaskList, TemplateInstaller, TemplateRuntimeProvider, TemplateShell, WorkflowDashboard,
//     // Shell, assistant, and learning components now live in library (re-exported for backward compat)
//     WorkspaceProjectShellLayout, clearLearningEvents, createTemplateTransformEngine, getClonableTemplates, getCompletedSteps, getLearningEvents, getNextRecommendedStep, getTemplate, getTemplateEngine, getTemplatesByModule, hasSeenEvent, listTemplates, markEventAsSeen, recordLearningEvent, registerTemplateComponents, resetTemplateEngine, templateComponentRegistry, useOverlayContext, useTemplateEngine, useTemplateRuntime, type FloatingAssistantProps, type LearningCoachProps, type LearningEventData, type LearningEventType, type WorkspaceProjectShellLayoutProps
// } from '@contractspec/bundle.library';

export * from './assistant';
export * from './studio';
export * from './lifecycle';
export * from './shell';
export * from './learning';
export * from './marketing';
export * from './shared/FeatureGateNotice';
export { SandboxExperienceClient } from './templates/SandboxExperienceClient';
// Shell layout still has studio-specific StudioAppShellLayout here
export * from './shell/StudioAppShellLayout';
