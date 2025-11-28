# Agent Console Example

A ContractSpec example demonstrating AI agent orchestration with tools, runs, and execution logs.

## Overview

This example showcases how to build an AI agent management system using ContractSpec's spec-first approach. It includes:

- **Tools**: Reusable AI functions/capabilities that agents can invoke
- **Agents**: AI agent configurations with assigned tools and parameters
- **Runs**: Execution instances of agents processing user requests
- **Logs**: Detailed execution logs for debugging and auditing

## Features

- Multi-tenant agent management
- Tool registry with typed parameters
- Agent composition with multiple tools
- Run execution with step-by-step logging
- Token usage tracking for billing
- Event-driven architecture for real-time updates

## Usage

```typescript
import { 
  ToolEntity, 
  AgentEntity, 
  RunEntity,
  CreateToolCommand,
  ExecuteAgentCommand 
} from '@lssm/example.agent-console';

// Define a tool
const searchTool = {
  name: 'web-search',
  description: 'Search the web for information',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string' }
    }
  }
};

// Create an agent with tools
const agent = {
  name: 'Research Assistant',
  model: 'gpt-4',
  systemPrompt: 'You are a helpful research assistant.',
  toolIds: ['tool-web-search', 'tool-summarize']
};

// Execute the agent
const run = await executeAgent({
  agentId: agent.id,
  input: { message: 'What are the latest AI developments?' }
});
```

## Entities

- `Tool` - AI tool/function definitions
- `Agent` - Agent configurations
- `Run` - Agent execution instances
- `RunStep` - Individual steps within a run
- `RunLog` - Detailed execution logs

## Events

- `AgentCreated` - When a new agent is configured
- `RunStarted` - When an agent run begins
- `RunCompleted` - When an agent run finishes
- `RunFailed` - When an agent run encounters an error
- `ToolInvoked` - When a tool is called during execution

## Dependencies

This example builds on the following cross-cutting modules:

- `@lssm/lib.identity-rbac` - User and organization management
- `@lssm/lib.jobs` - Async job processing for long-running agents
- `@lssm/modules.audit-trail` - Audit logging for compliance
