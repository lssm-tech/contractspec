import { describe, expect, it } from 'bun:test';
import { ModuleResolver } from './module-resolver';
import type { WorkspaceAdapters } from '../../ports/logger';
import type { SpecScanResult } from '@contractspec/module.workspace';

describe('ModuleResolver', () => {
  const mockAdapters = {} as WorkspaceAdapters; // Not used in this logic currently

  const createSpec = (
    type: SpecScanResult['specType'],
    key: string,
    filePath: string
  ): SpecScanResult => ({
    specType: type,
    key,
    filePath,

    hasMeta: true,
    hasIo: false,
    hasPolicy: false,
    hasPayload: false,
    hasContent: false,
    hasDefinition: false,
  });

  it('should resolve to Feature if only Feature is in ancestry', () => {
    const resolver = new ModuleResolver(mockAdapters);
    resolver.initialize([
      createSpec(
        'feature',
        'my-feature',
        '/root/features/my-feature/feature.ts'
      ),
    ]);

    const result = resolver.resolve('/root/features/my-feature/src/op.ts');
    expect(result).toBeDefined();
    expect(result?.key).toBe('my-feature');
    expect(result?.type).toBe('feature');
  });

  it('should resolve to Example over Feature (nested)', () => {
    const resolver = new ModuleResolver(mockAdapters);
    resolver.initialize([
      createSpec(
        'example',
        'my-example',
        '/root/examples/my-example/example.ts'
      ),
      createSpec(
        'feature',
        'nested-feature',
        '/root/examples/my-example/src/nested-feature/feature.ts'
      ),
    ]);

    // File inside the nested feature
    const result = resolver.resolve(
      '/root/examples/my-example/src/nested-feature/src/op.ts'
    );

    // Priority Rule: Example > Feature
    expect(result).toBeDefined();
    expect(result?.key).toBe('my-example');
    expect(result?.type).toBe('example');
  });

  it('should resolve to AppConfig over Example and Feature', () => {
    const resolver = new ModuleResolver(mockAdapters);
    resolver.initialize([
      createSpec('app-config', 'my-app', '/root/apps/my-app/app-config.ts'),
      createSpec(
        'example',
        'my-example',
        '/root/apps/my-app/examples/my-example/example.ts'
      ),
    ]);

    const result = resolver.resolve(
      '/root/apps/my-app/examples/my-example/src/op.ts'
    );

    // Priority Rule: AppConfig > Example
    expect(result).toBeDefined();
    expect(result?.key).toBe('my-app');
    expect(result?.type).toBe('app-config');
  });

  it('should return undefined if no module in ancestry', () => {
    const resolver = new ModuleResolver(mockAdapters);
    resolver.initialize([
      createSpec(
        'feature',
        'my-feature',
        '/root/features/my-feature/feature.ts'
      ),
    ]);

    const result = resolver.resolve('/root/other/op.ts');
    expect(result).toBeUndefined();
  });

  it('should pick closest module if multiple of same priority exist (nested features - unexpected but possible in theory)', () => {
    const resolver = new ModuleResolver(mockAdapters);
    resolver.initialize([
      createSpec(
        'feature',
        'parent-feature',
        '/root/features/parent/feature.ts'
      ),
      createSpec(
        'feature',
        'child-feature',
        '/root/features/parent/child/feature.ts'
      ),
    ]);

    const result = resolver.resolve('/root/features/parent/child/src/op.ts');

    // Same priority (Feature vs Feature) -> Closest (Child)
    expect(result).toBeDefined();
    expect(result?.key).toBe('child-feature');
  });
});
