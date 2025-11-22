import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import { applyWorkflowExtension } from './injector';
import type { ComposeParams, WorkflowExtension } from './types';
import { satisfies } from 'compare-versions';

export class WorkflowComposer {
  private readonly extensions: WorkflowExtension[] = [];

  register(extension: WorkflowExtension): this {
    this.extensions.push(extension);
    return this;
  }

  registerMany(extensions: WorkflowExtension[]): this {
    extensions.forEach((extension) => this.register(extension));
    return this;
  }

  compose(params: ComposeParams): WorkflowSpec {
    const applicable = this.extensions
      .filter((extension) => matches(params, extension))
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

    return applicable.reduce(
      (acc, extension) => applyWorkflowExtension(acc, extension),
      params.base
    );
  }
}

function matches(params: ComposeParams, extension: WorkflowExtension) {
  if (extension.workflow !== params.base.meta.key) return false;
  if (
    extension.baseVersion &&
    !satisfies(params.base.meta.version, extension.baseVersion)
  ) {
    return false;
  }
  if (extension.tenantId && extension.tenantId !== params.tenantId) {
    return false;
  }
  if (extension.role && extension.role !== params.role) {
    return false;
  }
  if (extension.device && extension.device !== params.device) {
    return false;
  }
  return true;
}



