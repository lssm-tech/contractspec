import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mergeConfig, validateConfig } from './config.js';
import type {
  ExampleGeneratorPluginConfig,
  GeneratorContext,
  GeneratorResult,
  PluginMetadata,
} from './types.js';

export class ExampleGeneratorPlugin {
  private config: ExampleGeneratorPluginConfig;
  private readonly metadata: PluginMetadata;

  constructor(config: Partial<ExampleGeneratorPluginConfig> = {}) {
    const merged = mergeConfig(config);
    validateConfig(merged);
    this.config = merged;
    this.metadata = {
      id: 'example-generator',
      name: '@contractspec/integration.example-generator',
      version: '1.0.0',
      description: 'Example markdown documentation generator',
      author: 'ContractSpec',
    };
  }

  getConfig(): ExampleGeneratorPluginConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ExampleGeneratorPluginConfig>): void {
    const merged = mergeConfig({ ...this.config, ...config });
    validateConfig(merged);
    this.config = merged;
  }

  getMetadata(): PluginMetadata {
    return { ...this.metadata };
  }

  async generate(context: GeneratorContext): Promise<GeneratorResult> {
    if (!context.spec) {
      throw new Error('Spec is required to generate documentation');
    }

    const outputDir = this.config.outputDir;
    mkdirSync(outputDir, { recursive: true });

    const fileName = 'spec-' + Date.now() + '.md';
    const outputPath = join(outputDir, fileName);
    const content = `# Spec Documentation\n\nGenerated for spec: ${String(
      (context.spec as { id?: string }).id ?? 'unknown'
    )}`;

    writeFileSync(outputPath, content, 'utf8');

    return {
      outputPath,
      itemCount: 1,
      metadata: {
        specId: String((context.spec as { id?: string }).id ?? 'unknown'),
        generatedAt: new Date(),
        format: this.config.format ?? 'auto',
        config: this.config,
      },
    };
  }
}
