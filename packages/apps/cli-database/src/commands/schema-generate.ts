import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaConfig, type SchemaConfig } from '../lib/schema-config.js';

export interface SchemaGenerateArgs {
  config?: string;
  output?: string;
  module?: string;
}

/**
 * Generate Prisma schema from ContractSpec entity definitions.
 * 
 * Usage:
 *   database schema:generate --config ./schema.config.ts --output ./prisma/schema
 *   database schema:generate --module @lssm/lib.identity-rbac
 */
export async function runSchemaGenerate(argv: SchemaGenerateArgs) {
  console.log('📝 Generating Prisma schema from entity specs...\n');

  const configPath = argv.config ?? './schema.config.ts';
  const config = await loadSchemaConfig(configPath);

  if (!config) {
    console.error(`❌ Could not load schema config from ${configPath}`);
    process.exit(1);
  }

  // Filter modules if specified
  const modules = argv.module
    ? config.modules.filter((m) => m.moduleId === argv.module)
    : config.modules;

  if (modules.length === 0) {
    console.error('❌ No modules found to generate');
    process.exit(1);
  }

  console.log(`📦 Processing ${modules.length} module(s):`);
  modules.forEach((m) => {
    console.log(`   - ${m.moduleId} (${m.entities.length} entities)`);
  });
  console.log('');

  // Dynamically import the generator
  const { composeModuleSchemas } = await import('@lssm/lib.schema');

  // Generate the combined schema
  const prismaSchema = composeModuleSchemas(modules, {
    provider: config.provider ?? 'postgresql',
    clientOutput: config.clientOutput,
    includePothos: config.includePothos ?? true,
    pothosOutput: config.pothosOutput,
  });

  // Determine output path
  const outputPath = argv.output ?? config.outputPath ?? './prisma/schema/generated.prisma';
  const outputDir = path.dirname(outputPath);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the generated schema
  fs.writeFileSync(outputPath, prismaSchema, 'utf-8');

  console.log(`✅ Generated Prisma schema: ${outputPath}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Review the generated schema');
  console.log('  2. Run: database generate');
  console.log('  3. Run: database migrate:dev');
}

