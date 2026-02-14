/**
 * Template for the example-generator plugin
 * Creates a markdown documentation generator from ContractSpec specs
 */
export function createExampleGeneratorTemplate() {
  return {
    files: {
      'package.json': `{
  "name": "{{integrationPackageName}}",
  "version": "{{version}}",
  "description": "{{description}}",
  "keywords": [
    "contractspec",
    "plugin",
    "generator",
    "markdown",
    "documentation",
    "typescript"
  ],
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./types": "./dist/types.js",
    "./generator": "./dist/generator.js",
    "./config": "./dist/config.js",
    "./*": "./*"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "publish:pkg": "bun publish --tolerate-republish --ignore-scripts --verbose",
    "publish:pkg:canary": "bun publish:pkg --tag canary",
    "prebuild": "contractspec-bun-build prebuild",
    "build": "bun run prebuild && bun run build:bundle && bun run build:types",
    "build:bundle": "contractspec-bun-build transpile",
    "build:types": "contractspec-bun-build types",
    "typecheck": "tsc --noEmit",
    "dev": "contractspec-bun-build dev",
    "clean": "rimraf dist .turbo",
    "lint": "bun lint:fix",
    "lint:fix": "eslint src --fix",
    "lint:check": "eslint src",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "test:smoke": "bun test/smoke.test.ts"
  },
  "dependencies": {
    "@contractspec/lib.contracts-spec": "workspace:*",
    "@contractspec/lib.schema": "workspace:*",
    "zod": "catalog:"
  },
  "devDependencies": {
    "@contractspec/tool.bun": "workspace:*",
    "@contractspec/tool.typescript": "workspace:*",
    "typescript": "catalog:",
    "@types/node": "^22.0.0",
    "rimraf": "^6.0.1"
  },
  "peerDependencies": {
    "@contractspec/lib.contracts-spec": "^1.0.0",
    "@contractspec/lib.schema": "^1.0.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/lssm-tech/contractspec.git",
    "directory": "packages/integrations/{{name}}"
  },
  "homepage": "https://contractspec.io",
  "bugs": {
    "url": "https://github.com/lssm-tech/contractspec/issues"
  },
  "author": {
    "name": "{{author}}"
  },
  "engines": {
    "node": ">=18.0.0",
    "bun": ">=1.0.0"
  }
}`,

      'README.md': `# {{integrationPackageName}}

{{description}}

## Overview

This is a ContractSpec plugin that generates markdown documentation from ContractSpec specifications. It transforms structured spec definitions into human-readable documentation that can be used for API docs, user guides, or technical specifications.

## Features

- 🚀 **Spec-First Generation**: Converts ContractSpec specs to markdown automatically
- 📝 **Rich Formatting**: Supports tables, lists, and detail views
- 🔧 **Configurable Output**: Customize formatting, field selection, and styling
- 📊 **Data Integration**: Works with schema models and instance data
- 🎯 **Type Safe**: Full TypeScript support with proper type definitions
- 🧪 **Well Tested**: Comprehensive test suite included

## Installation

\`\`\`bash
npm install {{integrationPackageName}}
\`\`\`

## Usage

### Basic Usage

\`\`\`typescript
import { {{className}} } from "{{integrationPackageName}}";

const generator = new {{className}}({
  outputDir: "./docs",
  format: "table", // or "list", "detail", "auto"
  includeFields: ["id", "name", "description"],
});

// Generate markdown from specs
await generator.generateFromSpec(specPath, outputPath);
\`\`\`

### Advanced Configuration

\`\`\`typescript
import { {{className}} } from "{{integrationPackageName}}";

const generator = new {{className}}({
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
\`\`\`

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`outputDir\` | \`string\` | \`"./docs"\` | Directory for generated files |
| \`format\` | \`string\` | \`"auto"\` | Output format: \`"table"\`, \`"list"\`, \`"detail"\`, \`"auto"\` |
| \`title\` | \`string\` | undefined | Document title |
| \`description\` | \`string\` | undefined | Document description |
| \`maxItems\` | \`number\` | \`100\` | Maximum items to render in tables |
| \`maxDepth\` | \`number\` | \`2\` | Maximum nesting depth for objects |
| \`includeFields\` | \`string[]\` | undefined | Only include these fields |
| \`excludeFields\` | \`string[]\` | \`[]\` | Exclude these fields from output |
| \`fieldLabels\` | \`Record<string, string>\` | undefined | Custom field labels |
| \`summaryFields\` | \`string[]\` | undefined | Fields for list summaries |

## Plugin Interface

This plugin implements the ContractSpec generator interface:

\`\`\`typescript
interface GeneratorPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  
  initialize(config: GeneratorConfig): Promise<void>;
  generate(spec: SpecDefinition, context: GeneratorContext): Promise<GeneratorResult>;
  cleanup(): Promise<void>;
}
\`\`\`

## Development

### Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/lssm-tech/contractspec.git
cd contractspec/packages/libs/plugins/{{name}}

# Install dependencies
bun install

# Run tests
bun test

# Build the plugin
bun run build
\`\`\`

### Testing

\`\`\`bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage
\`\`\`

### Building

\`\`\`bash
# Build the plugin
bun run build

# Build types only
bun run build:types

# Build bundle only
bun run build:bundle
\`\`\`

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © {{author}}

## Support

- 📖 [Documentation](https://contractspec.io/docs)
- 🐛 [Issues](https://github.com/lssm-tech/contractspec/issues)
- 💬 [Discussions](https://github.com/lssm-tech/contractspec/discussions)`,

      'src/index.ts': `/**
  * {{integrationPackageName}}
  * {{description}}

 */

export { {{className}} } from "./generator.js";
export type { {{className}}Config, GeneratorResult } from "./types.js";
export { defaultConfig } from "./config.js";`,

      'src/types.ts': `import type { AnySchemaModel } from "@contractspec/lib.schema";
import type { SpecDefinition } from "@contractspec/lib.contracts-spec";

/**
 * Configuration for the {{className}} plugin
 */
export interface {{className}}Config {
  /** Directory where markdown files will be generated */
  outputDir: string;
  /** Output format: table, list, detail, or auto */
  format?: "table" | "list" | "detail" | "auto";
  /** Title for the generated documentation */
  title?: string;
  /** Description to include below the title */
  description?: string;
  /** Maximum number of items to render in tables */
  maxItems?: number;
  /** Maximum nesting depth for nested objects */
  maxDepth?: number;
  /** Only include these fields (if not specified, all fields are included) */
  includeFields?: string[];
  /** Exclude these fields from output */
  excludeFields?: string[];
  /** Custom field labels (field name -> display label) */
  fieldLabels?: Record<string, string>;
  /** Fields to use for summary in list format */
  summaryFields?: string[];
}

/**
 * Context provided during generation
 */
export interface GeneratorContext {
  /** The spec definition being processed */
  spec: SpecDefinition;
  /** Schema models from the spec */
  schemas: Record<string, AnySchemaModel>;
  /** Instance data (optional) */
  data?: unknown;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Result of generation
 */
export interface GeneratorResult {
  /** Path to the generated file */
  outputPath: string;
  /** Number of items processed */
  itemCount: number;
  /** Generation metadata */
  metadata: {
    specId: string;
    generatedAt: Date;
    format: string;
    config: Partial<{{className}}Config>;
  };
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly author: string;
  readonly homepage?: string;
}

/**
 * Error types for the plugin
 */
export class {{className}}Error extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "{{className}}Error";
  }
}

/**
 * Validation errors
 */
export class ValidationError extends {{className}}Error {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends {{className}}Error {
  constructor(message: string, details?: unknown) {
    super(message, "CONFIGURATION_ERROR", details);
    this.name = "ConfigurationError";
  }
}

/**
 * Generation errors
 */
export class GenerationError extends {{className}}Error {
  constructor(message: string, details?: unknown) {
    super(message, "GENERATION_ERROR", details);
    this.name = "GenerationError";
  }
}`,

      'src/config.ts': `import type { {{className}}Config } from "./types.js";

/**
 * Default configuration for the {{className}} plugin
 */
export const defaultConfig: {{className}}Config = {
  outputDir: "./docs",
  format: "auto",
  maxItems: 100,
  maxDepth: 2,
  excludeFields: [],
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig: Partial<{{className}}Config>): {{className}}Config {
  return {
    ...defaultConfig,
    ...userConfig,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: {{className}}Config): void {
  if (!config.outputDir) {
    throw new Error("outputDir is required");
  }

  if (config.format && !["table", "list", "detail", "auto"].includes(config.format)) {
    throw new Error("format must be one of: table, list, detail, auto");
  }

  if (config.maxItems !== undefined && config.maxItems < 1) {
    throw new Error("maxItems must be greater than 0");
  }

  if (config.maxDepth !== undefined && config.maxDepth < 1) {
    throw new Error("maxDepth must be greater than 0");
  }
}`,

      'src/generator.ts': `import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import type { 
  {{className}}Config, 
  GeneratorContext, 
  GeneratorResult,
  PluginMetadata,
  ConfigurationError,
  GenerationError
} from "./types.js";
import { schemaToMarkdown } from "@contractspec/lib.contracts-spec/schema-to-markdown";
import { validateConfig, mergeConfig } from "./config.js";

/**
 * {{className}} - Markdown Documentation Generator
 * 
 * Generates markdown documentation from ContractSpec specifications.
 */
export class {{className}} {
  private readonly metadata: PluginMetadata;
  private config: {{className}}Config;

  constructor(config: Partial<{{className}}Config> = {}) {
    this.metadata = {
      id: "{{name}}",
      name: "{{integrationPackageName}}",
      version: "{{version}}",
      description: "{{description}}",
      author: "{{author}}",
      homepage: "https://contractspec.io",
    };

    this.config = mergeConfig(config);
    validateConfig(this.config);

    // Ensure output directory exists
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  /**
   * Get plugin metadata
   */
  getMetadata(): PluginMetadata {
    return this.metadata;
  }

  /**
   * Generate markdown documentation from a spec and optional data
   */
  async generate(context: GeneratorContext): Promise<GeneratorResult> {
    try {
      const { spec, schemas, data } = context;
      
      if (!spec) {
        throw new GenerationError("Spec definition is required");
      }

      // Find the primary schema (first one by convention)
      const schemaNames = Object.keys(schemas);
      if (schemaNames.length === 0) {
        throw new GenerationError("No schemas found in spec");
      }

      const primarySchemaName = schemaNames[0];
      const primarySchema = schemas[primarySchemaName];

      // Generate markdown
      const markdown = schemaToMarkdown(primarySchema, data, {
        title: this.config.title,
        description: this.config.description,
        format: this.config.format,
        maxItems: this.config.maxItems,
        maxDepth: this.config.maxDepth,
        includeFields: this.config.includeFields,
        excludeFields: this.config.excludeFields,
        fieldLabels: this.config.fieldLabels,
        summaryFields: this.config.summaryFields,
      });

      // Determine output file path
      const fileName = this.generateFileName(spec.id || primarySchemaName);
      const outputPath = join(this.config.outputDir, fileName);

      // Write markdown file
      writeFileSync(outputPath, markdown, "utf8");

      const itemCount = Array.isArray(data) ? data.length : data ? 1 : 0;

      return {
        outputPath,
        itemCount,
        metadata: {
          specId: spec.id || "unknown",
          generatedAt: new Date(),
          format: this.config.format || "auto",
          config: {
            format: this.config.format,
            maxItems: this.config.maxItems,
            maxDepth: this.config.maxDepth,
          },
        },
      };
    } catch (error) {
      if (error instanceof GenerationError) {
        throw error;
      }
      throw new GenerationError("Failed to generate documentation", error);
    }
  }

  /**
   * Generate documentation from a spec file path
   */
  async generateFromSpec(specPath: string, outputPath?: string): Promise<GeneratorResult> {
    try {
      // This would typically load the spec from file
      // For now, we'll throw an error indicating this needs implementation
      throw new Error("generateFromSpec needs to be implemented with spec loading logic");
    } catch (error) {
      if (error instanceof GenerationError) {
        throw error;
      }
      throw new GenerationError("Failed to generate from spec file", error);
    }
  }

  /**
   * Generate appropriate filename for the output
   */
  private generateFileName(specId: string): string {
    // Convert spec ID to a filename-friendly format
    const fileName = specId
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
    
    return fileName.endsWith(".md")
      ? fileName
      : fileName + ".md";
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<{{className}}Config>): void {
    this.config = mergeConfig({ ...this.config, ...newConfig });
    validateConfig(this.config);

    // Ensure output directory exists if it changed
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): {{className}}Config {
    return { ...this.config };
  }

  /**
   * Cleanup resources (no-op for this plugin)
   */
  async cleanup(): Promise<void> {
    // No resources to cleanup for this plugin
  }
}`,

      'src/utils/test-utils.ts': `

import type { AnySchemaModel } from "@contractspec/lib.schema";
import type { {{className}}Config } from "../types.js";

/**
 * Create a mock schema for testing
 */
export function createMockSchema(overrides: Partial<AnySchemaModel> = {}): AnySchemaModel {
  return {
    config: {
      fields: {
        id: { type: "string", isOptional: false },
        name: { type: "string", isOptional: false },
        description: { type: "string", isOptional: true },
        status: { type: "string", isOptional: true },
        createdAt: { type: "date", isOptional: false },
        updatedAt: { type: "date", isOptional: true },
      },
      ...overrides.config,
    },
    ...overrides,
  };
}

/**
 * Create mock data for testing
 */
export function createMockData(count: number = 3) {
  return Array.from({ length: count }, (_, i) => ({
    id: "item-" + (i + 1),
    name: "Test Item " + (i + 1),
    description: "Description for test item " + (i + 1),
    status: i % 2 === 0 ? "active" : "inactive",
    createdAt: new Date(2024, 0, i + 1),
    updatedAt: i % 3 === 0 ? undefined : new Date(2024, 0, i + 2),
  }));
}


/**
 * Create test configuration
 */
export function createTestConfig(overrides: Partial<Config> = {}): {{className}}Config {
  return {
    outputDir: "./test-docs",
    format: "table",
    maxItems: 10,
    maxDepth: 2,
    excludeFields: [],
    ...overrides,
  };
}`,

      'tests/generator.test.ts': `import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, unlinkSync, readFileSync } from "fs";
import { join } from "path";
import { {{className}}, ConfigurationError, GenerationError } from "../src/generator.js";
import type { {{className}}Config } from "../src/types.js";
import { createMockSchema, createMockData, createTestConfig } from "../src/utils/test-utils.js";

describe("{{className}}", () => {
  let generator: {{className}};
  let testConfig: {{className}}Config;
  const testOutputDir = "./test-output";

  beforeEach(() => {
    testConfig = createTestConfig({ outputDir: testOutputDir });
    generator = new {{className}}(testConfig);
  });

  afterEach(() => {
    // Clean up test files
    if (existsSync(testOutputDir)) {
      // In a real implementation, you'd recursively delete the directory
      console.log("Cleaning up test directory: " + testOutputDir);
    }
  });

  describe("constructor", () => {
    it("should create a generator with default config", () => {
      const gen = new {{className}}();
      const config = gen.getConfig();
      
      expect(config.outputDir).toBe("./docs");
      expect(config.format).toBe("auto");
      expect(config.maxItems).toBe(100);
    });

    it("should create a generator with custom config", () => {
      const customConfig = {
        outputDir: "./custom-docs",
        format: "table" as const,
        maxItems: 50,
      };
      
      const gen = new {{className}}(customConfig);
      const config = gen.getConfig();
      
      expect(config.outputDir).toBe("./custom-docs");
      expect(config.format).toBe("table");
      expect(config.maxItems).toBe(50);
    });

    it("should throw ConfigurationError for invalid config", () => {
      expect(() => {
        new {{className}}({ outputDir: "" });
      }).toThrow(ConfigurationError);
    });
  });

  describe("getMetadata", () => {
    it("should return correct plugin metadata", () => {
      const metadata = generator.getMetadata();
      
      expect(metadata.id).toBe("{{name}}");
      expect(metadata.name).toBe("{{integrationPackageName}}");
      expect(metadata.description).toBe("{{description}}");
      expect(metadata.author).toBe("{{author}}");
    });
  });

  describe("generate", () => {
    it("should generate markdown from schema and data", async () => {
      const schema = createMockSchema();
      const data = createMockData(3);
      
      const result = await generator.generate({
        spec: { id: "test-spec" } as any,
        schemas: { TestItem: schema },
        data,
      });
      
      expect(result.outputPath).toContain(testOutputDir);
      expect(result.itemCount).toBe(3);
      expect(existsSync(result.outputPath)).toBe(true);
      
      // Check generated content
      const content = readFileSync(result.outputPath, "utf8");
      expect(content).toContain("item-1");
      expect(content).toContain("Test Item 1");
    });

    it("should handle empty data", async () => {
      const schema = createMockSchema();
      
      const result = await generator.generate({
        spec: { id: "test-spec" } as any,
        schemas: { TestItem: schema },
        data: [],
      });
      
      expect(result.itemCount).toBe(0);
      expect(existsSync(result.outputPath)).toBe(true);
    });

    it("should throw GenerationError for missing spec", async () => {
      await expect(
        generator.generate({
          spec: null as any,
          schemas: {},
          data: [],
        })
      ).rejects.toThrow(GenerationError);
    });

    it("should throw GenerationError for missing schemas", async () => {
      await expect(
        generator.generate({
          spec: { id: "test-spec" } as any,
          schemas: {},
          data: [],
        })
      ).rejects.toThrow(GenerationError);
    });
  });

  describe("updateConfig", () => {
    it("should update configuration", () => {
      generator.updateConfig({ maxItems: 25 });
      
      const config = generator.getConfig();
      expect(config.maxItems).toBe(25);
    });

    it("should throw ConfigurationError for invalid update", () => {
      expect(() => {
        generator.updateConfig({ format: "invalid" as any });
      }).toThrow(ConfigurationError);
    });
  });

  describe("cleanup", () => {
    it("should cleanup successfully", async () => {
      await expect(generator.cleanup()).resolves.not.toThrow();
    });
  });
});`,

      'tests/utils.test.ts': `import { describe, it, expect } from "bun:test";
import { createMockSchema, createMockData, createTestConfig } from "../src/utils/test-utils.js";
import type { {{className}}Config } from "../src/types.js";

describe("Test Utils", () => {
  describe("createMockSchema", () => {
    it("should create a mock schema with default fields", () => {
      const schema = createMockSchema();
      
      expect(schema.config.fields).toBeDefined();
      expect(schema.config.fields.id).toBeDefined();
      expect(schema.config.fields.name).toBeDefined();
      expect(schema.config.fields.description).toBeDefined();
    });

    it("should apply overrides", () => {
      const overrides = {
        config: {
          fields: {
            customField: { type: "number", isOptional: false },
          },
        },
      };
      
      const schema = createMockSchema(overrides);
      
      expect(schema.config.fields.customField).toBeDefined();
      expect(schema.config.fields.customField.type).toBe("number");
    });
  });

  describe("createMockData", () => {
    it("should create mock data with specified count", () => {
      const data = createMockData(5);
      
      expect(data).toHaveLength(5);
      expect(data[0].id).toBe("item-1");
      expect(data[4].id).toBe("item-5");
    });

    it("should create default count when not specified", () => {
      const data = createMockData();
      
      expect(data).toHaveLength(3);
    });
  });

  describe("createTestConfig", () => {
    it("should create test config with defaults", () => {
      const config = createTestConfig();
      
      expect(config.outputDir).toBe("./test-docs");
      expect(config.format).toBe("table");
      expect(config.maxItems).toBe(10);
    });

    it("should apply overrides", () => {
      const overrides: Partial<{{className}}Config> = {
        format: "list",
        maxItems: 20,
      };
      
      const config = createTestConfig(overrides);
      
      expect(config.format).toBe("list");
      expect(config.maxItems).toBe(20);
    });
  });
});`,

      '.github/workflows/ci.yml': `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Run smoke test
      run: bun run test:smoke

  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Run tests
      run: bun test
    
    - name: Run tests with coverage
      run: bun test --coverage
    
    - name: Build
      run: bun run build
    
    - name: Lint
      run: bun run lint:check

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Build
      run: bun run build
    
    - name: Publish to NPM
      run: bun run publish:pkg
      env:
        NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`,

      'tests/smoke.test.ts': `import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { existsSync, mkdirSync, rmSync } from "fs";
import { {{className}} } from "../src/generator.js";

const SMOKE_OUTPUT_DIR = "./.smoke-test-output";

describe("{{className}} Smoke Test", () => {
  beforeAll(() => {
    if (!existsSync(SMOKE_OUTPUT_DIR)) {
      mkdirSync(SMOKE_OUTPUT_DIR, { recursive: true });
    }
  });

  afterAll(() => {
    if (existsSync(SMOKE_OUTPUT_DIR)) {
      rmSync(SMOKE_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  it("should instantiate without errors", () => {
    const generator = new {{className}}({ outputDir: SMOKE_OUTPUT_DIR });
    expect(generator).toBeDefined();
    expect(typeof generator.generate).toBe("function");
    expect(typeof generator.getMetadata).toBe("function");
    expect(typeof generator.getConfig).toBe("function");
    expect(typeof generator.cleanup).toBe("function");
  });

  it("should generate output file", async () => {
    const generator = new {{className}}({ outputDir: SMOKE_OUTPUT_DIR });
    
    const result = await generator.generate({
      spec: { id: "smoke-test-spec" } as any,
      schemas: {
        TestEntity: {
          config: {
            fields: {
              id: { type: "string", isOptional: false },
              name: { type: "string", isOptional: false },
            },
          },
        },
      },
      data: [{ id: "test-1", name: "Smoke Test Entity" }],
    });

    expect(result.outputPath).toBeDefined();
    expect(result.itemCount).toBe(1);
    expect(existsSync(result.outputPath)).toBe(true);
  });

  it("should handle config updates", () => {
    const generator = new {{className}}();
    generator.updateConfig({ format: "list", maxItems: 50 });
    const config = generator.getConfig();
    expect(config.format).toBe("list");
    expect(config.maxItems).toBe(50);
  });

  it("should provide valid metadata", () => {
    const generator = new {{className}}();
    const metadata = generator.getMetadata();
    expect(metadata.id).toBeDefined();
    expect(metadata.name).toBeDefined();
    expect(metadata.version).toBeDefined();
    expect(typeof metadata.id).toBe("string");
    expect(typeof metadata.name).toBe("string");
    expect(typeof metadata.version).toBe("string");
  });

  it("should cleanup without errors", async () => {
    const generator = new {{className}}({ outputDir: SMOKE_OUTPUT_DIR });
    await expect(generator.cleanup()).resolves.not.toThrow();
  });
});`,

      '.eslintrc.json': `{
  "extends": [
    "@contractspec/eslint-config-typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}`,

      'tsconfig.json': `{
  "extends": "@contractspec/tsconfig-base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}`,

      'tsdown.config.js': `import { defineConfig, nodeLib } from "@contractspec/tool.bun";

export default defineConfig(() => ({
  ...nodeLib,
  entry: ["src/index.ts"],
}));`,

      LICENSE: `MIT License

Copyright (c) {{currentYear}} {{author}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

      'src/templates/index.ts': `/**
 * Template registry for the create-contractspec-plugin tool
 */

export { createExampleGeneratorTemplate } from "./example-generator.js";
export type { Template, TemplateFile } from "./types.js";`,

      'src/templates/types.ts': `/**
 * Template types
 */

export interface TemplateFile {
  content: string;
  path: string;
}

export interface Template {
  name: string;
  description: string;
  files: Record<string, string>;
  dependencies?: string[];
  devDependencies?: string[];
}
`,
    },
  };
}
