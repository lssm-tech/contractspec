import type { WorkflowSpec } from '@lssm/lib.contracts/workflow/spec';
import { applyWorkflowExtension } from './injector';
import type { ComposeParams, WorkflowExtension } from './types';

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
  if (extension.workflow !== params.base.meta.name) return false;
  if (
    extension.baseVersion &&
    extension.baseVersion !== params.base.meta.version
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



