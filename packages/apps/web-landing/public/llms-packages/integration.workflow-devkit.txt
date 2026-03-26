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
