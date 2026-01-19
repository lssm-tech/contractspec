import type { HTMLAttributes } from 'react';

export type PackageManager = 'bun' | 'npm' | 'yarn' | 'pnpm';

export interface CommandTabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onCopy'
> {
  /** Commands for each package manager */
  commands: Partial<Record<PackageManager, string>>;
  /** Initial package manager preference (overridden by context if available) */
  initialPreference?: PackageManager;
  /** Optional callback when copy succeeds */
  onCopy?: (data: { command: string; packageManager: PackageManager }) => void;
}

export interface PackageManagerContextValue {
  /** Current package manager preference */
  preference: PackageManager;
  /** Set the package manager preference */
  setPreference: (pm: PackageManager) => void;
}
