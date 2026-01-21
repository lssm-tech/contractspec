# @contractspec/lib.plugin.example-generator

Example plugin for ContractSpec that generates markdown documentation from ContractSpec specifications.

## Overview

This plugin demonstrates how to create a ContractSpec generator plugin. It transforms structured spec definitions into human-readable markdown documentation that can be used for API docs, user guides, or technical specifications.

## Features

- 🚀 **Spec-First Generation**: Converts ContractSpec specs to markdown automatically
- 📝 **Rich Formatting**: Supports tables, lists, and detail views
- 🔧 **Configurable Output**: Customize formatting, field selection, and styling
- 📊 **Data Integration**: Works with schema models and instance data
- 🎯 **Type Safe**: Full TypeScript support with proper type definitions
- 🧪 **Well Tested**: Comprehensive test suite included

## Installation

```bash
npm install @contractspec/lib.plugin.example-generator
```

## Usage

### Basic Usage

```typescript
import { ExampleGeneratorPlugin } from "@contractspec/lib.plugin.example-generator";

const generator = new ExampleGeneratorPlugin({
  outputDir: "./docs",
  format: "table", // or "list", "detail", "auto"
  includeFields: ["id", "name", "description"],
});

// Generate markdown from specs
await generator.generateFromSpec(specPath, outputPath);
```

### Advanced Configuration

```typescript
import { ExampleGeneratorPlugin } from "@contractspec/lib.plugin.example-generator";

const generator = new ExampleGeneratorPlugin({
  outputDir: "./docs",
  format: "auto",
  title: "API Documentation",
  description: "Auto-generated API documentation",
  maxItems: 100,
  maxDepth: 3,
  fieldLabels: {
    id: "ID",
    createdAt: "Created Date",
    updatedAt: "Last Modified"
  },
  summaryFields: ["id", "name", "status"],
  excludeFields: ["internalNotes", "metadata"]
});
```

## Configuration Options

| Option          | Type                     | Default    | Description                                              |
| --------------- | ------------------------ | ---------- | -------------------------------------------------------- |
| `outputDir`     | `string`                 | `"./docs"` | Directory for generated files                            |
| `format`        | `string`                 | `"auto"`   | Output format: `"table"`, `"list"`, `"detail"`, `"auto"` |
| `title`         | `string`                 | undefined  | Document title                                           |
| `description`   | `string`                 | undefined  | Document description                                     |
| `maxItems`      | `number`                 | `100`      | Maximum items to render in tables                        |
| `maxDepth`      | `number`                 | `2`        | Maximum nesting depth for objects                        |
| `includeFields` | `string[]`               | undefined  | Only include these fields                                |
| `excludeFields` | `string[]`               | `[]`       | Exclude these fields from output                         |
| `fieldLabels`   | `Record<string, string>` | undefined  | Custom field labels                                      |
| `summaryFields` | `string[]`               | undefined  | Fields for list summaries                                |

## Plugin Interface

This plugin implements the ContractSpec generator interface:

```typescript
interface GeneratorPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;

  initialize(config: GeneratorConfig): Promise<void>;
  generate(spec: SpecDefinition, context: GeneratorContext): Promise<GeneratorResult>;
  cleanup(): Promise<void>;
}
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/lssm-tech/contractspec.git
cd contractspec/packages/libs/plugins/example-generator

# Install dependencies
bun install

# Run tests
bun test

# Build the plugin
bun run build
```

### Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage
```

### Building

```bash
# Build the plugin
bun run build

# Build types only
bun run build:types

# Build bundle only
bun run build:bundle
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../../CONTRIBUTING.md) for details.

## License

MIT © ContractSpec Team

## Support

- 📖 [Documentation](https://contractspec.io/docs)
- 🐛 [Issues](https://github.com/lssm-tech/contractspec/issues)
- 💬 [Discussions](https://github.com/lssm-tech/contractspec/discussions)
