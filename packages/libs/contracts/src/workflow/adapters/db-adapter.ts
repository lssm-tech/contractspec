import type { StateStore, WorkflowState, WorkflowStateFilters } from '../state';

// Generic interface for Prisma Client to avoid hard dependency on generated client
interface PrismaClientLike {
  workflowState: {
    create: (args: { data: any }) => Promise<any>;
    findUnique: (args: { where: { id: string } }) => Promise<any>;
    update: (args: { where: { id: string }; data: any }) => Promise<any>;
    findMany: (args: { where?: any }) => Promise<any[]>;
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
      workflowVersion: record.version,
      currentStep: record.currentStep,
      data: record.data as Record<string, unknown>,
      history: record.history as any[],
      retryCounts: record.retryCounts as Record<string, number>,
      status: record.status as any,
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
      workflowVersion: updated.version,
      currentStep: updated.currentStep,
      data: updated.data as Record<string, unknown>,
      history: updated.history as any[],
      retryCounts: updated.retryCounts as Record<string, number>,
      status: updated.status as any,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async list(filters?: WorkflowStateFilters): Promise<WorkflowState[]> {
    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }

    const records = await this.prisma.workflowState.findMany({
      where,
    });

    return records.map((record) => ({
      workflowId: record.id,
      workflowName: record.name,
      workflowVersion: record.version,
      currentStep: record.currentStep,
      data: record.data as Record<string, unknown>,
      history: record.history as any[],
      retryCounts: record.retryCounts as Record<string, number>,
      status: record.status as any,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
  }
}
