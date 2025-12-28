import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaConfig, type SchemaConfig } from '../lib/schema-config.js';

export interface SchemaComposeArgs {
  config?: string;
  output?: string;
  modules?: string;
}

/**
 * Compose multiple module schemas into a single Prisma schema.
 *
 * Usage:
 *   database schema:compose --config ./schema.config.ts
 *   database schema:compose --modules "@contractspec/lib.identity-rbac,@contractspec/module.audit-trail"
 */
export async function runSchemaCompose(argv: SchemaComposeArgs) {
  console.log('🔗 Composing module schemas...\n');

  const configPath = argv.config ?? './schema.config.ts';
  const config: SchemaConfig | null = await loadSchemaConfig(configPath);

  if (!config) {
    console.error(`❌ Could not load schema config from ${configPath}`);
    process.exit(1);
  }

  // Filter modules if specified via CLI
  let modules = config.modules;
  if (argv.modules) {
    const moduleIds = argv.modules.split(',').map((m) => m.trim());
    modules = config.modules.filter((m) => moduleIds.includes(m.moduleId));
  }

  if (modules.length === 0) {
    console.error('❌ No modules found to compose');
    process.exit(1);
  }

  console.log(`📦 Composing ${modules.length} module(s):`);
  modules.forEach((m) => {
    console.log(`   - ${m.moduleId}`);
    m.entities.forEach((e) => {
      console.log(`     • ${e.name} (${Object.keys(e.fields).length} fields)`);
    });
  });
  console.log('');

  // Collect all enums
  const allEnums = new Set<string>();
  modules.forEach((m) => {
    m.enums?.forEach((e) => allEnums.add(e.name));
    m.entities.forEach((entity) => {
      entity.enums?.forEach((e) => allEnums.add(e.name));
    });
  });

  if (allEnums.size > 0) {
    console.log(`📋 Enums discovered: ${Array.from(allEnums).join(', ')}`);
    console.log('');
  }

  // Dynamically import the generator
  const { composeModuleSchemas } = await import('@contractspec/lib.schema');

  // Generate the combined schema
  const prismaSchema = composeModuleSchemas(modules, {
    provider: config.provider ?? 'postgresql',
    clientOutput: config.clientOutput,
    includePothos: config.includePothos ?? true,
    pothosOutput: config.pothosOutput,
  });

  // Determine output path
  const outputPath =
    argv.output ?? config.outputPath ?? './prisma/schema/composed.prisma';
  const outputDir = path.dirname(outputPath);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the composed schema
  fs.writeFileSync(outputPath, prismaSchema, 'utf-8');

  // Generate summary
  const entityCount = modules.reduce((acc, m) => acc + m.entities.length, 0);
  const fieldCount = modules.reduce(
    (acc, m) =>
      acc +
      m.entities.reduce((eAcc, e) => eAcc + Object.keys(e.fields).length, 0),
    0
  );

  console.log('✅ Schema composition complete!');
  console.log('');
  console.log(`   📄 Output: ${outputPath}`);
  console.log(`   📦 Modules: ${modules.length}`);
  console.log(`   🏗️  Entities: ${entityCount}`);
  console.log(`   📝 Fields: ${fieldCount}`);
  console.log(`   📋 Enums: ${allEnums.size}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Run: database generate');
  console.log('  2. Run: database migrate:dev --name <migration-name>');
}
