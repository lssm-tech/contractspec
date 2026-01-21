import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function EcosystemPluginsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Plugin API</h1>
        <p className="text-muted-foreground text-lg">
          Extend ContractSpec with generators, validators, adapters, formatters,
          and registry resolvers.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Core capabilities</h2>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>Generators for code, docs, and schemas.</li>
          <li>Validators for policy checks and compliance gates.</li>
          <li>Adapters for framework and runtime integration.</li>
          <li>Formatters and diff renderers for deterministic output.</li>
          <li>Registry resolvers for local and remote plugin discovery.</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Plugin interface</h2>
          <p className="text-muted-foreground text-sm">
            Define capabilities and lifecycle hooks in a single plugin
            entrypoint.
          </p>
          <CodeBlock
            language="typescript"
            filename="plugin.ts"
            code={`import type {
  ContractSpecPlugin,
  PluginContext,
  GeneratorCapability,
} from "@contractspec/lib.plugins";

export const MarkdownGeneratorPlugin: ContractSpecPlugin = {
  meta: {
    id: "markdown-generator",
    version: "1.0.0",
    type: "generator",
    provides: ["docs"],
  },
  register(context: PluginContext) {
    const generator: GeneratorCapability = {
      id: "markdown",
      description: "Generate Markdown docs",
      generate: async (specs) => {
        // Implementation...
      },
    };

    context.generators.register(generator);
  },
};`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Lifecycle hooks</h2>
          <p className="text-muted-foreground text-sm">
            Use lifecycle hooks to configure, validate, and dispose resources.
          </p>
          <CodeBlock
            language="typescript"
            filename="lifecycle.ts"
            code={`export const MarkdownGeneratorPlugin: ContractSpecPlugin = {
  meta: {
    id: "markdown-generator",
    version: "1.0.0",
    type: "generator",
    provides: ["docs"],
  },
  register(context) {
    // Register capabilities
  },
  configure(options, context) {
    // Optional: apply workspace configuration
  },
  validate(specs, context) {
    // Optional: add validation checks
  },
  generate(specs, context) {
    // Required: emit outputs
  },
  dispose() {
    // Optional: cleanup
  },
};`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Register a plugin</h2>
          <p className="text-muted-foreground text-sm">
            Configure plugins in <code>.contractsrc.json</code> to load them in
            the CLI and runtime.
          </p>
          <CodeBlock
            language="json"
            filename=".contractsrc.json"
            code={`{
  "plugins": [
    {
      "id": "markdown-generator",
      "package": "@contractspec/plugin.markdown",
      "capabilities": ["generator"],
      "options": {
        "outputDir": "./docs/generated",
        "format": "table"
      }
    }
  ]
}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/ecosystem/templates" className="btn-primary">
          Plugin templates <ChevronRight size={16} />
        </Link>
        <Link href="/docs/ecosystem/integrations" className="btn-ghost">
          Integrations
        </Link>
      </div>
    </div>
  );
}
