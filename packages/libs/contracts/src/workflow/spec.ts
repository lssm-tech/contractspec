import { filterBy, getUniqueTags, groupBy } from '../registry-utils';
import type { CapabilityRef } from '../capabilities';
import type { OwnerShipMeta } from '../ownership';
import type { OpRef } from '../features';
import type { ExperimentRef } from '../experiments/spec';

/**
 * Reference to a form spec declared in {@link FormRegistry}.
 */
export interface FormRef {
  key: string;
  version: number;
}

export type StepType = 'human' | 'automation' | 'decision';

export type WorkflowStatus =
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type GuardConditionKind = 'policy' | 'expression';

export interface GuardCondition {
  type: GuardConditionKind;
  /** Policy name or expression string depending on the type. */
  value: string;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoff: 'linear' | 'exponential';
  delayMs: number;
  /** Optional max delay cap for exponential backoff. */
  maxDelayMs?: number;
}

export interface StepAction {
  /** Operation executed for automation steps. */
  operation?: OpRef;
  /** Form rendered for human input steps. */
  form?: FormRef;
}

export interface Step {
  id: string;
  type: StepType;
  label: string;
  description?: string;
  action?: StepAction;
  guard?: GuardCondition;
  timeoutMs?: number;
  retry?: RetryPolicy;
  /** Integration slot identifiers required before this step can execute. */
  requiredIntegrations?: string[];
  /** Capabilities that must be enabled for this step to execute. */
  requiredCapabilities?: CapabilityRef[];
}

export interface Transition {
  from: string;
  to: string;
  label?: string;
  /** Expression evaluated against workflow data (e.g., `data.approved === true`). */
  condition?: string;
}

export interface SLA {
  totalDurationMs?: number;
  stepDurationMs?: Record<string, number>;
}

export interface CompensationStep {
  stepId: string;
  operation: OpRef;
  description?: string;
}

export interface CompensationStrategy {
  trigger?: 'on_failure' | 'manual';
  steps: CompensationStep[];
}

export interface WorkflowDefinition {
  steps: Step[];
  transitions: Transition[];
  /** Optional explicit entry step. Defaults to the first step when omitted. */
  entryStepId?: string;
  sla?: SLA;
  compensation?: CompensationStrategy;
}

export type WorkflowMeta = OwnerShipMeta;

export interface WorkflowSpec {
  meta: WorkflowMeta;
  definition: WorkflowDefinition;
  policy?: { flags?: string[] };
  experiments?: ExperimentRef[];
}

function workflowKey(meta: WorkflowMeta) {
  return `${meta.key}.v${meta.version}`;
}

export class WorkflowRegistry {
  private readonly items = new Map<string, WorkflowSpec>();

  register(spec: WorkflowSpec): this {
    const key = workflowKey(spec.meta);
    if (this.items.has(key)) throw new Error(`Duplicate workflow ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): WorkflowSpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): WorkflowSpec | undefined {
    if (version != null) return this.items.get(`${name}.v${version}`);
    let candidate: WorkflowSpec | undefined;
    let max = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== name) continue;
      if (spec.meta.version > max) {
        max = spec.meta.version;
        candidate = spec;
      }
    }
    return candidate;
  }

  /** Filter workflows by criteria. */
  filter(criteria: import('../registry-utils').RegistryFilter): WorkflowSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List workflows with specific tag. */
  listByTag(tag: string): WorkflowSpec[] {
    return this.list().filter((w) => w.meta.tags?.includes(tag));
  }

  /** List workflows by owner. */
  listByOwner(owner: string): WorkflowSpec[] {
    return this.list().filter((w) => w.meta.owners?.includes(owner));
  }

  /** Group workflows by key function. */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<WorkflowSpec>
  ): Map<string, WorkflowSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all workflows. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}
