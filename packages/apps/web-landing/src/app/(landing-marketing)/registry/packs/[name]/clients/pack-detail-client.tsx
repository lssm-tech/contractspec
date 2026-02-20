'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Pack, PackVersion } from '@/lib/registry-api';

interface PackDetailClientProps {
  pack: Pack;
  readme: string | null;
  versions: PackVersion[];
}

export function PackDetailClient({
  pack,
  readme,
  versions,
}: PackDetailClientProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const installSnippet = `{ "packs": ["registry:${pack.name}"] }`;

  function copyInstall() {
    navigator.clipboard.writeText(installSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-muted-foreground mb-6 text-sm">
          <Link href="/registry/packs" className="hover:text-primary">
            Packs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{pack.displayName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{pack.displayName}</h1>
              {pack.verified && (
                <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                  Verified
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              by {pack.authorName}
            </p>
            <p className="text-muted-foreground mt-3">{pack.description}</p>
          </div>

          {/* Stats card */}
          <div className="card-subtle border-border flex-shrink-0 rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <span className="text-muted-foreground">Downloads</span>
              <span className="font-medium">
                {pack.downloads.toLocaleString()}
              </span>
              <span className="text-muted-foreground">Weekly</span>
              <span className="font-medium">
                {pack.weeklyDownloads.toLocaleString()}
              </span>
              <span className="text-muted-foreground">License</span>
              <span className="font-medium">{pack.license}</span>
            </div>
          </div>
        </div>

        {/* Install snippet */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Install</h2>
          <div className="bg-muted/30 flex items-center gap-2 rounded-lg p-3">
            <code className="text-foreground flex-1 text-sm">
              {installSnippet}
            </code>
            <button
              type="button"
              onClick={copyInstall}
              className="btn-ghost rounded px-2 py-1 text-xs"
            >
              {copiedSnippet ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-8 flex flex-wrap gap-6">
          {pack.tags.length > 0 && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {pack.tags.map((tag) => (
                  <span key={tag} className="badge text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pack.targets.length > 0 && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                Targets
              </h3>
              <div className="flex flex-wrap gap-1">
                {pack.targets.map((target) => (
                  <span
                    key={target}
                    className="bg-muted/50 text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                  >
                    {target}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pack.features.length > 0 && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                Features
              </h3>
              <div className="flex flex-wrap gap-1">
                {pack.features.map((feature) => (
                  <span
                    key={feature}
                    className="bg-muted/50 text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mb-8 flex gap-4 text-sm">
          {pack.homepage && (
            <a
              href={pack.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Homepage
            </a>
          )}
          {pack.repository && (
            <a
              href={pack.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Repository
            </a>
          )}
        </div>

        {/* README */}
        {readme && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">README</h2>
            <div className="prose prose-invert border-border max-w-none rounded-lg border p-6">
              <pre className="text-sm whitespace-pre-wrap">{readme}</pre>
            </div>
          </div>
        )}

        {/* Versions */}
        {versions.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Versions ({versions.length})
            </h2>
            <div className="space-y-2">
              {versions.map((v) => (
                <Link
                  key={v.version}
                  href={`/registry/packs/${pack.name}/versions/${v.version}`}
                  className="border-border hover:border-primary/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                >
                  <div>
                    <span className="font-mono text-sm font-medium">
                      v{v.version}
                    </span>
                    {v.fileSize && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        {(v.fileSize / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
