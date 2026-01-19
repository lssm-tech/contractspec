'use client';

import { useMemo } from 'react';
import { CommandTabs } from '../CommandTabs';
import type { PackageManager } from '../CommandTabs/types';
import type { InstallCommandProps, InstallCommandType } from './types';

function buildCommand(
  pm: PackageManager,
  packageNames: string[],
  type: InstallCommandType,
  dev: boolean,
  global: boolean
): string {
  const packages = packageNames.join(' ');

  // Handle exec/run commands (npx, bunx, etc.)
  if (type === 'exec') {
    switch (pm) {
      case 'bun':
        return `bunx ${packages}`;
      case 'npm':
        return `npx ${packages}`;
      case 'yarn':
        return `yarn dlx ${packages}`;
      case 'pnpm':
        return `pnpm dlx ${packages}`;
    }
  }

  // Handle create commands
  if (type === 'create') {
    switch (pm) {
      case 'bun':
        return `bun create ${packages}`;
      case 'npm':
        return `npm create ${packages}`;
      case 'yarn':
        return `yarn create ${packages}`;
      case 'pnpm':
        return `pnpm create ${packages}`;
    }
  }

  // Handle run commands
  if (type === 'run') {
    switch (pm) {
      case 'bun':
        return `bun run ${packages}`;
      case 'npm':
        return `npm run ${packages}`;
      case 'yarn':
        return `yarn ${packages}`;
      case 'pnpm':
        return `pnpm ${packages}`;
    }
  }

  // Build flags
  const devFlag = dev ? (pm === 'npm' ? '--save-dev' : '-D') : '';
  const globalFlag = global ? '-g' : '';
  const flags = [devFlag, globalFlag].filter(Boolean).join(' ');

  // Handle add/install commands
  switch (pm) {
    case 'bun':
      return `bun add ${packages}${flags ? ` ${flags}` : ''}`;
    case 'npm':
      return `npm install ${packages}${flags ? ` ${flags}` : ''}`;
    case 'yarn':
      return `yarn add ${packages}${flags ? ` ${flags}` : ''}`;
    case 'pnpm':
      return `pnpm add ${packages}${flags ? ` ${flags}` : ''}`;
  }
}

/**
 * Convenience component for displaying package installation commands.
 * Automatically generates the correct command for each package manager.
 *
 * @example
 * ```tsx
 * <InstallCommand package="@contractspec/lib.contracts" />
 * <InstallCommand package={["react", "react-dom"]} />
 * <InstallCommand package="typescript" dev />
 * <InstallCommand package="create-next-app" type="exec" />
 * ```
 */
export function InstallCommand({
  package: packageName,
  type = 'add',
  dev = false,
  global = false,
  onCopy,
  ...props
}: InstallCommandProps) {
  const packageNames = useMemo(
    () => (Array.isArray(packageName) ? packageName : [packageName]),
    [packageName]
  );

  const commands = useMemo(
    () => ({
      bun: buildCommand('bun', packageNames, type, dev, global),
      npm: buildCommand('npm', packageNames, type, dev, global),
      yarn: buildCommand('yarn', packageNames, type, dev, global),
      pnpm: buildCommand('pnpm', packageNames, type, dev, global),
    }),
    [packageNames, type, dev, global]
  );

  return <CommandTabs commands={commands} onCopy={onCopy} {...props} />;
}
