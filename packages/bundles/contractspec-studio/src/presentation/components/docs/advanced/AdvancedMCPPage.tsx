import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'MCP Adapters: ContractSpec Docs',
//   description:
//     'Learn how to integrate ContractSpec with Model Context Protocol (MCP) servers for AI-powered capabilities.',
// };

export function AdvancedMCPPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">MCP Adapters</h1>
        <p className="text-muted-foreground">
          The <strong>Model Context Protocol (MCP)</strong> is an open standard
          for connecting AI models to external tools and data sources.
          ContractSpec provides MCP adapters that allow you to expose your
          capabilities as MCP tools and consume external MCP servers as
          capabilities.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why MCP integration matters</h2>
        <p className="text-muted-foreground">
          AI agents need access to real-world tools and data to be useful. MCP
          provides a standardized way to expose these capabilities. By
          integrating ContractSpec with MCP, you can:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Let AI agents invoke your ContractSpec capabilities safely and
            securely
          </li>
          <li>
            Use external MCP servers (databases, APIs, search engines) as
            capability providers in your workflows
          </li>
          <li>
            Build AI-powered features without writing custom integration code
          </li>
          <li>Enforce policies on AI agent actions just like any other user</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Exposing capabilities as MCP tools
        </h2>
        <p className="text-muted-foreground">
          Any{' '}
          <Link
            href="/docs/specs/capabilities"
            className="text-violet-400 hover:text-violet-300"
          >
            CapabilitySpec
          </Link>{' '}
          can be automatically exposed as an MCP tool. ContractSpec generates:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            A tool schema describing the capability's inputs, outputs, and
            purpose
          </li>
          <li>An MCP server endpoint that AI agents can connect to</li>
          <li>
            Policy enforcement ensuring agents can only invoke capabilities
            they're authorized to use
          </li>
          <li>
            Audit logging of all agent actions for compliance and debugging
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Exposing a capability</h2>
        <p className="text-muted-foreground">
          Here's how to expose ContractSpec operations as MCP tools:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from '@lssm/lib.contracts/server/provider-mcp';
import { registry, resources, prompts } from './lib/registry';

const server = new McpServer({
  name: 'my-app-mcp',
  version: '1.0.0',
});

createMcpServer(server, registry, resources, prompts, {
  toolCtx: () => ({ actor: 'ai-agent' }),
  promptCtx: () => ({ userId: null, orgId: null }),
  resourceCtx: () => ({ userId: null, orgId: null }),
});

const transport = new StdioServerTransport();
await server.connect(transport);`}</pre>
        </div>
        <p className="text-muted-foreground">
          AI agents can now discover and invoke your operations through the MCP
          protocol. ContractSpec handles authentication, authorization, and
          execution automatically via the `SpecRegistry`.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Consuming external MCP servers</h2>
        <p className="text-muted-foreground">
          You can integrate external MCP servers into your workflows. Define an
          integration spec and use it in your operations:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { defineIntegration } from '@lssm/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

const SearchProductsIntegration = defineIntegration({
  meta: {
    name: 'products.search',
    version: 1,
    category: 'mcp',
    description: 'Search products via external MCP server',
  },
  connection: {
    serverUrl: 'https://api.example.com/mcp',
    toolName: 'search_products',
  },
  io: {
    input: new SchemaModel({
      name: 'SearchProductsInput',
      fields: {
        query: { type: ScalarTypeEnum.String(), isOptional: false },
        category: { type: ScalarTypeEnum.String(), isOptional: true },
      },
    }),
    output: new SchemaModel({
      name: 'ProductResults',
      fields: {
        products: { type: ScalarTypeEnum.JSON(), isOptional: false, isArray: true },
      },
    }),
  },
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Policy enforcement for AI agents</h2>
        <p className="text-muted-foreground">
          AI agents are treated like any other actor in ContractSpec. They must
          authenticate, and all their actions are subject to{' '}
          <Link
            href="/docs/specs/policy"
            className="text-violet-400 hover:text-violet-300"
          >
            PolicySpecs
          </Link>
          . You can define specific policies in TypeScript:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { definePolicy } from '@lssm/lib.contracts';

export const AIAgentRestrictions = definePolicy({
  meta: {
    name: 'ai.agent.restrictions',
    version: 1,
    description: 'Restrict AI agent actions',
  },
  rules: [
    {
      id: 'agents-read-only',
      effect: 'DENY',
      condition: (ctx) => ctx.actor === 'ai-agent' && ctx.action === 'write',
    },
    {
      id: 'agents-require-approval',
      effect: 'DENY',
      condition: (ctx, spec) => 
        ctx.actor === 'ai-agent' && 
        spec.policy.escalate === 'human_review' &&
        !ctx.approvalGranted,
    },
  ],
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Human-in-the-loop workflows</h2>
        <p className="text-muted-foreground">
          For sensitive operations, you can require human approval before an AI
          agent can proceed. ContractSpec provides built-in approval workflows:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Agent requests permission to invoke a capability</li>
          <li>
            Request is sent to designated approvers (via email, Slack, etc.)
          </li>
          <li>Approver reviews the request and approves or denies it</li>
          <li>Agent receives the decision and can proceed if approved</li>
        </ul>
        <p className="text-muted-foreground">
          All approval decisions are logged in the{' '}
          <Link
            href="/docs/safety/auditing"
            className="text-violet-400 hover:text-violet-300"
          >
            audit log
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Start with read-only capabilities for AI agents—only grant write
            access when necessary.
          </li>
          <li>
            Use human-in-the-loop approval for any capability that modifies
            critical data or triggers financial transactions.
          </li>
          <li>
            Set rate limits to prevent runaway agents from overwhelming your
            system.
          </li>
          <li>
            Provide clear, detailed descriptions for each capability so agents
            know when to use them.
          </li>
          <li>
            Monitor agent actions closely in production and adjust policies as
            needed.
          </li>
          <li>
            Test agent integrations thoroughly with realistic scenarios before
            deploying.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/advanced/renderers" className="btn-ghost">
          Previous: Custom Renderers
        </Link>
        <Link href="/docs/advanced/telemetry" className="btn-primary">
          Next: Telemetry <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
