import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import type { AgentSpec } from '../spec/spec';
import type { ContractSpecAgent } from '../agent/contract-spec-agent';
import { jsonSchemaToZodSafe } from '../schema/json-schema-to-zod';

/**
 * Generate an MCP server that exposes a ContractSpec agent as a tool.
 *
 * This allows other AI agents (e.g., Claude Desktop, Cursor) to use
 * your ContractSpec agents as tools, enabling agent-to-agent composition.
 *
 * @param agent - The ContractSpec agent to expose
 * @param spec - The agent specification
 * @returns MCP Server instance
 *
 * @example
 * ```typescript
 * const server = agentToMcpServer(myAgent, myAgentSpec);
 *
 * // Run via stdio transport
 * const transport = new StdioServerTransport();
 * await server.connect(transport);
 * ```
 */
export function agentToMcpServer(
  agent: ContractSpecAgent,
  spec: AgentSpec
): McpServer {
  const server = new McpServer({
    name: spec.meta.key,
    version: `${spec.meta.version}`,
  });

  // Expose agent as a conversational tool using registerTool
  server.registerTool(
    spec.meta.key,
    {
      description: spec.description ?? `Interact with ${spec.meta.key} agent`,
      inputSchema: z.object({
        message: z
          .string()
          .describe('The message or query to send to the agent'),
        sessionId: z
          .string()
          .optional()
          .describe('Optional session ID to continue a conversation'),
      }),
    },
    async (args) => {
      const { message, sessionId } = args;

      const result = await agent.generate({
        prompt: message,
        options: { sessionId },
      });

      return {
        content: [
          {
            type: 'text',
            text: result.text,
          },
        ],
      };
    }
  );

  // Expose individual tools from the agent spec
  for (const toolConfig of spec.tools) {
    const inputSchema = toolConfig.schema
      ? jsonSchemaToZodSafe(toolConfig.schema)
      : z.object({});

    server.registerTool(
      `${spec.meta.key}.${toolConfig.name}`,
      {
        description:
          toolConfig.description ?? `Execute ${toolConfig.name} tool`,
        inputSchema,
      },
      async (args) => {
        const result = await agent.generate({
          prompt: `Execute the ${toolConfig.name} tool with the following arguments: ${JSON.stringify(args)}`,
        });

        return {
          content: [
            {
              type: 'text',
              text: result.text,
            },
          ],
        };
      }
    );
  }

  return server;
}

/**
 * Configuration for running an agent as an MCP server.
 */
export interface AgentMcpServerConfig {
  /** The agent to expose */
  agent: ContractSpecAgent;
  /** The agent specification */
  spec: AgentSpec;
  /** Optional server name override */
  name?: string;
  /** Optional version override */
  version?: string;
}

/**
 * Create an MCP server from configuration.
 */
export function createAgentMcpServer(config: AgentMcpServerConfig): McpServer {
  return agentToMcpServer(config.agent, config.spec);
}
