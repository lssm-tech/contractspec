import type { HTMLAttributes } from 'react';
import type { PackageManager } from '../CommandTabs/types';

export type InstallCommandType = 'add' | 'install' | 'create' | 'run' | 'exec';

export interface InstallCommandProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onCopy'
> {
  /** The package name(s) to install */
  package: string | string[];
  /** The type of command (defaults to 'add' for package installation) */
  type?: InstallCommandType;
  /** Whether this is a dev dependency (adds -D flag) */
  dev?: boolean;
  /** Whether this is a global installation (adds -g flag) */
  global?: boolean;
  /** Optional callback when copy succeeds */
  onCopy?: (data: { command: string; packageManager: PackageManager }) => void;
}
