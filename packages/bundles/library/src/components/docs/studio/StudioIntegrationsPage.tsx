import Link from '@contractspec/lib.ui-link';

export function StudioIntegrationsPage() {
  return (
    <main className="space-y-6 py-12">
      <h1 className="text-3xl font-bold">Studio docs moved</h1>
      <p className="text-muted-foreground text-sm">
        Integration guides now live in the Studio app docs.
      </p>
      <Link href="https://www.contractspec.studio/docs" className="btn-primary">
        Open Studio docs
      </Link>
    </main>
  );
}
