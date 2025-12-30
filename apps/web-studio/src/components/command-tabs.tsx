"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { CopyButton } from "./copy-button";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

interface CommandTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  commands: Partial<Record<PackageManager, string>>;
  initialPreference?: PackageManager;
}

export function CommandTabs({
  commands,
  initialPreference = "npm",
  className,
  ...props
}: CommandTabsProps) {
  const [selected, setSelected] = React.useState<PackageManager>(() => {
    // Ideally check local storage here in useEffect, but for SSR safety start with prop
    return initialPreference;
  });

  // Hydrate preference from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("package-manager-preference") as PackageManager;
    if (saved && commands[saved]) {
      setSelected(saved);
    }
  }, [commands]);

  const handleSelect = (pm: PackageManager) => {
    setSelected(pm);
    localStorage.setItem("package-manager-preference", pm);
  };

  const currentCommand = commands[selected];
  const packageManagers = Object.keys(commands) as PackageManager[];

  if (!currentCommand) return null;

  return (
    <div className={cn("relative rounded-lg border bg-zinc-950 dark:border-zinc-800", className)} {...props}>
      <div className="flex items-center border-b border-zinc-800 bg-zinc-900/50 px-2 pt-2">
        {packageManagers.map((pm) => (
          <button
            key={pm}
            onClick={() => handleSelect(pm)}
            className={cn(
              "rounded-t-md border-t border-l border-r border-transparent px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-100",
              selected === pm &&
                "border-zinc-800 bg-zinc-950 text-zinc-100"
            )}
          >
            {pm}
          </button>
        ))}
      </div>
      <div className="relative p-4">
        <CopyButton value={currentCommand} className="absolute right-4 top-4" />
        <pre className="overflow-x-auto text-[13px] leading-6 font-mono text-white">
          <code>{currentCommand}</code>
        </pre>
      </div>
    </div>
  );
}
