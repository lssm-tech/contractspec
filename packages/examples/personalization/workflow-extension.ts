import { composeTenantWorkflowExample, logTenantWorkflowSteps } from './src/workflow-extension';

try {
  const tenantWorkflow = composeTenantWorkflowExample();
  logTenantWorkflowSteps(tenantWorkflow);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
}






















