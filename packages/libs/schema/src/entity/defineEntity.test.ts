import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import { defineEntity, defineEntityEnum, field, index } from './defineEntity';

describe('defineEntity', () => {
  it('should create an entity spec with fields', () => {
    const UserEntity = defineEntity({
      name: 'User',
      fields: {
        id: field.id(),
        name: field.string(),
      },
    });

    expect(UserEntity.name).toBe('User');
    expect(UserEntity.fields.id.kind).toBe('scalar');
    expect(UserEntity.fields.name.kind).toBe('scalar');
  });

  it('should support description and schema', () => {
    const Entity = defineEntity({
      name: 'TestEntity',
      description: 'A test entity',
      schema: 'custom_schema',
      fields: {
        id: field.id(),
      },
    });

    expect(Entity.description).toBe('A test entity');
    expect(Entity.schema).toBe('custom_schema');
  });

  it('should support indexes', () => {
    const Entity = defineEntity({
      name: 'IndexedEntity',
      fields: {
        id: field.id(),
        email: field.string({ isUnique: true }),
      },
      indexes: [index.unique(['email'])],
    });

    expect(Entity.indexes).toHaveLength(1);
    expect(Entity.indexes![0]!.unique).toBe(true);
  });
});

describe('defineEntityEnum', () => {
  it('should create an enum definition', () => {
    const StatusEnum = defineEntityEnum({
      name: 'Status',
      values: ['ACTIVE', 'INACTIVE', 'PENDING'],
    });

    expect(StatusEnum.name).toBe('Status');
    expect(StatusEnum.values).toEqual(['ACTIVE', 'INACTIVE', 'PENDING']);
  });

  it('should support schema and description', () => {
    const PriorityEnum = defineEntityEnum({
      name: 'Priority',
      values: ['LOW', 'MEDIUM', 'HIGH'],
      schema: 'custom',
      description: 'Task priority levels',
    });

    expect(PriorityEnum.schema).toBe('custom');
    expect(PriorityEnum.description).toBe('Task priority levels');
  });
});

describe('field helpers', () => {
  describe('scalar fields', () => {
    it('should create string field', () => {
      const f = field.string();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('String');
    });

    it('should create string field with options', () => {
      const f = field.string({ isOptional: true, isUnique: true });
      expect(f.isOptional).toBe(true);
      expect(f.isUnique).toBe(true);
    });

    it('should create int field', () => {
      const f = field.int();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('Int');
    });

    it('should create float field', () => {
      const f = field.float();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('Float');
    });

    it('should create boolean field', () => {
      const f = field.boolean();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('Boolean');
    });

    it('should create dateTime field', () => {
      const f = field.dateTime();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('DateTime');
    });

    it('should create json field', () => {
      const f = field.json();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('Json');
    });

    it('should create bigInt field', () => {
      const f = field.bigInt();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('BigInt');
    });

    it('should create decimal field', () => {
      const f = field.decimal();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('Decimal');
    });

    it('should create bytes field', () => {
      const f = field.bytes();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('Bytes');
    });
  });

  describe('common patterns', () => {
    it('should create id field with cuid default', () => {
      const f = field.id();
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('String');
      expect(f.isId).toBe(true);
      expect(f.default).toBe('cuid()');
    });

    it('should create uuid field', () => {
      const f = field.uuid();
      expect(f.isId).toBe(true);
      expect(f.default).toBe('uuid()');
    });

    it('should create autoIncrement field', () => {
      const f = field.autoIncrement();
      expect(f.type).toBe('Int');
      expect(f.isId).toBe(true);
      expect(f.default).toBe('autoincrement()');
    });

    it('should create createdAt field', () => {
      const f = field.createdAt();
      expect(f.type).toBe('DateTime');
      expect(f.default).toBe('now()');
    });

    it('should create updatedAt field', () => {
      const f = field.updatedAt();
      expect(f.type).toBe('DateTime');
      expect(f.updatedAt).toBe(true);
    });

    it('should create email field with zod validation', () => {
      const f = field.email();
      expect(f.type).toBe('String');
      expect(f.zod).toBeDefined();
    });

    it('should create url field with zod validation', () => {
      const f = field.url();
      expect(f.type).toBe('String');
      expect(f.zod).toBeDefined();
    });
  });

  describe('enum fields', () => {
    it('should create enum field', () => {
      const f = field.enum('Status');
      expect(f.kind).toBe('enum');
      expect(f.enumName).toBe('Status');
    });

    it('should create inline enum field', () => {
      const f = field.inlineEnum('Priority', ['LOW', 'MEDIUM', 'HIGH']);
      expect(f.kind).toBe('enum');
      expect(f.enumName).toBe('Priority');
      expect(f.values).toEqual(['LOW', 'MEDIUM', 'HIGH']);
    });
  });

  describe('relation fields', () => {
    it('should create hasOne relation', () => {
      const f = field.hasOne('Profile');
      expect(f.kind).toBe('relation');
      expect(f.type).toBe('hasOne');
      expect(f.target).toBe('Profile');
    });

    it('should create hasMany relation', () => {
      const f = field.hasMany('Post');
      expect(f.kind).toBe('relation');
      expect(f.type).toBe('hasMany');
      expect(f.target).toBe('Post');
    });

    it('should create belongsTo relation', () => {
      const f = field.belongsTo('User', ['userId'], ['id']);
      expect(f.kind).toBe('relation');
      expect(f.type).toBe('belongsTo');
      expect(f.target).toBe('User');
      expect(f.fields).toEqual(['userId']);
      expect(f.references).toEqual(['id']);
    });

    it('should create belongsTo with options', () => {
      const f = field.belongsTo('User', ['userId'], ['id'], {
        onDelete: 'Cascade',
        onUpdate: 'Cascade',
      });
      expect(f.onDelete).toBe('Cascade');
      expect(f.onUpdate).toBe('Cascade');
    });

    it('should create foreignKey field', () => {
      const f = field.foreignKey({ isOptional: true });
      expect(f.kind).toBe('scalar');
      expect(f.type).toBe('String');
      expect(f.isOptional).toBe(true);
    });
  });
});

describe('index helpers', () => {
  it('should create regular index', () => {
    const idx = index.on(['field1', 'field2']);
    expect(idx.fields).toEqual(['field1', 'field2']);
    expect(idx.unique).toBeUndefined();
  });

  it('should create unique index', () => {
    const idx = index.unique(['email']);
    expect(idx.fields).toEqual(['email']);
    expect(idx.unique).toBe(true);
  });

  it('should create compound index with sort', () => {
    const idx = index.compound(['createdAt', 'id'], {
      createdAt: 'Desc',
      id: 'Asc',
    });
    expect(idx.fields).toEqual(['createdAt', 'id']);
    expect(idx.sort).toEqual({ createdAt: 'Desc', id: 'Asc' });
  });

  it('should support index options', () => {
    const idx = index.on(['field'], { name: 'custom_index', type: 'BTree' });
    expect(idx.name).toBe('custom_index');
    expect(idx.type).toBe('BTree');
  });
});
