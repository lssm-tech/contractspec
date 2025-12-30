export interface ChatOptions {
  provider?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  organizationId?: string;
  userId?: string;
  projectId?: string;
}

export interface StreamPart {
  type: 'text' | 'done' | 'error';
  content?: string;
  usage?: { inputTokens: number; outputTokens: number };
  error?: { code: string; message: string };
}

import type { KnowledgeRetriever } from '@contractspec/lib.knowledge/retriever';

export interface SpecReader {
  listSpecs(projectId: string): Promise<string[]>;
  readSpec(projectId: string, specName: string): Promise<string | null>;
}

export interface AgentDependencies {
  retriever?: KnowledgeRetriever;
  specReader?: SpecReader;
}
