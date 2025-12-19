import type {
  EntityEnumDef,
  EntityEnumField,
  EntityField,
  EntityIndex,
  EntityRelationField,
  EntityScalarField,
  EntitySpec,
  ModuleSchemaContribution,
} from './types';

/**
 * Options for Prisma schema generation.
 */
export interface PrismaGeneratorOptions {
  /** Output file path for the generated schema */
  outputPath?: string;
  /** Prisma datasource provider (default: 'postgresql') */
  provider?: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | 'sqlserver';
  /** Prisma generator output path */
  clientOutput?: string;
  /** Include Pothos generator */
  includePothos?: boolean;
  /** Pothos output path */
  pothosOutput?: string;
}

/**
 * Generate Prisma schema content from entity specifications.
 */
export function generatePrismaSchema(
  entities: EntitySpec[],
  options: PrismaGeneratorOptions = {}
): string {
  const {
    provider = 'postgresql',
    clientOutput = '../../src/generated/prisma',
    includePothos = true,
    pothosOutput = '../../src/generated/pothos-types.ts',
  } = options;

  const lines: string[] = [];

  // Collect all schemas used
  const schemas = new Set<string>();
  entities.forEach((entity) => {
    if (entity.schema) {
      schemas.add(entity.schema);
    }
  });
  const schemaList = schemas.size > 0 ? Array.from(schemas) : ['public'];

  // Datasource block
  lines.push('datasource db {');
  lines.push(`  provider = "${provider}"`);
  if (schemas.size > 0) {
    lines.push(`  schemas  = [${schemaList.map((s) => `"${s}"`).join(', ')}]`);
  }
  lines.push('}');
  lines.push('');

  // Generator block
  lines.push('generator client {');
  lines.push('  provider = "prisma-client"');
  lines.push(`  output   = "${clientOutput}"`);
  lines.push('');
  lines.push('  engineType             = "client"');
  lines.push('  runtime                = "bun"');
  lines.push('  moduleFormat           = "esm"');
  lines.push('  generatedFileExtension = "ts"');
  lines.push('  importFileExtension    = "ts"');
  lines.push('}');
  lines.push('');

  // Pothos generator (optional)
  if (includePothos) {
    lines.push('generator pothos {');
    lines.push('  provider          = "prisma-pothos-types"');
    lines.push('  clientOutput      = "./prisma"');
    lines.push(`  output            = "${pothosOutput}"`);
    lines.push('  generateDatamodel = true');
    lines.push('  documentation     = false');
    lines.push('}');
    lines.push('');
  }

  // Collect all enums across entities
  const enumMap = new Map<string, EntityEnumDef>();
  entities.forEach((entity) => {
    entity.enums?.forEach((enumDef) => {
      if (!enumMap.has(enumDef.name)) {
        enumMap.set(enumDef.name, enumDef);
      }
    });
    // Also collect inline enums from fields
    Object.values(entity.fields).forEach((field) => {
      if (
        field.kind === 'enum' &&
        field.values &&
        !enumMap.has(field.enumName)
      ) {
        enumMap.set(field.enumName, {
          name: field.enumName,
          values: field.values,
          schema: entity.schema,
        });
      }
    });
  });

  // Generate enums
  enumMap.forEach((enumDef) => {
    lines.push(...generateEnumBlock(enumDef));
    lines.push('');
  });

  // Generate models
  entities.forEach((entity) => {
    lines.push(...generateModelBlock(entity));
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Generate Prisma enum block.
 */
function generateEnumBlock(enumDef: EntityEnumDef): string[] {
  const lines: string[] = [];

  if (enumDef.description) {
    lines.push(`/// ${enumDef.description}`);
  }

  lines.push(`enum ${enumDef.name} {`);
  enumDef.values.forEach((value) => {
    lines.push(`  ${value}`);
  });
  lines.push('');
  if (enumDef.schema) {
    lines.push(`  @@schema("${enumDef.schema}")`);
  }
  lines.push('}');

  return lines;
}

/**
 * Generate Prisma model block from entity spec.
 */
function generateModelBlock(entity: EntitySpec): string[] {
  const lines: string[] = [];

  // Model description
  if (entity.description) {
    lines.push(`/// ${entity.description}`);
  }

  lines.push(`model ${entity.name} {`);

  // Generate fields
  Object.entries(entity.fields).forEach(([fieldName, field]) => {
    const fieldLine = generateFieldLine(fieldName, field);
    if (field.description) {
      lines.push(`  /// ${field.description}`);
    }
    lines.push(`  ${fieldLine}`);
  });

  // Generate indexes
  if (entity.indexes && entity.indexes.length > 0) {
    lines.push('');
    entity.indexes.forEach((idx) => {
      lines.push(`  ${generateIndexLine(idx)}`);
    });
  }

  // Table mapping
  if (entity.map) {
    lines.push(`  @@map("${entity.map}")`);
  }

  // Schema
  if (entity.schema) {
    lines.push(`  @@schema("${entity.schema}")`);
  }

  lines.push('}');

  return lines;
}

/**
 * Generate a single field line.
 */
function generateFieldLine(fieldName: string, field: EntityField): string {
  if (field.kind === 'scalar') {
    return generateScalarFieldLine(fieldName, field);
  } else if (field.kind === 'enum') {
    return generateEnumFieldLine(fieldName, field);
  } else if (field.kind === 'relation') {
    return generateRelationFieldLine(fieldName, field);
  }
  throw new Error(`Unknown field kind: ${(field as EntityField).kind}`);
}

/**
 * Generate scalar field line.
 */
function generateScalarFieldLine(
  fieldName: string,
  field: EntityScalarField
): string {
  const parts: string[] = [fieldName];

  // Type with optional/array modifiers
  let typeStr = field.type;
  if (field.isArray) {
    typeStr += '[]';
  }
  if (field.isOptional) {
    typeStr += '?';
  }
  parts.push(typeStr);

  // Attributes
  const attrs: string[] = [];

  if (field.isId) {
    attrs.push('@id');
  }

  if (field.default !== undefined) {
    if (typeof field.default === 'string' && field.default.includes('(')) {
      // Function default like cuid(), now(), autoincrement()
      attrs.push(`@default(${field.default})`);
    } else if (typeof field.default === 'boolean') {
      attrs.push(`@default(${field.default})`);
    } else if (typeof field.default === 'number') {
      attrs.push(`@default(${field.default})`);
    } else {
      attrs.push(`@default("${field.default}")`);
    }
  }

  if (field.updatedAt) {
    attrs.push('@updatedAt');
  }

  if (field.isUnique) {
    attrs.push('@unique');
  }

  if (field.map) {
    attrs.push(`@map("${field.map}")`);
  }

  if (field.dbType) {
    attrs.push(`@db.${field.dbType}`);
  }

  if (attrs.length > 0) {
    parts.push(attrs.join(' '));
  }

  return parts.join(' ');
}

/**
 * Generate enum field line.
 */
function generateEnumFieldLine(
  fieldName: string,
  field: EntityEnumField
): string {
  const parts: string[] = [fieldName];

  // Type with optional/array modifiers
  let typeStr = field.enumName;
  if (field.isArray) {
    typeStr += '[]';
  }
  if (field.isOptional) {
    typeStr += '?';
  }
  parts.push(typeStr);

  // Attributes
  const attrs: string[] = [];

  if (field.default !== undefined) {
    attrs.push(`@default(${field.default})`);
  }

  if (field.isUnique) {
    attrs.push('@unique');
  }

  if (field.map) {
    attrs.push(`@map("${field.map}")`);
  }

  if (attrs.length > 0) {
    parts.push(attrs.join(' '));
  }

  return parts.join(' ');
}

/**
 * Generate relation field line.
 */
function generateRelationFieldLine(
  fieldName: string,
  field: EntityRelationField
): string {
  const parts: string[] = [fieldName];

  // Type with array modifier for hasMany
  let typeStr = field.target;
  if (field.type === 'hasMany') {
    typeStr += '[]';
  }
  if (field.type === 'hasOne') {
    typeStr += '?';
  }
  parts.push(typeStr);

  // @relation attribute
  const relationParts: string[] = [];

  if (field.name) {
    relationParts.push(`name: "${field.name}"`);
  }

  if (field.fields && field.fields.length > 0) {
    relationParts.push(`fields: [${field.fields.join(', ')}]`);
  }

  if (field.references && field.references.length > 0) {
    relationParts.push(`references: [${field.references.join(', ')}]`);
  }

  if (field.onDelete) {
    relationParts.push(`onDelete: ${field.onDelete}`);
  }

  if (field.onUpdate) {
    relationParts.push(`onUpdate: ${field.onUpdate}`);
  }

  if (relationParts.length > 0) {
    parts.push(`@relation(${relationParts.join(', ')})`);
  }

  return parts.join(' ');
}

/**
 * Generate index line.
 */
function generateIndexLine(idx: EntityIndex): string {
  const fieldList = idx.fields.join(', ');
  const parts: string[] = [];

  if (idx.unique) {
    parts.push(`@@unique([${fieldList}]`);
  } else {
    parts.push(`@@index([${fieldList}]`);
  }

  const options: string[] = [];

  if (idx.name) {
    options.push(`name: "${idx.name}"`);
  }

  if (idx.type) {
    options.push(`type: ${idx.type}`);
  }

  if (options.length > 0) {
    parts[0] += `, ${options.join(', ')}`;
  }

  parts[0] += ')';

  return parts.join('');
}

/**
 * Compose multiple module schema contributions into a single schema.
 */
export function composeModuleSchemas(
  contributions: ModuleSchemaContribution[],
  options: PrismaGeneratorOptions = {}
): string {
  // Merge all entities
  const allEntities: EntitySpec[] = [];
  const allEnums = new Map<string, EntityEnumDef>();

  contributions.forEach((contrib) => {
    // Add entities
    contrib.entities.forEach((entity) => {
      allEntities.push({
        ...entity,
        module: contrib.moduleId,
      });
    });

    // Merge enums
    contrib.enums?.forEach((enumDef) => {
      if (!allEnums.has(enumDef.name)) {
        allEnums.set(enumDef.name, enumDef);
      }
    });
  });

  // Add collected enums to first entity or create a holder
  if (allEntities[0] && allEnums.size > 0) {
    allEntities[0] = {
      ...allEntities[0],
      enums: [...(allEntities[0].enums ?? []), ...allEnums.values()],
    };
  }

  return generatePrismaSchema(allEntities, options);
}

/**
 * Generate a single entity's Prisma schema fragment (for modular output).
 */
export function generateEntityFragment(entity: EntitySpec): string {
  return generateModelBlock(entity).join('\n');
}

/**
 * Generate a single enum's Prisma schema fragment (for modular output).
 */
export function generateEnumFragment(enumDef: EntityEnumDef): string {
  return generateEnumBlock(enumDef).join('\n');
}
