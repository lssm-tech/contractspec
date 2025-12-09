import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Overlay Editor | ContractSpec Docs',
//   description:
//     'Guide to the drag-and-drop overlay editor and signing workflow.',
// };

export default function OverlayEditorPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Overlay Editor</h1>
        <p className="text-muted-foreground text-lg">
          A Next.js app (`@lssm/app.overlay-editor`) that lets tenant admins
          tweak field visibility, labels, and ordering, then sign OverlaySpecs.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Features</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Toggle visibility and rename labels without touching code.</li>
          <li>Move fields up/down to define the overlay order.</li>
          <li>Preview JSON output powered by `@lssm/lib.overlay-engine`.</li>
          <li>Server action for PEM signing (Ed25519/RSA-PSS).</li>
        </ul>
        <p>
          Project path: <code>packages/apps/overlay-editor</code>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Provisioning flow</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Clone the repo and run <code>bun dev</code> inside the app.
          </li>
          <li>Use the UI to craft the overlay for a tenant.</li>
          <li>
            Paste the tenant&apos;s PEM private key (stored in Vault/KMS).
          </li>
          <li>Click “Sign overlay” to get the final JSON payload.</li>
          <li>
            Persist in the `Overlay` table and register with `OverlayRegistry`.
          </li>
        </ol>
        <p>
          See also:{' '}
          <Link
            href="/docs/ops/tenant-customization"
            className="text-violet-400 underline"
          >
            Tenant customization runbook
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
