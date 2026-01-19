'use client';

import { cn } from '../../../lib/utils';
import { useEffect, useState } from 'react';
import { CopyButton } from '../CopyButton';
import { usePackageManager } from '../../providers/PackageManagerProvider';
import type { CommandTabsProps, PackageManager } from './types';

const STORAGE_KEY = 'package-manager-preference';

export function CommandTabs({
  commands,
  initialPreference = 'bun',
  className,
  onCopy,
  ...props
}: CommandTabsProps) {
  const context = usePackageManager();

  const [localSelected, setLocalSelected] = useState<PackageManager>(() => {
    return initialPreference;
  });

  // Use context if available, otherwise use local state
  const selected = context?.preference ?? localSelected;
  const setSelected = context?.setPreference ?? setLocalSelected;

  // Hydrate preference from localStorage (only if not using context)
  useEffect(() => {
    if (context) return; // Context handles its own persistence

    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PackageManager | null;
      if (saved && commands[saved]) {
        setLocalSelected(saved);
      }
    } catch {
      // localStorage not available
    }
  }, [commands, context]);

  const handleSelect = (pm: PackageManager) => {
    setSelected(pm);

    // Only persist locally if not using context
    if (!context) {
      try {
        localStorage.setItem(STORAGE_KEY, pm);
      } catch {
        // localStorage not available
      }
    }
  };

  // Get available package managers from commands
  const packageManagers = Object.keys(commands) as PackageManager[];

  // Early return if no commands available
  if (packageManagers.length === 0) return null;

  // Use selected if available, otherwise fallback to first available
  const effectiveSelected = commands[selected] ? selected : packageManagers[0];
  if (!effectiveSelected) return null;
  const currentCommand = commands[effectiveSelected];
  if (!currentCommand) return null;

  const handleCopy = () => {
    onCopy?.({
      command: currentCommand,
      packageManager: effectiveSelected,
    });
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border border-zinc-800 bg-zinc-950',
        className
      )}
      {...props}
    >
      <div
        className="flex items-center border-b border-zinc-800 bg-zinc-900/50 px-2 pt-2"
        role="tablist"
        aria-label="Package manager selection"
      >
        {packageManagers.map((pm) => (
          <button
            key={pm}
            type="button"
            role="tab"
            aria-selected={effectiveSelected === pm}
            onClick={() => handleSelect(pm)}
            className={cn(
              'rounded-t-md border-t border-r border-l border-transparent px-4 py-2 text-xs font-medium text-zinc-400',
              'transition-colors hover:text-zinc-100',
              'focus:ring-2 focus:ring-zinc-600 focus:ring-offset-1 focus:ring-offset-zinc-900 focus:outline-none',
              effectiveSelected === pm &&
                'border-zinc-800 bg-zinc-950 text-zinc-100'
            )}
          >
            {pm}
          </button>
        ))}
      </div>
      <div className="relative p-4" role="tabpanel">
        <CopyButton
          value={currentCommand}
          className="absolute top-3 right-3"
          onCopy={handleCopy}
        />
        <pre className="overflow-x-auto pr-10 font-mono text-[13px] leading-6 text-white">
          <code>{currentCommand}</code>
        </pre>
      </div>
    </div>
  );
}
