interface RunnerTemplateOptions {
  exportName: string;
  specImportPath: string;
  runnerName: string;
  workflowName: string;
}

export function generateWorkflowRunnerTemplate({
  exportName,
  specImportPath,
  runnerName,
  workflowName,
}: RunnerTemplateOptions): string {
  return `import {
  InMemoryStateStore,
  WorkflowRegistry,
  WorkflowRunner,
} from '@lssm/lib.contracts/workflow';
import { ${exportName} } from '${specImportPath}';

/**
 * Runner wiring for ${workflowName}.
 *
 * TODO:
 *  - Replace the in-memory state store with a persistent adapter if needed.
 *  - Implement opExecutor to invoke the correct contract handlers.
 *  - Wire eventEmitter to analytics/telemetry sinks.
 */
const registry = new WorkflowRegistry();
registry.register(${exportName});

const stateStore = new InMemoryStateStore();

export const ${runnerName} = new WorkflowRunner({
  registry,
  stateStore,
  opExecutor: async (operation, input, ctx) => {
    // TODO: route to the appropriate contract handler
    // Example: return contractRegistry.execute(operation.name, operation.version, input, ctx);
    throw new Error(
      \`opExecutor for \${operation.name}.v\${operation.version} is not implemented\`
    );
  },
  // appConfigProvider: async (state) => {
  //   // TODO: return the ResolvedAppConfig for this workflow run (tenant/environment)
  //   return undefined;
  // },
  // enforceCapabilities: async (operation, context) => {
  //   // TODO: ensure required capabilities are satisfied using context.integrations/context.resolvedAppConfig
  // },
  eventEmitter: (event, payload) => {
    // TODO: forward workflow events to telemetry or logging sinks
    // console.log(event, payload);
  },
});
`;
}
