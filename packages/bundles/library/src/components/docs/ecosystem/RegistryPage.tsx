import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function EcosystemRegistryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Registry resolution</h1>
        <p className="text-muted-foreground text-lg">
          Resolve plugins from local workspaces, npm packages, or remote registries.
        </p>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Resolution order</h2>
        <p className="text-muted-foreground text-sm">
          Control where ContractSpec loads plugins and how versions are resolved.
        </p>
        <CodeBlock
          language="json"
          filename=".contractsrc.json"
          code={`{
  "plugins": [
    {
      "id": "markdown-generator",
      "package": "@contractspec/plugin.markdown-generator",
      "capabilities": ["generator"],
      "options": {
        "outputDir": "./docs/generated",
        "format": "table"
      }
    }
  ],
  "pluginRegistry": {
    "resolutionOrder": ["workspace", "npm", "remote"],
    "allowPrerelease": false,
    "sources": {
      "remote": "https://registry.contractspec.io"
    }
  }
}`}
        />
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h2 className="text-2xl font-bold">Custom registry resolvers</h2>
        <p className="text-muted-foreground text-sm">
          Register resolver plugins to load plugins from private registries.
        </p>
        <CodeBlock
          language="typescript"
          filename="registry-resolver.ts"
          code={`import type { RegistryResolverPlugin } from "@contractspec/lib.plugins";

export const PrivateRegistryResolver: RegistryResolverPlugin = {
  meta: {
    id: "private-registry",
    version: "1.0.0",
    type: "registryResolver",
    provides: ["private-registry"],
  },
  resolve: async (request) => {
    // Fetch plugin package metadata from private registry
    const result = await fetch(`https://registry.acme.io/${request.package}`);
    return result.json();
  },
};`}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/ecosystem/integrations" className="btn-primary">
          Integrations <ChevronRight size={16} />
        </Link>
        <Link href="/docs/ecosystem/templates" className="btn-ghost">
          Plugin templates
        </Link>
      </div>
    </div>
  );
}
