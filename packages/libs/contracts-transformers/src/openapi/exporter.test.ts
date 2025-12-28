/**
 * Tests for OpenAPI exporter functionality.
 */
import { describe, expect, it } from 'bun:test';
import {
  defineCommand,
  defineQuery,
  FeatureRegistry,
  OperationSpecRegistry,
  StabilityEnum,
} from '@contractspec/lib.contracts';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  contractSpecToJson,
  exportContractSpec,
  openApiForRegistry,
} from './exporter';
import {
  exportOperations,
  generateOperationsRegistry,
} from './exporter/operations';
import { generateRegistryIndex } from './exporter/registries';

// Test models using correct SchemaModel API
const StringType = ScalarTypeEnum.String_unsecure();
const NumberType = ScalarTypeEnum.Float_unsecure();

const TestInput = new SchemaModel({
  name: 'TestInput',
  fields: {
    name: { type: StringType, isOptional: false },
    value: { type: NumberType, isOptional: false },
  },
});

const TestOutput = new SchemaModel({
  name: 'TestOutput',
  fields: {
    id: { type: StringType, isOptional: false },
    result: { type: StringType, isOptional: false },
  },
});

// Test specs
const testCommand = defineCommand({
  meta: {
    key: 'test.create',
    title: 'Create Test',
    version: 1,
    description: 'Test create command',
    tags: ['test'],
    stability: StabilityEnum.Stable,
    owners: ['test-team'],
    goal: 'Test goal',
    context: 'Test context',
  },
  io: {
    input: TestInput,
    output: TestOutput,
  },
  policy: {
    auth: 'anonymous',
  },
});

const testQuery = defineQuery({
  meta: {
    key: 'test.get',
    title: 'Get Test',
    version: 1,
    description: 'Test get query',
    tags: ['test'],
    stability: StabilityEnum.Stable,
    owners: ['test-team'],
    goal: 'Test goal',
    context: 'Test context',
  },
  io: {
    input: TestInput,
    output: TestOutput,
  },
  policy: {
    auth: 'anonymous',
  },
});

describe('OpenAPI Exporter', () => {
  describe('openApiForRegistry (backward compatibility)', () => {
    it('should export operations to OpenAPI paths', () => {
      const registry = new OperationSpecRegistry()
        .register(testCommand)
        .register(testQuery);

      const doc = openApiForRegistry(registry, {
        title: 'Test API',
        version: '1.0.0',
      });

      expect(doc.openapi).toBe('3.1.0');
      expect(doc.info.title).toBe('Test API');
      expect(doc.info.version).toBe('1.0.0');
      expect(Object.keys(doc.paths).length).toBeGreaterThan(0);
      expect(Object.keys(doc.components.schemas).length).toBeGreaterThan(0);
    });

    it('should include x-contractspec extension on operations', () => {
      const registry = new OperationSpecRegistry().register(testCommand);

      const doc = openApiForRegistry(registry);

      const path = Object.values(doc.paths)[0];
      const operation = path?.['post'] as Record<string, unknown>;

      expect(operation['x-contractspec']).toEqual({
        name: 'test.create',
        version: 1,
        kind: 'command',
      });
    });
  });

  describe('exportOperations', () => {
    it('should export operations to paths and schemas', () => {
      const registry = new OperationSpecRegistry()
        .register(testCommand)
        .register(testQuery);

      const result = exportOperations(registry);

      expect(Object.keys(result.paths).length).toBe(2);
      expect(Object.keys(result.schemas).length).toBeGreaterThan(0);
    });
  });

  describe('generateOperationsRegistry', () => {
    it('should generate TypeScript registry code', () => {
      const registry = new OperationSpecRegistry().register(testCommand);

      const result = generateOperationsRegistry(registry);

      expect(result.fileName).toBe('operations-registry.ts');
      expect(result.code).toContain('OperationSpecRegistry');
      expect(result.code).toContain('export const operationsRegistry');
    });
  });

  describe('exportContractSpec', () => {
    it('should export all surfaces', () => {
      const operationsRegistry = new OperationSpecRegistry().register(
        testCommand
      );
      const featuresRegistry = new FeatureRegistry().register({
        meta: {
          key: 'test-feature',
          version: 1,
          title: 'Test Feature',
          description: 'Test feature',
          domain: 'test',
          owners: ['test-team'],
          tags: ['test'],
          stability: StabilityEnum.Stable,
        },
        operations: [{ key: 'test.create', version: 1 }],
      });

      const result = exportContractSpec(
        {
          operations: operationsRegistry,
          features: featuresRegistry,
        },
        {
          title: 'Test API',
          version: '1.0.0',
        }
      );

      expect(result.openApi.openapi).toBe('3.1.0');
      expect(result.openApi['x-contractspec-features']).toBeDefined();
      expect(result.registries?.operations).toBeDefined();
      expect(result.registries?.features).toBeDefined();
      expect(result.registries?.index).toBeDefined();
    });

    it('should respect export options', () => {
      const operationsRegistry = new OperationSpecRegistry().register(
        testCommand
      );
      const featuresRegistry = new FeatureRegistry().register({
        meta: {
          key: 'test-feature',
          version: 1,
          title: 'Test Feature',
          description: 'Test feature',
          domain: 'test',
          owners: ['test-team'],
          tags: ['test'],
          stability: StabilityEnum.Stable,
        },
      });

      const result = exportContractSpec(
        {
          operations: operationsRegistry,
          features: featuresRegistry,
        },
        {
          operations: true,
          features: false,
          generateRegistries: true,
        }
      );

      expect(result.openApi.paths).toBeDefined();
      expect(result.openApi['x-contractspec-features']).toBeUndefined();
      expect(result.registries?.operations).toBeDefined();
      expect(result.registries?.features).toBeUndefined();
    });
  });

  describe('contractSpecToJson', () => {
    it('should export to JSON string', () => {
      const registry = new OperationSpecRegistry().register(testCommand);

      const json = contractSpecToJson({ operations: registry });
      const parsed = JSON.parse(json);

      expect(parsed.openapi).toBe('3.1.0');
      expect(parsed.paths).toBeDefined();
    });
  });

  describe('generateRegistryIndex', () => {
    it('should generate index file with all registries', () => {
      const result = generateRegistryIndex({
        operations: true,
        events: true,
        features: true,
        presentations: true,
        forms: true,
        dataViews: true,
        workflows: true,
      });

      expect(result.fileName).toBe('index.ts');
      expect(result.code).toContain("export * from './operations-registry'");
      expect(result.code).toContain("export * from './features-registry'");
      expect(result.code).toContain("export * from './events-exports'");
    });

    it('should respect options for which registries to include', () => {
      const result = generateRegistryIndex({
        operations: true,
        events: false,
        features: true,
      });

      expect(result.code).toContain("export * from './operations-registry'");
      expect(result.code).toContain("export * from './features-registry'");
      expect(result.code).not.toContain("export * from './events-exports'");
    });
  });
});
