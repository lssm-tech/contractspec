# @contractspec/lib.plugins

Core plugin API for ContractSpec. Defines plugin interfaces, registry management, and discovery configuration.

## Overview

Use this package to build generator, validator, adapter, formatter, and registry resolver plugins. The core types keep plugin behavior consistent while allowing capability-specific logic.

## Installation

```bash
bun add @contractspec/lib.plugins
```

## Usage

```typescript
import type { ContractSpecPlugin, PluginContext } from "@contractspec/lib.plugins";

export const MarkdownGeneratorPlugin: ContractSpecPlugin = {
  meta: {
    id: "markdown-generator",
    version: "1.0.0",
    type: "generator",
    provides: ["docs"],
  },
  register(context: PluginContext) {
    context.generators.register({
      id: "markdown",
      description: "Generate markdown docs",
      generate: async (specs) => {
        // Implementation
      },
    });
  },
};
```

## Capabilities

- **Generators**: Produce code, docs, schemas, or artifacts.
- **Validators**: Enforce policies and compliance checks.
- **Adapters**: Integrate frameworks or runtimes.
- **Formatters**: Post-process generated output.
- **Registry resolvers**: Resolve plugins from workspace, npm, or remote registries.

## Registry configuration

```json
{
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
  ]
}
```
