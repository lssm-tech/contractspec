import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Spec Signing: ContractSpec Docs',
  description: 'Learn how spec signing ensures security and auditability.',
};

export default function SigningPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Spec Signing</h1>
        <p className="text-muted-foreground text-lg">
          Signing ensures specs haven't been tampered with and provides an audit
          trail of all changes.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">How it works</h2>
          <p className="text-muted-foreground">
            Every spec is cryptographically signed before deployment. The
            signature proves that the spec hasn't been modified since it was
            signed and creates a permanent record of who deployed it and when.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Signing a spec</h2>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`contractspec sign app.spec.ts --key ~/.contractspec/key.pem
contractspec deploy --signed app.spec.ts.signed`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Verifying signatures</h2>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`contractspec verify app.spec.ts.signed
# Output: ✓ Signature valid
# Signed by: alice@example.com
# Timestamp: 2024-11-08T10:30:00Z`}</pre>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Link href="/docs/safety/pdp" className="btn-primary">
            Next: Policy Decision Points <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
