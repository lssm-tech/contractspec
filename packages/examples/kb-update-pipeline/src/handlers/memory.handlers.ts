interface ChangeCandidate {
  id: string;
  sourceDocumentId: string;
  detectedAt: Date;
  diffSummary: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ReviewTask {
  id: string;
  changeCandidateId: string;
  status: 'open' | 'decided';
  assignedRole: 'curator' | 'expert';
  decision?: 'approve' | 'reject';
  decidedAt?: Date;
  decidedBy?: string;
}

export interface PipelineMemoryStore {
  candidates: Map<string, ChangeCandidate>;
  reviewTasks: Map<string, ReviewTask>;
  proposedRuleVersionIdsByCandidate: Map<string, string[]>;
  approvedRuleVersionIds: Set<string>;
  notifications: {
    kind: 'kb.review.requested';
    reviewTaskId: string;
    changeCandidateId: string;
    assignedRole: 'curator' | 'expert';
    createdAt: Date;
  }[];
}

export function createPipelineMemoryStore(): PipelineMemoryStore {
  return {
    candidates: new Map(),
    reviewTasks: new Map(),
    proposedRuleVersionIdsByCandidate: new Map(),
    approvedRuleVersionIds: new Set(),
    notifications: [],
  };
}

function stableId(prefix: string, value: string): string {
  return `${prefix}_${value.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export interface PipelineMemoryHandlers {
  runWatch(input: {
    jurisdiction: string;
  }): Promise<{ candidates: ChangeCandidate[] }>;
  createReviewTask(input: { changeCandidateId: string }): Promise<ReviewTask>;
  proposeRulePatch(input: {
    changeCandidateId: string;
    proposedRuleVersionIds: string[];
  }): Promise<{ proposedRuleVersionIds: string[] }>;
  markRuleVersionApproved(input: {
    ruleVersionId: string;
  }): Promise<{ ruleVersionId: string }>;
  submitDecision(input: {
    reviewTaskId: string;
    decision: 'approve' | 'reject';
    decidedBy: string;
    decidedByRole: 'curator' | 'expert';
  }): Promise<ReviewTask>;
  publishIfReady(input: {
    jurisdiction: string;
  }): Promise<{ published: boolean; reason?: string }>;
}

export function createPipelineMemoryHandlers(
  store: PipelineMemoryStore
): PipelineMemoryHandlers {
  async function runWatch(input: { jurisdiction: string }) {
    // demo: always returns empty unless caller pre-seeds candidates
    const candidates = [...store.candidates.values()].filter(
      (c) => c.sourceDocumentId.startsWith(`${input.jurisdiction}_`) || true
    );
    return { candidates };
  }

  async function createReviewTask(input: { changeCandidateId: string }) {
    const candidate = store.candidates.get(input.changeCandidateId);
    if (!candidate) throw new Error('CHANGE_CANDIDATE_NOT_FOUND');
    const assignedRole = candidate.riskLevel === 'high' ? 'expert' : 'curator';
    const id = stableId('review', input.changeCandidateId);
    const task: ReviewTask = {
      id,
      changeCandidateId: input.changeCandidateId,
      status: 'open',
      assignedRole,
      decision: undefined,
      decidedAt: undefined,
      decidedBy: undefined,
    };
    store.reviewTasks.set(id, task);
    store.notifications.push({
      kind: 'kb.review.requested',
      reviewTaskId: id,
      changeCandidateId: input.changeCandidateId,
      assignedRole,
      createdAt: new Date(),
    });
    return task;
  }

  async function proposeRulePatch(input: {
    changeCandidateId: string;
    proposedRuleVersionIds: string[];
  }): Promise<{ proposedRuleVersionIds: string[] }> {
    if (!store.candidates.has(input.changeCandidateId)) {
      throw new Error('CHANGE_CANDIDATE_NOT_FOUND');
    }
    store.proposedRuleVersionIdsByCandidate.set(input.changeCandidateId, [
      ...input.proposedRuleVersionIds,
    ]);
    return { proposedRuleVersionIds: [...input.proposedRuleVersionIds] };
  }

  async function markRuleVersionApproved(input: {
    ruleVersionId: string;
  }): Promise<{ ruleVersionId: string }> {
    store.approvedRuleVersionIds.add(input.ruleVersionId);
    return { ruleVersionId: input.ruleVersionId };
  }

  async function submitDecision(input: {
    reviewTaskId: string;
    decision: 'approve' | 'reject';
    decidedBy: string;
    decidedByRole: 'curator' | 'expert';
  }) {
    const task = store.reviewTasks.get(input.reviewTaskId);
    if (!task) throw new Error('REVIEW_TASK_NOT_FOUND');
    const candidate = store.candidates.get(task.changeCandidateId);
    if (!candidate) throw new Error('CHANGE_CANDIDATE_NOT_FOUND');
    if (candidate.riskLevel === 'high' && input.decision === 'approve') {
      if (input.decidedByRole !== 'expert') throw new Error('FORBIDDEN_ROLE');
    }
    const decided: ReviewTask = {
      ...task,
      status: 'decided',
      decision: input.decision,
      decidedAt: new Date(),
      decidedBy: input.decidedBy,
    };
    store.reviewTasks.set(decided.id, decided);
    return decided;
  }

  async function publishIfReady(_input: { jurisdiction: string }) {
    const openTasks = [...store.reviewTasks.values()].filter(
      (t) => t.status !== 'decided'
    );
    if (openTasks.length) {
      throw new Error('NOT_READY');
    }
    const rejected = [...store.reviewTasks.values()].some(
      (t) => t.decision === 'reject'
    );
    if (rejected) return { published: false, reason: 'REJECTED' };

    // Ensure every proposed rule version is approved before publishing.
    for (const task of store.reviewTasks.values()) {
      if (task.decision !== 'approve') continue;
      const proposed =
        store.proposedRuleVersionIdsByCandidate.get(task.changeCandidateId) ??
        [];
      const unapproved = proposed.filter(
        (id) => !store.approvedRuleVersionIds.has(id)
      );
      if (unapproved.length) {
        throw new Error('NOT_READY');
      }
    }
    return { published: true };
  }

  return {
    runWatch,
    createReviewTask,
    proposeRulePatch,
    markRuleVersionApproved,
    submitDecision,
    publishIfReady,
  };
}
