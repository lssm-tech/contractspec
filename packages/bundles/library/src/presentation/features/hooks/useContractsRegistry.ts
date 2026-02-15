'use client';

import { useMemo } from 'react';
import type { AnyOperationSpec } from '@contractspec/lib.contracts-spec';
import type { OpRef } from '@contractspec/lib.contracts-spec/features';
import {
  getContractSpecOperationRegistry,
  resolveOperationSpec,
} from '../../../features';

export interface UseContractsRegistryReturn {
  /** Resolve an OpRef to its full OperationSpec. */
  resolveOperation: (ref: OpRef) => AnyOperationSpec | undefined;
  /** Resolve an operation by key and optional version. */
  getOperationSpec: (
    key: string,
    version?: string
  ) => AnyOperationSpec | undefined;
  /** List all registered operation specs. */
  listOperations: () => AnyOperationSpec[];
}

/**
 * Hook to access the ContractSpec contracts registry.
 * Provides resolution of OpRef/EventRef/PresentationRef to their full specs.
 */
export function useContractsRegistry(): UseContractsRegistryReturn {
  const registry = useMemo(() => getContractSpecOperationRegistry(), []);

  return useMemo(
    () => ({
      resolveOperation: (ref: OpRef) =>
        resolveOperationSpec(ref.key, ref.version),
      getOperationSpec: (key: string, version?: string) =>
        resolveOperationSpec(key, version),
      listOperations: () => registry.list(),
    }),
    [registry]
  );
}
