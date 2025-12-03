import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Safety Overview: ContractSpec Docs',
//   description:
//     "Learn about ContractSpec's safety features: spec signing, policy decision points, audit logs, migrations, and more.",
// };

export default function SafetyOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Safety Overview</h1>
        <p className="text-muted-foreground">
          ContractSpec is designed with <strong>safety by default</strong>.
          Every operation is governed by policies, every change is audited, and
          every deployment is reversible. This section covers the core safety
          mechanisms that protect your application and data.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core safety features</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              <Link
                href="/docs/safety/signing"
                className="text-violet-400 hover:text-violet-300"
              >
                Spec Signing
              </Link>
            </h3>
            <p className="text-muted-foreground">
              All specifications are cryptographically signed before deployment.
              This ensures that only authorized changes reach production and
              that specs cannot be tampered with in transit or at rest.
              Signatures are verified at runtime, and unsigned specs are
              rejected.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              <Link
                href="/docs/safety/pdp"
                className="text-violet-400 hover:text-violet-300"
              >
                Policy Decision Points (PDP)
              </Link>
            </h3>
            <p className="text-muted-foreground">
              Every API call, UI render, and data access passes through a
              centralized Policy Decision Point. The PDP evaluates
              attribute-based access control (ABAC) rules and PII policies to
              determine whether the operation is allowed. This ensures
              consistent enforcement across your entire application.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              <Link
                href="/docs/safety/auditing"
                className="text-violet-400 hover:text-violet-300"
              >
                Audit Logs
              </Link>
            </h3>
            <p className="text-muted-foreground">
              ContractSpec automatically records every operation in
              tamper-evident audit logs. These logs capture who did what, when,
              and why—including policy decisions, data access, and
              administrative actions. Audit logs are essential for compliance,
              security investigations, and debugging.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              <Link
                href="/docs/safety/migrations"
                className="text-violet-400 hover:text-violet-300"
              >
                Migrations
              </Link>
            </h3>
            <p className="text-muted-foreground">
              Schema and data migrations are managed through{' '}
              <strong>MigrationSpecs</strong>. Each migration is versioned,
              reversible, and tested before deployment. This allows you to
              evolve your application safely without downtime or data loss.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Dark Launch & Rollback</h3>
            <p className="text-muted-foreground">
              New features can be deployed in "dark launch" mode, where they run
              in production but are not visible to users. This allows you to
              test performance and correctness with real traffic before enabling
              the feature. If issues arise, you can instantly roll back to the
              previous version without redeploying.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Data Classification</h3>
            <p className="text-muted-foreground">
              Fields in your specs can be tagged with sensitivity levels (e.g.,
              PII, PHI, confidential). The policy engine uses these tags to
              enforce access controls, redaction rules, and data retention
              policies automatically. This reduces the risk of accidental data
              leaks.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why safety matters</h2>
        <p className="text-muted-foreground">
          Modern applications handle sensitive data and critical operations. A
          single bug or misconfiguration can lead to data breaches, compliance
          violations, or service outages. ContractSpec's safety features are not
          optional add-ons—they are built into the core platform and enforced
          automatically.
        </p>
        <p className="text-muted-foreground">
          By making safety the default, ContractSpec allows you to move fast
          without breaking things. You can deploy new features confidently,
          knowing that policies are enforced, changes are audited, and rollbacks
          are always available.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Next steps</h2>
        <p className="text-muted-foreground">
          Explore each safety feature in detail using the links above, or
          continue with the advanced topics:
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/docs/safety/signing" className="btn-primary">
            Spec Signing <ChevronRight size={16} className="inline" />
          </Link>
          <Link href="/docs/safety/pdp" className="btn-ghost">
            Policy Decision Points <ChevronRight size={16} className="inline" />
          </Link>
          <Link href="/docs/safety/auditing" className="btn-ghost">
            Audit Logs <ChevronRight size={16} className="inline" />
          </Link>
          <Link href="/docs/safety/migrations" className="btn-ghost">
            Migrations <ChevronRight size={16} className="inline" />
          </Link>
        </div>
      </div>
    </div>
  );
}
