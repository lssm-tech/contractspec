'use client';

import Link from 'next/link';
import type { Pack } from '@/lib/registry-api';

interface PackCardProps {
  pack: Pack;
}

export function PackCard({ pack }: PackCardProps) {
  return (
    <Link
      href={`/registry/packs/${pack.name}`}
      className="card-subtle group border-border hover:border-primary/50 flex flex-col rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-foreground group-hover:text-primary font-semibold">
          {pack.displayName}
        </h3>
        {pack.verified && (
          <span className="bg-primary/10 text-primary ml-2 rounded px-1.5 py-0.5 text-xs">
            Verified
          </span>
        )}
      </div>

      <p className="text-muted-foreground mt-1.5 line-clamp-2 flex-1 text-sm">
        {pack.description}
      </p>

      <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
        <span>{pack.downloads.toLocaleString()} downloads</span>
        <span className="text-border">|</span>
        <span>{pack.authorName}</span>
      </div>

      {pack.targets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {pack.targets.slice(0, 4).map((target) => (
            <span
              key={target}
              className="bg-muted/50 text-muted-foreground rounded px-1.5 py-0.5 text-xs"
            >
              {target}
            </span>
          ))}
          {pack.targets.length > 4 && (
            <span className="text-muted-foreground text-xs">
              +{pack.targets.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
