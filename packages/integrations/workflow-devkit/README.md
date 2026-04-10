# @contractspec/integration.workflow-devkit

Workflow DevKit compiler and runtime bridges for ContractSpec `WorkflowSpec`.

## What it provides

- Compile a `WorkflowSpec` into a deterministic Workflow DevKit manifest.
- Generate Workflow, Next.js, and generic-host scaffolding.
- Run a `WorkflowSpec` through injected Workflow DevKit primitives such as `sleep`, hooks, and webhooks.
- Create a Workflow-backed `AgentRuntimeAdapterBundle` for `@contractspec/lib.ai-agent`.
- Expose chat route helpers and re-export `WorkflowChatTransport` for reconnectable chat UIs.

## Entry points

- `@contractspec/integration.workflow-devkit`
- `@contractspec/integration.workflow-devkit/compiler`
- `@contractspec/integration.workflow-devkit/runtime`
- `@contractspec/integration.workflow-devkit/chat-routes`
- `@contractspec/integration.workflow-devkit/agent-adapter`
- `@contractspec/integration.workflow-devkit/next`

## Workflow vs step boundary

Workflow DevKit code runs across two different execution contexts:

- Workflow functions (`"use workflow"`) orchestrate control flow and must stay deterministic.
- Step functions (`"use step"`) perform the actual Node.js work.

This matches the Workflow docs: workflow functions do not have full Node.js access, while step functions do. Keep Node.js core modules, SDK clients, database access, and other side effects inside `use step` helpers. The workflow function itself should only compose Workflow primitives and call step helpers.

For `WorkflowSpec` authoring in Workflow-hosted apps, import the safe authoring API from `@contractspec/lib.contracts-spec/workflow/spec`, not the broad `@contractspec/lib.contracts-spec/workflow` barrel.

## Next.js example

```ts
import { withContractSpecWorkflow } from "@contractspec/integration.workflow-devkit/next";
import { createWorkflowChatRoutes } from "@contractspec/module.ai-chat/core/workflow";

export default withContractSpecWorkflow({
  experimental: {},
});

const routes = createWorkflowChatRoutes({
  workflow: async (payload) => payload,
  getFollowUpToken({ runId }) {
    return `chat:${runId}`;
  },
});

export const POST = routes.start;
```

## Generic host example

```ts
import { createHook, createWebhook, sleep } from "workflow";
import {
  runWorkflowSpecWithWorkflowDevkit,
  type WorkflowDevkitRuntimeBridge,
} from "@contractspec/integration.workflow-devkit";
import { onboardingWorkflow } from "./onboarding.workflow";

export async function runOnboarding(input: Record<string, unknown>, bridge: WorkflowDevkitRuntimeBridge) {
  "use workflow";

  // Keep this function deterministic. Node.js work belongs in `use step`
  // helpers that your bridge dispatches to.
  return runWorkflowSpecWithWorkflowDevkit({
    spec: onboardingWorkflow,
    initialData: input,
    bridge,
    primitives: {
      sleep,
      createHook,
      createWebhook,
    },
  });
}
```
