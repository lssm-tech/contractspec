import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPack, getPackVersion } from '@/lib/registry-api';

interface PageProps {
  params: Promise<{ name: string; version: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name, version } = await params;
  const pack = await getPack(name);
  return {
    title: pack
      ? `${pack.displayName} v${version} | agentpacks Registry`
      : 'Version Not Found',
    description: pack?.description,
  };
}

export default async function VersionDetailPage({ params }: PageProps) {
  const { name, version } = await params;
  const [pack, versionData] = await Promise.all([
    getPack(name),
    getPackVersion(name, version),
  ]);

  if (!pack || !versionData) notFound();

  const manifest = versionData.manifest ?? {};

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-muted-foreground mb-6 text-sm">
          <Link href="/registry/packs" className="hover:text-primary">
            Packs
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/registry/packs/${name}`} className="hover:text-primary">
            {pack.displayName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">v{version}</span>
        </nav>

        {/* Header */}
        <h1 className="mb-2 text-3xl font-bold">
          {pack.displayName}{' '}
          <span className="text-primary font-mono">v{version}</span>
        </h1>
        <p className="text-muted-foreground mb-6">{pack.description}</p>

        {/* Version metadata */}
        <div className="border-border mb-8 grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-4">
          <div>
            <span className="text-muted-foreground text-xs uppercase">
              Published
            </span>
            <p className="text-sm font-medium">
              {new Date(versionData.createdAt).toLocaleDateString()}
            </p>
          </div>
          {versionData.fileSize && (
            <div>
              <span className="text-muted-foreground text-xs uppercase">
                Size
              </span>
              <p className="text-sm font-medium">
                {(versionData.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground text-xs uppercase">
              License
            </span>
            <p className="text-sm font-medium">{pack.license}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs uppercase">
              Author
            </span>
            <p className="text-sm font-medium">{pack.authorName}</p>
          </div>
        </div>

        {/* Manifest */}
        {Object.keys(manifest).length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Manifest</h2>
            <div className="border-border bg-muted/20 rounded-lg border p-4">
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(manifest, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Changelog */}
        {versionData.changelog && (
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Changelog</h2>
            <div className="prose prose-invert border-border max-w-none rounded-lg border p-6">
              <pre className="text-sm whitespace-pre-wrap">
                {versionData.changelog}
              </pre>
            </div>
          </div>
        )}

        {/* Back link */}
        <Link
          href={`/registry/packs/${name}`}
          className="text-primary text-sm hover:underline"
        >
          ← Back to {pack.displayName}
        </Link>
      </div>
    </div>
  );
}
