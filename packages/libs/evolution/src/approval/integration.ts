import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ApprovalWorkflow } from '@lssm/lib.ai-agent/approval';
import type { AgentSessionState } from '@lssm/lib.ai-agent/types';
import {
  type SpecSuggestion,
  type SpecSuggestionFilters,
  type SpecSuggestionRepository,
  type SpecSuggestionWriter,
  type SuggestionStatus,
} from '../types';

export interface SpecSuggestionOrchestratorOptions {
  repository: SpecSuggestionRepository;
  approval?: ApprovalWorkflow;
  writer?: SpecSuggestionWriter;
}

export class SpecSuggestionOrchestrator {
  constructor(private readonly options: SpecSuggestionOrchestratorOptions) {}

  async submit(
    suggestion: SpecSuggestion,
    session?: AgentSessionState,
    approvalReason?: string
  ) {
    await this.options.repository.create(suggestion);
    if (session && this.options.approval) {
      // AI SDK v6: requestApproval takes a single params object
      await this.options.approval.requestApproval({
        sessionId: session.sessionId,
        agentId: session.agentId,
        tenantId: session.tenantId,
        toolName: 'evolution.apply_suggestion',
        toolCallId: suggestion.id,
        toolArgs: { suggestionId: suggestion.id },
        reason: approvalReason ?? suggestion.proposal.summary,
        payload: { suggestionId: suggestion.id },
      });
    }
    return suggestion;
  }

  async approve(id: string, reviewer: string, notes?: string) {
    const suggestion = await this.ensureSuggestion(id);
    await this.options.repository.updateStatus(id, 'approved', {
      reviewer,
      notes,
      decidedAt: new Date(),
    });
    if (this.options.writer) {
      await this.options.writer.write({
        ...suggestion,
        status: 'approved',
        approvals: {
          reviewer,
          notes,
          decidedAt: new Date(),
          status: 'approved',
        },
      });
    }
  }

  async reject(id: string, reviewer: string, notes?: string) {
    await this.options.repository.updateStatus(id, 'rejected', {
      reviewer,
      notes,
      decidedAt: new Date(),
    });
  }

  list(filters?: SpecSuggestionFilters) {
    return this.options.repository.list(filters);
  }

  private async ensureSuggestion(id: string) {
    const suggestion = await this.options.repository.getById(id);
    if (!suggestion) throw new Error(`Spec suggestion ${id} not found`);
    return suggestion;
  }
}

export interface FileSystemSuggestionWriterOptions {
  outputDir?: string;
  filenameTemplate?: (suggestion: SpecSuggestion) => string;
}

export class FileSystemSuggestionWriter implements SpecSuggestionWriter {
  private readonly outputDir: string;
  private readonly filenameTemplate: NonNullable<
    FileSystemSuggestionWriterOptions['filenameTemplate']
  >;

  constructor(options: FileSystemSuggestionWriterOptions = {}) {
    this.outputDir =
      options.outputDir ??
      join(
        process.cwd(),
        'packages/contractspec/packages/libs/contracts/src/generated'
      );
    this.filenameTemplate =
      options.filenameTemplate ??
      ((suggestion) =>
        `${suggestion.target?.name ?? suggestion.intent.id}.v${suggestion.target?.version ?? 'next'}.suggestion.json`);
  }

  async write(suggestion: SpecSuggestion): Promise<string> {
    await mkdir(this.outputDir, { recursive: true });
    const filename = this.filenameTemplate(suggestion);
    const filepath = join(this.outputDir, filename);
    const payload = serializeSuggestion(suggestion);
    await writeFile(filepath, JSON.stringify(payload, null, 2));
    return filepath;
  }
}

export class InMemorySpecSuggestionRepository
  implements SpecSuggestionRepository
{
  private readonly items = new Map<string, SpecSuggestion>();

  async create(suggestion: SpecSuggestion): Promise<void> {
    this.items.set(suggestion.id, suggestion);
  }

  async getById(id: string): Promise<SpecSuggestion | undefined> {
    return this.items.get(id);
  }

  async updateStatus(
    id: string,
    status: SuggestionStatus,
    metadata?: { reviewer?: string; notes?: string; decidedAt?: Date }
  ): Promise<void> {
    const suggestion = await this.getById(id);
    if (!suggestion) return;
    this.items.set(id, {
      ...suggestion,
      status,
      approvals: {
        reviewer: metadata?.reviewer,
        notes: metadata?.notes,
        decidedAt: metadata?.decidedAt,
        status,
      },
    });
  }

  async list(filters?: SpecSuggestionFilters) {
    const values = [...this.items.values()];
    if (!filters) return values;
    return values.filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.operationName && item.target?.name !== filters.operationName)
        return false;
      return true;
    });
  }
}

function serializeSuggestion(suggestion: SpecSuggestion) {
  const { proposal, ...rest } = suggestion;
  const { spec, ...proposalRest } = proposal;
  return {
    ...rest,
    proposal: {
      ...proposalRest,
      specMeta: spec?.meta,
    },
    createdAt: suggestion.createdAt.toISOString(),
    intent: {
      ...suggestion.intent,
      confidence: { ...suggestion.intent.confidence },
      evidence: suggestion.intent.evidence,
    },
  };
}

function deserializeSuggestion(payload: unknown): SpecSuggestion | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const raw = payload as Record<string, any>;
  return {
    ...raw,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    intent: {
      ...raw.intent,
      confidence: raw.intent?.confidence,
      evidence: raw.intent?.evidence ?? [],
    },
    proposal: {
      ...raw.proposal,
      metadata: {
        ...(raw.proposal?.metadata ?? {}),
        specMeta: raw.proposal?.specMeta,
      },
    },
  } as SpecSuggestion;
}
