import type { StateStore, WorkflowState, WorkflowStateFilters } from '../state';

// Generic interface for Prisma Client to avoid hard dependency on generated client
interface WorkflowStateRecord {
  id: string;
  name: string;
  version: string;
  status: string;
  currentStep: string;
  data: unknown;
  history: unknown[];
  retryCounts: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaClientLike {
  workflowState: {
    create: (args: {
      data: Record<string, unknown>;
    }) => Promise<WorkflowStateRecord>;
    findUnique: (args: {
      where: { id: string };
    }) => Promise<WorkflowStateRecord | null>;
    update: (args: {
      where: { id: string };
      data: Record<string, unknown>;
    }) => Promise<WorkflowStateRecord>;
    findMany: (args: {
      where?: Record<string, unknown>;
    }) => Promise<WorkflowStateRecord[]>;
  };
}

export class PrismaStateStore implements StateStore {
  constructor(private readonly prisma: PrismaClientLike) {}

  async create(state: WorkflowState): Promise<void> {
    await this.prisma.workflowState.create({
      data: {
        id: state.workflowId,
        name: state.workflowName,
        version: state.workflowVersion,
        status: state.status,
        currentStep: state.currentStep,
        data: state.data, // Assumes Prisma handles JSON
        history: state.history, // Assumes Prisma handles JSON
        retryCounts: state.retryCounts ?? {},
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
      },
    });
  }

  async get(workflowId: string): Promise<WorkflowState | undefined> {
    const record = await this.prisma.workflowState.findUnique({
      where: { id: workflowId },
    });

    if (!record) return undefined;

    return {
      workflowId: record.id,
      workflowName: record.name,
      workflowVersion: parseInt(record.version, 10),
      currentStep: record.currentStep,
      data: record.data as Record<string, unknown>,
      history: record.history as WorkflowState['history'],
      retryCounts: record.retryCounts,
      status: record.status as WorkflowState['status'],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async update(
    workflowId: string,
    updater: (current: WorkflowState) => WorkflowState
  ): Promise<WorkflowState> {
    const current = await this.get(workflowId);
    if (!current) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const next = updater(current);

    const updated = await this.prisma.workflowState.update({
      where: { id: workflowId },
      data: {
        status: next.status,
        currentStep: next.currentStep,
        data: next.data,
        history: next.history,
        retryCounts: next.retryCounts,
        updatedAt: next.updatedAt,
      },
    });

    return {
      workflowId: updated.id,
      workflowName: updated.name,
      workflowVersion: parseInt(updated.version, 10),
      currentStep: updated.currentStep,
      data: updated.data as Record<string, unknown>,
      history: updated.history as WorkflowState['history'],
      retryCounts: updated.retryCounts,
      status: updated.status as WorkflowState['status'],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async list(filters?: WorkflowStateFilters): Promise<WorkflowState[]> {
    const where: Record<string, unknown> = {};
    if (filters?.status) {
      where.status = filters.status;
    }

    const records = await this.prisma.workflowState.findMany({
      where,
    });

    return records.map((record) => ({
      workflowId: record.id,
      workflowName: record.name,
      workflowVersion: parseInt(record.version, 10),
      currentStep: record.currentStep,
      data: record.data as Record<string, unknown>,
      history: record.history as WorkflowState['history'],
      retryCounts: record.retryCounts,
      status: record.status as WorkflowState['status'],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
  }
}
