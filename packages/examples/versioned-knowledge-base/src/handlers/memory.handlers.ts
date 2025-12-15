interface SourceRef {
  sourceDocumentId: string;
  excerpt?: string;
}
interface SourceDocument {
  id: string;
  jurisdiction: string;
  authority: string;
  title: string;
  fetchedAt: Date;
  hash: string;
  fileId: string;
}
interface Rule {
  id: string;
  jurisdiction: string;
  topicKey: string;
}
interface RuleVersion {
  id: string;
  ruleId: string;
  jurisdiction: string;
  topicKey: string;
  version: number;
  content: string;
  sourceRefs: SourceRef[];
  status: 'draft' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}
interface KBSnapshot {
  id: string;
  jurisdiction: string;
  asOfDate: Date;
  includedRuleVersionIds: string[];
  publishedAt: Date;
}

export interface MemoryKbStore {
  sources: Map<string, SourceDocument>;
  rules: Map<string, Rule>;
  ruleVersions: Map<string, RuleVersion>;
  snapshots: Map<string, KBSnapshot>;
  nextRuleVersionNumberByRuleId: Map<string, number>;
}

export function createMemoryKbStore(): MemoryKbStore {
  return {
    sources: new Map(),
    rules: new Map(),
    ruleVersions: new Map(),
    snapshots: new Map(),
    nextRuleVersionNumberByRuleId: new Map(),
  };
}

export interface MemoryKbHandlers {
  createRule(rule: Rule): Promise<Rule>;
  ingestSource(input: Omit<SourceDocument, 'id'>): Promise<SourceDocument>;
  upsertRuleVersion(input: {
    ruleId: string;
    content: string;
    sourceRefs: SourceRef[];
  }): Promise<RuleVersion>;
  approveRuleVersion(input: {
    ruleVersionId: string;
    approver: string;
  }): Promise<RuleVersion>;
  publishSnapshot(input: {
    jurisdiction: string;
    asOfDate: Date;
  }): Promise<KBSnapshot>;
  search(input: {
    snapshotId: string;
    jurisdiction: string;
    query: string;
  }): Promise<{ items: { ruleVersionId: string; excerpt?: string }[] }>;
}

function stableId(prefix: string, value: string): string {
  return `${prefix}_${value.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export function createMemoryKbHandlers(store: MemoryKbStore): MemoryKbHandlers {
  async function createRule(rule: Rule): Promise<Rule> {
    store.rules.set(rule.id, rule);
    return rule;
  }

  async function ingestSource(
    input: Omit<SourceDocument, 'id'>
  ): Promise<SourceDocument> {
    const id = stableId('src', `${input.jurisdiction}_${input.hash}`);
    const doc: SourceDocument = { id, ...input };
    store.sources.set(id, doc);
    return doc;
  }

  async function upsertRuleVersion(input: {
    ruleId: string;
    content: string;
    sourceRefs: SourceRef[];
  }): Promise<RuleVersion> {
    if (!input.sourceRefs.length) {
      throw new Error('SOURCE_REFS_REQUIRED');
    }
    const rule = store.rules.get(input.ruleId);
    if (!rule) {
      throw new Error('RULE_NOT_FOUND');
    }
    const next =
      (store.nextRuleVersionNumberByRuleId.get(input.ruleId) ?? 0) + 1;
    store.nextRuleVersionNumberByRuleId.set(input.ruleId, next);
    const id = stableId('rv', `${input.ruleId}_${next}`);
    const ruleVersion: RuleVersion = {
      id,
      ruleId: input.ruleId,
      jurisdiction: rule.jurisdiction,
      topicKey: rule.topicKey,
      version: next,
      content: input.content,
      sourceRefs: input.sourceRefs,
      status: 'draft',
      createdAt: new Date(),
      approvedAt: undefined,
      approvedBy: undefined,
    };
    store.ruleVersions.set(id, ruleVersion);
    return ruleVersion;
  }

  async function approveRuleVersion(input: {
    ruleVersionId: string;
    approver: string;
  }): Promise<RuleVersion> {
    const existing = store.ruleVersions.get(input.ruleVersionId);
    if (!existing) {
      throw new Error('RULE_VERSION_NOT_FOUND');
    }
    const approved: RuleVersion = {
      ...existing,
      status: 'approved',
      approvedBy: input.approver,
      approvedAt: new Date(),
    };
    store.ruleVersions.set(approved.id, approved);
    return approved;
  }

  async function publishSnapshot(input: {
    jurisdiction: string;
    asOfDate: Date;
  }): Promise<KBSnapshot> {
    const approved = [...store.ruleVersions.values()].filter(
      (rv) => rv.status === 'approved' && rv.jurisdiction === input.jurisdiction
    );
    if (approved.length === 0) {
      throw new Error('NO_APPROVED_RULES');
    }
    const includedRuleVersionIds = approved.map((rv) => rv.id).sort();
    const id = stableId(
      'snap',
      `${input.jurisdiction}_${input.asOfDate.toISOString().slice(0, 10)}_${includedRuleVersionIds.length}`
    );
    const snapshot: KBSnapshot = {
      id,
      jurisdiction: input.jurisdiction,
      asOfDate: input.asOfDate,
      includedRuleVersionIds,
      publishedAt: new Date(),
    };
    store.snapshots.set(id, snapshot);
    return snapshot;
  }

  async function search(input: {
    snapshotId: string;
    jurisdiction: string;
    query: string;
  }): Promise<{ items: { ruleVersionId: string; excerpt?: string }[] }> {
    const snapshot = store.snapshots.get(input.snapshotId);
    if (!snapshot) {
      throw new Error('SNAPSHOT_NOT_FOUND');
    }
    if (snapshot.jurisdiction !== input.jurisdiction) {
      throw new Error('JURISDICTION_MISMATCH');
    }
    const q = input.query.toLowerCase();
    const tokens = q
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const items = snapshot.includedRuleVersionIds
      .map((id) => store.ruleVersions.get(id))
      .filter((rv): rv is RuleVersion => Boolean(rv))
      .filter((rv) => {
        if (tokens.length === 0) return true;
        const hay = rv.content.toLowerCase();
        return tokens.every((token) => hay.includes(token));
      })
      .map((rv) => ({
        ruleVersionId: rv.id,
        excerpt: rv.content.slice(0, 120),
      }));
    return { items };
  }

  return {
    createRule,
    ingestSource,
    upsertRuleVersion,
    approveRuleVersion,
    publishSnapshot,
    search,
  };
}
