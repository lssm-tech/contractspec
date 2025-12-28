import { describe, expect, it } from 'bun:test';
import {
  composeModuleSchemas,
  generateEntityFragment,
  generateEnumFragment,
  generatePrismaSchema,
} from './generator';
import { defineEntity, defineEntityEnum, field, index } from './defineEntity';
import type { ModuleSchemaContribution } from './types';

describe('generatePrismaSchema', () => {
  it('should generate basic Prisma schema', () => {
    const UserEntity = defineEntity({
      name: 'User',
      fields: {
        id: field.id(),
        name: field.string(),
      },
    });

    const schema = generatePrismaSchema([UserEntity]);

    expect(schema).toContain('datasource db');
    expect(schema).toContain('generator client');
    expect(schema).toContain('model User');
    expect(schema).toContain('id String @id @default(cuid())');
    expect(schema).toContain('name String');
  });

  it('should include schema attribute when entity has schema', () => {
    const Entity = defineEntity({
      name: 'Test',
      schema: 'custom_schema',
      fields: {
        id: field.id(),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('schemas  = ["custom_schema"]');
    expect(schema).toContain('@@schema("custom_schema")');
  });

  it('should generate optional fields correctly', () => {
    const Entity = defineEntity({
      name: 'WithOptional',
      fields: {
        id: field.id(),
        optional: field.string({ isOptional: true }),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('optional String?');
  });

  it('should generate array fields correctly', () => {
    const Entity = defineEntity({
      name: 'WithArray',
      fields: {
        id: field.id(),
        tags: field.string({ isArray: true }),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('tags String[]');
  });

  it('should generate unique constraint', () => {
    const Entity = defineEntity({
      name: 'WithUnique',
      fields: {
        id: field.id(),
        email: field.string({ isUnique: true }),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('email String @unique');
  });

  it('should generate map attribute', () => {
    const Entity = defineEntity({
      name: 'WithMap',
      map: 'custom_table',
      fields: {
        id: field.id(),
        userName: field.string({ map: 'user_name' }),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('@map("user_name")');
    expect(schema).toContain('@@map("custom_table")');
  });

  it('should generate indexes', () => {
    const Entity = defineEntity({
      name: 'Indexed',
      fields: {
        id: field.id(),
        email: field.string(),
        name: field.string(),
      },
      indexes: [index.unique(['email']), index.on(['name'])],
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('@@unique([email])');
    expect(schema).toContain('@@index([name])');
  });

  it('should generate enum fields and definitions', () => {
    const StatusEnum = defineEntityEnum({
      name: 'Status',
      values: ['ACTIVE', 'INACTIVE'],
    });

    const Entity = defineEntity({
      name: 'WithEnum',
      fields: {
        id: field.id(),
        status: field.enum('Status'),
      },
      enums: [StatusEnum],
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('enum Status');
    expect(schema).toContain('ACTIVE');
    expect(schema).toContain('INACTIVE');
    expect(schema).toContain('status Status');
  });

  it('should generate inline enums', () => {
    const Entity = defineEntity({
      name: 'WithInlineEnum',
      fields: {
        id: field.id(),
        priority: field.inlineEnum('Priority', ['LOW', 'MEDIUM', 'HIGH']),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('enum Priority');
    expect(schema).toContain('priority Priority');
  });

  it('should generate relations', () => {
    const UserEntity = defineEntity({
      name: 'User',
      fields: {
        id: field.id(),
        posts: field.hasMany('Post'),
      },
    });

    const PostEntity = defineEntity({
      name: 'Post',
      fields: {
        id: field.id(),
        userId: field.foreignKey(),
        author: field.belongsTo('User', ['userId'], ['id']),
      },
    });

    const schema = generatePrismaSchema([UserEntity, PostEntity]);

    expect(schema).toContain('posts Post[]');
    expect(schema).toContain(
      'author User @relation(fields: [userId], references: [id])'
    );
  });

  it('should include Pothos generator by default', () => {
    const Entity = defineEntity({
      name: 'Test',
      fields: { id: field.id() },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('generator pothos');
    expect(schema).toContain('prisma-pothos-types');
  });

  it('should exclude Pothos generator when disabled', () => {
    const Entity = defineEntity({
      name: 'Test',
      fields: { id: field.id() },
    });

    const schema = generatePrismaSchema([Entity], { includePothos: false });

    expect(schema).not.toContain('generator pothos');
  });

  it('should generate description comments', () => {
    const Entity = defineEntity({
      name: 'Documented',
      description: 'A documented entity',
      fields: {
        id: field.id(),
        name: field.string({ description: 'The user name' }),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('/// A documented entity');
    expect(schema).toContain('/// The user name');
  });

  it('should generate updatedAt attribute', () => {
    const Entity = defineEntity({
      name: 'WithTimestamps',
      fields: {
        id: field.id(),
        updatedAt: field.updatedAt(),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('updatedAt DateTime @updatedAt');
  });

  it('should generate dbType attribute', () => {
    const Entity = defineEntity({
      name: 'WithDbType',
      fields: {
        id: field.id(),
        content: field.string({ dbType: 'Text' }),
      },
    });

    const schema = generatePrismaSchema([Entity]);

    expect(schema).toContain('@db.Text');
  });
});

describe('composeModuleSchemas', () => {
  it('should merge entities from multiple modules', () => {
    const module1: ModuleSchemaContribution = {
      moduleId: '@app/users',
      entities: [
        defineEntity({
          name: 'User',
          fields: { id: field.id() },
        }),
      ],
    };

    const module2: ModuleSchemaContribution = {
      moduleId: '@app/posts',
      entities: [
        defineEntity({
          name: 'Post',
          fields: { id: field.id() },
        }),
      ],
    };

    const schema = composeModuleSchemas([module1, module2]);

    expect(schema).toContain('model User');
    expect(schema).toContain('model Post');
  });

  it('should merge enums from multiple modules', () => {
    const module1: ModuleSchemaContribution = {
      moduleId: '@app/core',
      entities: [defineEntity({ name: 'Entity1', fields: { id: field.id() } })],
      enums: [
        defineEntityEnum({ name: 'Status', values: ['ACTIVE', 'INACTIVE'] }),
      ],
    };

    const module2: ModuleSchemaContribution = {
      moduleId: '@app/other',
      entities: [defineEntity({ name: 'Entity2', fields: { id: field.id() } })],
      enums: [defineEntityEnum({ name: 'Priority', values: ['LOW', 'HIGH'] })],
    };

    const schema = composeModuleSchemas([module1, module2]);

    expect(schema).toContain('enum Status');
    expect(schema).toContain('enum Priority');
  });
});

describe('generateEntityFragment', () => {
  it('should generate only the model block', () => {
    const Entity = defineEntity({
      name: 'FragmentTest',
      description: 'A test fragment',
      fields: {
        id: field.id(),
        name: field.string(),
      },
    });

    const fragment = generateEntityFragment(Entity);

    expect(fragment).toContain('model FragmentTest');
    expect(fragment).toContain('id String @id @default(cuid())');
    expect(fragment).not.toContain('datasource');
    expect(fragment).not.toContain('generator');
  });
});

describe('generateEnumFragment', () => {
  it('should generate only the enum block', () => {
    const enumDef = defineEntityEnum({
      name: 'TestEnum',
      values: ['A', 'B', 'C'],
      description: 'A test enum',
    });

    const fragment = generateEnumFragment(enumDef);

    expect(fragment).toContain('/// A test enum');
    expect(fragment).toContain('enum TestEnum');
    expect(fragment).toContain('A');
    expect(fragment).toContain('B');
    expect(fragment).toContain('C');
    expect(fragment).not.toContain('datasource');
  });
});
