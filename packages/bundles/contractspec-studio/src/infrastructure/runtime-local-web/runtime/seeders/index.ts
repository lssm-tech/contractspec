import type { LocalDatabase } from '../../database/sqlite-wasm';
import type { TemplateId } from '../../../../templates/registry';
import { seedAgentConsole } from './seed-agent-console';
import { seedAnalyticsDashboard } from './seed-analytics-dashboard';
import { seedCrmPipeline } from './seed-crm-pipeline';
import { seedIntegrationHub } from './seed-integration-hub';
import { seedMarketplace } from './seed-marketplace';
import { seedMessaging } from './seed-messaging';
import { seedPolicySafeKnowledgeAssistant } from './seed-policy-safe-knowledge-assistant';
import { seedRecipes } from './seed-recipes';
import { seedSaasBoilerplate } from './seed-saas-boilerplate';
import { seedTodos } from './seed-todos';
import { seedWorkflowSystem } from './seed-workflow-system';

export interface SeedTemplateParams {
  templateId: TemplateId;
  projectId: string;
  db: LocalDatabase;
}

type Seeder = (params: Omit<SeedTemplateParams, 'templateId'>) => Promise<void>;

const SEEDERS: Record<string, Seeder> = {
  'todos-app': seedTodos,
  'messaging-app': seedMessaging,
  'recipe-app-i18n': seedRecipes,
  'saas-boilerplate': seedSaasBoilerplate,
  'crm-pipeline': seedCrmPipeline,
  'agent-console': seedAgentConsole,
  'workflow-system': seedWorkflowSystem,
  marketplace: seedMarketplace,
  'integration-hub': seedIntegrationHub,
  'analytics-dashboard': seedAnalyticsDashboard,
  'policy-safe-knowledge-assistant': seedPolicySafeKnowledgeAssistant,
};

export async function seedTemplate(params: SeedTemplateParams): Promise<void> {
  const seeder = SEEDERS[params.templateId];
  if (!seeder) return;
  await seeder({ projectId: params.projectId, db: params.db });
}








