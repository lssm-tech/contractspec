'use client';

import Link from 'next/link';
import type { Pack } from '@/lib/registry-api';

interface PackCardProps {
  pack: Pack;
}

/** Render filled/empty stars for a rating (1-5 scale). */
function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={
          i <= Math.round(rating)
            ? 'text-yellow-500'
            : 'text-muted-foreground/30'
        }
      >
        ★
      </span>
    );
  }
  return <span className="text-xs">{stars}</span>;
}

/** Quality badge based on score. */
function QualityBadge({ score }: { score: number }) {
  const badge =
    score >= 80
      ? { label: 'Excellent', cls: 'bg-green-500/10 text-green-500' }
      : score >= 60
        ? { label: 'Good', cls: 'bg-blue-500/10 text-blue-500' }
        : score >= 40
          ? { label: 'Fair', cls: 'bg-yellow-500/10 text-yellow-600' }
          : { label: 'Needs Work', cls: 'bg-red-500/10 text-red-500' };

  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${badge.cls}`}>
      {badge.label}
    </span>
  );
}

export function PackCard({ pack }: PackCardProps) {
  const displayRating =
    pack.averageRating != null ? pack.averageRating / 10 : null;

  return (
    <Link
      href={`/registry/packs/${pack.name}`}
      className="card-subtle group border-border hover:border-primary/50 flex flex-col rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-foreground group-hover:text-primary font-semibold">
          {pack.displayName}
        </h3>
        <div className="ml-2 flex items-center gap-1.5">
          {pack.verified && (
            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs">
              Verified
            </span>
          )}
          {pack.qualityScore != null && (
            <QualityBadge score={pack.qualityScore} />
          )}
        </div>
      </div>

      <p className="text-muted-foreground mt-1.5 line-clamp-2 flex-1 text-sm">
        {pack.description}
      </p>

      <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
        <span>{pack.downloads.toLocaleString()} downloads</span>
        <span className="text-border">|</span>
        <span>{pack.authorName}</span>
        {displayRating !== null && (
          <>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1">
              <StarRating rating={displayRating} />
              <span>({pack.reviewCount ?? 0})</span>
            </span>
          </>
        )}
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
