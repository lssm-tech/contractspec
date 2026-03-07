import type { WorkflowExtension } from './types';

export function mergeExtensions(
  extensions: WorkflowExtension[]
): WorkflowExtension[] {
  return [...extensions].sort((a, b) => {
    const priorityOrder = (a.priority ?? 0) - (b.priority ?? 0);
    if (priorityOrder !== 0) return priorityOrder;

    const workflowOrder = a.workflow.localeCompare(b.workflow);
    if (workflowOrder !== 0) return workflowOrder;

    const tenantOrder = (a.tenantId ?? '').localeCompare(b.tenantId ?? '');
    if (tenantOrder !== 0) return tenantOrder;

    const roleOrder = (a.role ?? '').localeCompare(b.role ?? '');
    if (roleOrder !== 0) return roleOrder;

    const deviceOrder = (a.device ?? '').localeCompare(b.device ?? '');
    if (deviceOrder !== 0) return deviceOrder;

    return (a.baseVersion ?? '').localeCompare(b.baseVersion ?? '');
  });
}
