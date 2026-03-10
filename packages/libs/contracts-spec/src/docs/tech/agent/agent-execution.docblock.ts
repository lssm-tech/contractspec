import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../../registry';

export const tech_agent_execution_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.agent.execution',
    title: 'Agent execution',
    summary: 'Background agent execution, approvals, and artifacts.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/execution',
    tags: ['agent', 'execution'],
    body: `# Agent execution

Defines the core operations, events, and UI surfaces for background agent runs with auditability and approvals.
`,
  },
  {
    id: 'docs.tech.agent.run',
    title: 'Run agent',
    summary: 'Submit a background agent run.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/run',
    tags: ['agent', 'run'],
    body: `# agent.run

Creates a new agent run with a context snapshot and execution metadata.
`,
  },
  {
    id: 'docs.tech.agent.run.form',
    title: 'Agent run form',
    summary: 'Form specification for launching an agent run.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/run/form',
    tags: ['agent', 'form'],
    body: `# agent.run.form

Form surface used by Studio to submit agent runs.
`,
  },
  {
    id: 'docs.tech.agent.status',
    title: 'Agent status',
    summary: 'Query agent run status.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/status',
    tags: ['agent', 'status'],
    body: `# agent.status

Returns status summaries for one or many agent runs.
`,
  },
  {
    id: 'docs.tech.agent.cancel',
    title: 'Cancel agent run',
    summary: 'Cancel an in-flight agent run.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/cancel',
    tags: ['agent', 'cancel'],
    body: `# agent.cancel

Stops an active agent run and records cancellation metadata.
`,
  },
  {
    id: 'docs.tech.agent.artifacts',
    title: 'Agent artifacts',
    summary: 'List artifacts produced by an agent run.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/artifacts',
    tags: ['agent', 'artifacts'],
    body: `# agent.artifacts

Lists files, diffs, and outputs produced during agent execution.
`,
  },
  {
    id: 'docs.tech.agent.approvals',
    title: 'Agent approvals',
    summary: 'Resolve an agent approval request.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/approvals',
    tags: ['agent', 'approval'],
    body: `# agent.approvals

Approve or reject a pending agent action.
`,
  },
  {
    id: 'docs.tech.agent.run.started',
    title: 'Agent run started event',
    summary: 'Emitted when an agent run starts.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/run/started',
    tags: ['agent', 'event'],
    body: `# agent.run.started

Emitted when an agent run begins execution.
`,
  },
  {
    id: 'docs.tech.agent.run.completed',
    title: 'Agent run completed event',
    summary: 'Emitted when an agent run completes.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/run/completed',
    tags: ['agent', 'event'],
    body: `# agent.run.completed

Emitted when a run completes successfully.
`,
  },
  {
    id: 'docs.tech.agent.run.failed',
    title: 'Agent run failed event',
    summary: 'Emitted when an agent run fails.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/run/failed',
    tags: ['agent', 'event'],
    body: `# agent.run.failed

Emitted when a run terminates with failure.
`,
  },
  {
    id: 'docs.tech.agent.approval.requested',
    title: 'Agent approval requested event',
    summary: 'Emitted when approval is required.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/approval/requested',
    tags: ['agent', 'event', 'approval'],
    body: `# agent.approval.requested

Emitted when an approval gate is triggered.
`,
  },
  {
    id: 'docs.tech.agent.run.index',
    title: 'Agent run index view',
    summary: 'Data view for listing agent runs.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/run/index',
    tags: ['agent', 'data-view'],
    body: `# agent.run.index

List view over agent runs and their status.
`,
  },
  {
    id: 'docs.tech.agent.run.audit',
    title: 'Agent run audit presentation',
    summary: 'Presentation spec for agent run audit views.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/run/audit',
    tags: ['agent', 'presentation', 'audit'],
    body: `# agent.run.audit

Presentation surface used to inspect run provenance, tools, approvals, and outputs.
`,
  },
  {
    id: 'docs.tech.agent.operations-as-tools',
    title: 'Operations as tools',
    summary: 'Reference ContractSpec operations as agent tools. One contract → REST, GraphQL, MCP, agent.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/agent/operations-as-tools',
    tags: ['agent', 'tools', 'operations'],
    body: `# Operations as tools

**Preferred pattern:** Reference a ContractSpec operation in your agent via \`operationRef\`. The tool handler and input schema are derived automatically from the operation.

## Usage

1. Define an operation with \`defineCommand\` or \`defineQuery\`.
2. Register and bind a handler to \`OperationSpecRegistry\`.
3. In \`AgentSpec.tools\`, add \`{ name: 'tool_name', operationRef: { key: 'domain.operation', version: '1.0.0' } }\`.
4. Pass \`operationRegistry\` to \`createAgentFactory\` or \`ContractSpecAgent.create\`.

## Output rendering

When tool output should render via PresentationSpec, FormSpec, or DataViewSpec, add \`outputPresentation\`, \`outputForm\`, or \`outputDataView\` to \`AgentToolConfig\` (at most one per tool). The tool adapter wraps raw output for \`ToolResultRenderer\`. OperationSpec can also declare these refs; when the tool has no output refs, the operation's refs are used as fallback.

## Fallback (inline tools)

When the tool is not an operation (LLM subcalls, external APIs), use inline \`AgentToolConfig\` with \`schema\` and a manual handler in \`toolHandlers\`.

See \`@contractspec/lib.ai-agent\` README for full examples.
`,
  },
];

registerDocBlocks(tech_agent_execution_DocBlocks);
