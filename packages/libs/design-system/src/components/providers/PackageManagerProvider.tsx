'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type {
  PackageManager,
  PackageManagerContextValue,
} from '../molecules/CommandTabs/types';

const STORAGE_KEY = 'package-manager-preference';

const PackageManagerContext = createContext<PackageManagerContextValue | null>(
  null
);

export interface PackageManagerProviderProps {
  children: ReactNode;
  /** Default package manager preference */
  defaultPreference?: PackageManager;
}

/**
 * Provider for sharing package manager preference across CommandTabs components.
 * Wrap your documentation layout with this provider to sync preference across all instances.
 */
export function PackageManagerProvider({
  children,
  defaultPreference = 'bun',
}: PackageManagerProviderProps) {
  const [preference, setPreferenceState] =
    useState<PackageManager>(defaultPreference);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PackageManager | null;
      if (saved && ['bun', 'npm', 'yarn', 'pnpm'].includes(saved)) {
        setPreferenceState(saved);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setPreference = useCallback((pm: PackageManager) => {
    setPreferenceState(pm);
    try {
      localStorage.setItem(STORAGE_KEY, pm);
    } catch {
      // localStorage not available
    }
  }, []);

  return (
    <PackageManagerContext.Provider value={{ preference, setPreference }}>
      {children}
    </PackageManagerContext.Provider>
  );
}

/**
 * Hook to access the package manager preference.
 * Returns null if not wrapped in a PackageManagerProvider (components will use local state).
 */
export function usePackageManager(): PackageManagerContextValue | null {
  return useContext(PackageManagerContext);
}
