import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAgentJsonRunner } from '@contractspec/lib.ai-agent';
import {
  extractEvidence,
  generateTickets,
  groupProblems,
  impactEngine,
  type RepoScanFile,
  suggestPatch,
} from '@contractspec/lib.product-intent-utils';
import { loadEvidenceChunks } from './load-evidence';

const QUESTION =
  'Which activation and onboarding friction should we prioritize next?';
const DEFAULT_PROVIDER = 'openai';
const DEFAULT_MODEL = 'gpt-5.2';
const DEFAULT_TEMPERATURE = 0;
const DEFAULT_MAX_ATTEMPTS = 2;

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(MODULE_DIR, '../../../..');
const REPO_SCAN_FILES = [
  'packages/examples/product-intent/src/load-evidence.ts',
  'packages/examples/product-intent/src/script.ts',
  'packages/libs/contracts/src/product-intent/contract-patch-intent.ts',
  'packages/libs/contracts/src/product-intent/spec.ts',
  'packages/libs/product-intent-utils/src/impact-engine.ts',
];

function collectRepoFiles(root: string, files: string[]): RepoScanFile[] {
  const collected: RepoScanFile[] = [];
  for (const relativePath of files) {
    const fullPath = path.join(root, relativePath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    collected.push({ path: relativePath, content });
  }
  return collected;
}

interface TicketPipelineLogger {
  log: (entry: {
    stage: string;
    phase: string;
    attempt: number;
    prompt: string;
    response?: string;
    error?: string;
    timestamp: string;
  }) => void | Promise<void>;
}

type ProviderName = 'openai' | 'anthropic' | 'mistral' | 'gemini' | 'ollama';

function resolveProviderName(): ProviderName {
  const raw =
    process.env.CONTRACTSPEC_AI_PROVIDER ??
    process.env.AI_PROVIDER ??
    DEFAULT_PROVIDER;
  const normalized = raw.toLowerCase();
  const allowed: ProviderName[] = [
    'openai',
    'anthropic',
    'mistral',
    'gemini',
    'ollama',
  ];
  if (!allowed.includes(normalized as ProviderName)) {
    throw new Error(
      `Unsupported AI provider '${raw}'. Allowed: ${allowed.join(', ')}`
    );
  }
  return normalized as ProviderName;
}

function resolveApiKey(provider: ProviderName): string | undefined {
  switch (provider) {
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
  }
}

function resolveTemperature(): number {
  const raw =
    process.env.CONTRACTSPEC_AI_TEMPERATURE ?? process.env.AI_TEMPERATURE;
  if (!raw) return DEFAULT_TEMPERATURE;
  const value = Number.parseFloat(raw);
  return Number.isNaN(value) ? DEFAULT_TEMPERATURE : value;
}

function resolveMaxAttempts(): number {
  const raw =
    process.env.CONTRACTSPEC_AI_MAX_ATTEMPTS ?? process.env.AI_MAX_ATTEMPTS;
  if (!raw) return DEFAULT_MAX_ATTEMPTS;
  const value = Number.parseInt(raw, 10);
  return Number.isNaN(value) ? DEFAULT_MAX_ATTEMPTS : Math.max(1, value);
}

function writeArtifact(dir: string, name: string, contents: string): string {
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, contents, 'utf8');
  return filePath;
}

function createPipelineLogger(
  logDir: string,
  runId: string
): TicketPipelineLogger {
  const tracePath = path.join(logDir, 'trace.jsonl');

  return {
    log(entry) {
      const baseName = `${entry.stage}-attempt-${entry.attempt}-${entry.phase}`;
      const payload: Record<string, unknown> = {
        runId,
        stage: entry.stage,
        phase: entry.phase,
        attempt: entry.attempt,
        timestamp: entry.timestamp,
      };

      if (entry.prompt) {
        payload.promptPath = path.relative(
          REPO_ROOT,
          writeArtifact(logDir, `${baseName}.prompt.txt`, entry.prompt)
        );
      }

      if (entry.response) {
        payload.responsePath = path.relative(
          REPO_ROOT,
          writeArtifact(logDir, `${baseName}.response.txt`, entry.response)
        );
      }

      if (entry.error) {
        payload.errorPath = path.relative(
          REPO_ROOT,
          writeArtifact(logDir, `${baseName}.error.txt`, entry.error)
        );
      }

      fs.appendFileSync(tracePath, `${JSON.stringify(payload)}\n`, 'utf8');
    },
  };
}

async function main() {
  const provider = resolveProviderName();
  const temperature = resolveTemperature();
  const maxAttempts = resolveMaxAttempts();
  const apiKey = resolveApiKey(provider);
  const proxyUrl = process.env.CONTRACTSPEC_AI_PROXY_URL;
  const organizationId = process.env.CONTRACTSPEC_ORG_ID;
  const baseUrl = process.env.OLLAMA_BASE_URL;
  const model =
    process.env.CONTRACTSPEC_AI_MODEL ??
    process.env.AI_MODEL ??
    (provider === 'mistral' ? DEFAULT_MODEL : undefined);

  if (provider !== 'ollama' && !apiKey && !proxyUrl && !organizationId) {
    throw new Error(
      `Missing API credentials for ${provider}. Set the provider API key or CONTRACTSPEC_AI_PROXY_URL.`
    );
  }

  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const logDir = path.join(MODULE_DIR, '../logs', `run-${runId}`);
  fs.mkdirSync(logDir, { recursive: true });
  const logger = createPipelineLogger(logDir, runId);

  const modelRunner = await createAgentJsonRunner({
    provider: {
      provider,
      model,
      apiKey,
      baseUrl,
      proxyUrl,
      organizationId,
    },
    temperature,
    system:
      'You are a product discovery analyst. Respond with strict JSON only and use exact quotes for citations.',
  });

  console.log(`AI provider: ${provider}`);
  console.log(`Model: ${model ?? '(provider default)'}`);
  console.log(`Temperature: ${temperature}`);
  console.log(`Max attempts: ${maxAttempts}`);
  console.log(`Trace log: ${path.relative(REPO_ROOT, logDir)}/trace.jsonl`);

  const evidenceChunks = loadEvidenceChunks();
  console.log(`Loaded ${evidenceChunks.length} evidence chunks`);

  const findings = await extractEvidence(evidenceChunks, QUESTION, {
    maxFindings: 12,
    modelRunner,
    logger,
    maxAttempts,
  });
  console.log('\nEvidence findings:\n');
  console.log(JSON.stringify(findings, null, 2));

  const problems = await groupProblems(findings, QUESTION, {
    modelRunner,
    logger,
    maxAttempts,
  });
  console.log('\nProblems:\n');
  console.log(JSON.stringify(problems, null, 2));

  const tickets = await generateTickets(problems, findings, QUESTION, {
    modelRunner,
    logger,
    maxAttempts,
  });
  console.log('\nTickets:\n');
  console.log(JSON.stringify(tickets, null, 2));

  if (!tickets[0]) {
    console.log('\nNo tickets generated.');
    return;
  }

  const patchIntent = await suggestPatch(tickets[0], {
    modelRunner,
    logger,
    maxAttempts,
  });
  console.log('\nPatch intent:\n');
  console.log(JSON.stringify(patchIntent, null, 2));

  const repoFiles = collectRepoFiles(REPO_ROOT, REPO_SCAN_FILES);
  const impact = impactEngine(patchIntent, {
    repoFiles,
    maxHitsPerChange: 3,
  });
  console.log('\nImpact report (deterministic):\n');
  console.log(JSON.stringify(impact, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
