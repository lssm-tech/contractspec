import { createAgentJsonRunner } from '@contractspec/lib.ai-agent';
import {
  buildProjectManagementSyncPayload,
  extractEvidence,
  generateTickets,
  groupProblems,
  impactEngine,
  suggestPatch,
  type TicketPipelineLogger,
} from '@contractspec/lib.product-intent-utils';
import type { TicketPipelineModelRunner } from '@contractspec/lib.product-intent-utils';
import { loadEvidenceChunksWithSignals } from './load-evidence';
import { resolvePosthogEvidenceOptionsFromEnv } from './posthog-signals';
import { LinearProjectManagementProvider } from '@contractspec/integration.providers-impls/impls/linear';
import { JiraProjectManagementProvider } from '@contractspec/integration.providers-impls/impls/jira';
import { NotionProjectManagementProvider } from '@contractspec/integration.providers-impls/impls/notion';
import type { ProjectManagementProvider } from '@contractspec/lib.contracts/integrations/providers/project-management';

const QUESTION =
  'Which activation and onboarding friction should we prioritize next?';

type ProviderName = 'linear' | 'jira' | 'notion';
type AiProviderName = 'openai' | 'anthropic' | 'mistral' | 'gemini' | 'ollama';

function resolveProvider(): ProviderName {
  const raw = (process.env.CONTRACTSPEC_PM_PROVIDER ?? '').toLowerCase();
  if (raw === 'linear' || raw === 'jira' || raw === 'notion') return raw;
  throw new Error(
    'Set CONTRACTSPEC_PM_PROVIDER to one of: linear, jira, notion'
  );
}

async function resolveModelRunner(): Promise<TicketPipelineModelRunner> {
  const provider = resolveAiProviderName();
  const apiKey = resolveApiKey(provider);
  const proxyUrl = process.env.CONTRACTSPEC_AI_PROXY_URL;
  const organizationId = process.env.CONTRACTSPEC_ORG_ID;
  const baseUrl = process.env.OLLAMA_BASE_URL;
  const model =
    process.env.CONTRACTSPEC_AI_MODEL ?? process.env.AI_MODEL ?? undefined;

  if (provider !== 'ollama' && !apiKey && !proxyUrl && !organizationId) {
    throw new Error(
      `Missing API credentials for ${provider}. Set provider API key or CONTRACTSPEC_AI_PROXY_URL.`
    );
  }

  return createAgentJsonRunner({
    provider: {
      provider,
      model,
      apiKey,
      baseUrl,
      proxyUrl,
      organizationId,
    },
    temperature: 0,
    system:
      'You are a product discovery analyst. Respond with strict JSON only and use exact quotes for citations.',
  });
}

function resolveAiProviderName(): AiProviderName {
  const raw =
    process.env.CONTRACTSPEC_AI_PROVIDER ?? process.env.AI_PROVIDER ?? 'openai';
  const normalized = raw.toLowerCase();
  const allowed: AiProviderName[] = [
    'openai',
    'anthropic',
    'mistral',
    'gemini',
    'ollama',
  ];
  if (!allowed.includes(normalized as AiProviderName)) {
    throw new Error(
      `Unsupported AI provider: ${raw}. Use one of: ${allowed.join(', ')}`
    );
  }
  return normalized as AiProviderName;
}

function resolveApiKey(provider: AiProviderName): string | undefined {
  switch (provider.toLowerCase()) {
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY;
    case 'mistral':
      return process.env.MISTRAL_API_KEY;
    case 'gemini':
      return process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
    case 'ollama':
      return undefined;
    default:
      return undefined;
  }
}

function createLogger(): TicketPipelineLogger {
  return {
    log: () => undefined,
  };
}

async function run() {
  const provider = resolveProvider();
  const modelRunner = await resolveModelRunner();

  const evidenceChunks = await loadEvidenceChunksWithSignals({
    posthog: resolvePosthogEvidenceOptionsFromEnv() ?? undefined,
  });
  const findings = await extractEvidence(evidenceChunks, QUESTION, {
    modelRunner,
    logger: createLogger(),
    maxAttempts: 2,
  });
  const problems = await groupProblems(findings, QUESTION, {
    modelRunner,
    logger: createLogger(),
    maxAttempts: 2,
  });
  const tickets = await generateTickets(problems, findings, QUESTION, {
    modelRunner,
    logger: createLogger(),
    maxAttempts: 2,
  });
  const patchIntent = tickets[0]
    ? await suggestPatch(tickets[0], {
        modelRunner,
        logger: createLogger(),
        maxAttempts: 2,
      })
    : undefined;
  const impact = patchIntent ? impactEngine(patchIntent) : undefined;

  const payload = buildProjectManagementSyncPayload({
    question: QUESTION,
    tickets,
    patchIntent,
    impact,
    options: {
      includeSummary: true,
      baseTags: ['product-intent'],
      defaultPriority: 'medium',
    },
  });

  if (process.env.CONTRACTSPEC_PM_DRY_RUN === 'true') {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const created = await syncToProvider(provider, payload);
  console.log(JSON.stringify(created, null, 2));
}

async function syncToProvider(
  provider: ProviderName,
  payload: ReturnType<typeof buildProjectManagementSyncPayload>
) {
  if (provider === 'linear') {
    const client = new LinearProjectManagementProvider({
      apiKey: requireEnv('LINEAR_API_KEY'),
      teamId: requireEnv('LINEAR_TEAM_ID'),
      projectId: process.env.LINEAR_PROJECT_ID,
      stateId: process.env.LINEAR_STATE_ID,
      assigneeId: process.env.LINEAR_ASSIGNEE_ID,
      labelIds: splitList(process.env.LINEAR_LABEL_IDS),
    });
    return executeSync(client, payload);
  }

  if (provider === 'jira') {
    const client = new JiraProjectManagementProvider({
      siteUrl: requireEnv('JIRA_SITE_URL'),
      email: requireEnv('JIRA_EMAIL'),
      apiToken: requireEnv('JIRA_API_TOKEN'),
      projectKey: process.env.JIRA_PROJECT_KEY,
      issueType: process.env.JIRA_ISSUE_TYPE,
      defaultLabels: splitList(process.env.JIRA_DEFAULT_LABELS),
    });
    return executeSync(client, payload);
  }

  const client = new NotionProjectManagementProvider({
    apiKey: requireEnv('NOTION_API_KEY'),
    databaseId: process.env.NOTION_DATABASE_ID,
    summaryParentPageId: process.env.NOTION_SUMMARY_PARENT_PAGE_ID,
    titleProperty: process.env.NOTION_TITLE_PROPERTY,
    statusProperty: process.env.NOTION_STATUS_PROPERTY,
    priorityProperty: process.env.NOTION_PRIORITY_PROPERTY,
    tagsProperty: process.env.NOTION_TAGS_PROPERTY,
    dueDateProperty: process.env.NOTION_DUE_DATE_PROPERTY,
    descriptionProperty: process.env.NOTION_DESCRIPTION_PROPERTY,
  });
  return executeSync(client, payload);
}

async function executeSync(
  client: ProjectManagementProvider,
  payload: ReturnType<typeof buildProjectManagementSyncPayload>
) {
  const summary = payload.summary
    ? await client.createWorkItem(payload.summary)
    : undefined;
  const items = await client.createWorkItems(payload.items);
  return { summary, items };
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function splitList(value?: string): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
