'use client';

import { useMemo } from 'react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';
import { getContractSpecFeatureRegistry } from '../../../features/registry';

export interface UseFeatureRegistryReturn {
  /** All registered features. */
  features: FeatureModuleSpec[];
  /** Get a feature by its key. */
  getFeature: (key: string) => FeatureModuleSpec | undefined;
  /** Get features with a specific tag. */
  getByTag: (tag: string) => FeatureModuleSpec[];
  /** Get features by owner. */
  getByOwner: (owner: string) => FeatureModuleSpec[];
  /** Get all unique tags across features. */
  getUniqueTags: () => string[];
  /** Get all unique domains across features. */
  getUniqueDomains: () => string[];
  /** Get all unique stability values across features. */
  getUniqueStabilities: () => string[];
}

/**
 * Hook to access the ContractSpec feature registry.
 * Provides feature listing and filtering capabilities.
 */
export function useFeatureRegistry(): UseFeatureRegistryReturn {
  const registry = useMemo(() => getContractSpecFeatureRegistry(), []);

  return useMemo(() => {
    const features = registry.list();

    return {
      features,
      getFeature: (key: string) => registry.get(key),
      getByTag: (tag: string) => registry.listByTag(tag),
      getByOwner: (owner: string) => registry.listByOwner(owner),
      getUniqueTags: () => registry.getUniqueTags(),
      getUniqueDomains: () => {
        const domains = new Set<string>();
        for (const f of features) {
          if (f.meta.domain) domains.add(f.meta.domain);
        }
        return [...domains].sort();
      },
      getUniqueStabilities: () => {
        const stabilities = new Set<string>();
        for (const f of features) {
          if (f.meta.stability) stabilities.add(f.meta.stability);
        }
        return [...stabilities].sort();
      },
    };
  }, [registry]);
}
