import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Migrations: ContractSpec Docs',
//   description:
//     'Learn how to manage schema and data migrations safely with MigrationSpec in ContractSpec.',
// };

export function SafetyMigrationsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Migrations</h1>
        <p className="text-muted-foreground">
          A <strong>schema migration</strong> (also called a database migration)
          is a set of incremental, reversible changes to a database schema.
          According to{' '}
          <a
            href="https://en.wikipedia.org/wiki/Schema_migration"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300"
          >
            Wikipedia
          </a>
          , schema migrations "allow the database schema to evolve as the
          application's requirements change, while preserving existing data."
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why migrations matter</h2>
        <p className="text-muted-foreground">
          As your application evolves, you'll need to change your data
          model—adding new fields, renaming tables, changing data types, or
          restructuring relationships. Without a disciplined approach, these
          changes can lead to:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Data loss or corruption</li>
          <li>Downtime during deployments</li>
          <li>
            Inconsistencies between environments (dev, staging, production)
          </li>
          <li>Difficulty rolling back failed changes</li>
        </ul>
        <p className="text-muted-foreground">
          Migrations solve these problems by treating schema changes as
          versioned, tested, and reversible operations.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How MigrationSpec works</h2>
        <p className="text-muted-foreground">
          In ContractSpec, migrations are defined using{' '}
          <strong>MigrationSpec</strong>. Each migration has:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Version</strong> – A unique identifier (e.g.,
            "2025-11-13-001") that determines the order of execution.
          </li>
          <li>
            <strong>Up function</strong> – The forward migration that applies
            the change (e.g., "add column 'email_verified'").
          </li>
          <li>
            <strong>Down function</strong> – The reverse migration that undoes
            the change (e.g., "drop column 'email_verified'").
          </li>
          <li>
            <strong>Dependencies</strong> – Other migrations that must run
            before this one.
          </li>
          <li>
            <strong>Validation</strong> – Optional checks to ensure the
            migration succeeded (e.g., "verify all users have an email
            address").
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example MigrationSpec</h2>
        <p className="text-muted-foreground">
          Here's a migration that adds an email verification field to the users
          table:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`migrationId: add-email-verified
version: 2025-11-13-001
dependencies: []

up:
  - sql: |
      ALTER TABLE users
      ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL;
  - sql: |
      CREATE INDEX idx_users_email_verified
      ON users(email_verified);

down:
  - sql: |
      DROP INDEX idx_users_email_verified;
  - sql: |
      ALTER TABLE users
      DROP COLUMN email_verified;

validation:
  - sql: |
      SELECT COUNT(*) FROM users
      WHERE email_verified IS NULL;
    expectZeroRows: true`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Running migrations</h2>
        <p className="text-muted-foreground">
          Migrations are applied automatically during deployment. The
          ContractSpec runtime:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>
            Checks which migrations have already been applied (stored in a
            migrations table).
          </li>
          <li>Identifies new migrations that need to run.</li>
          <li>Executes them in order, respecting dependencies.</li>
          <li>Runs validation checks to ensure success.</li>
          <li>Records the migration as applied.</li>
        </ol>
        <p className="text-muted-foreground">
          If a migration fails, the deployment is aborted, and the system
          remains in its previous state. You can then fix the migration and
          redeploy.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Rolling back migrations</h2>
        <p className="text-muted-foreground">
          If you need to roll back a deployment, ContractSpec automatically runs
          the <strong>down</strong> functions of any migrations that were
          applied. This restores the database to its previous state.
        </p>
        <p className="text-muted-foreground">
          Note that rollbacks are not always possible—for example, if you've
          deleted a column, you cannot recover the data unless you have a
          backup. For destructive changes, it's best to use a multi-step
          migration:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>Add the new column (reversible).</li>
          <li>
            Backfill data from the old column to the new column (reversible).
          </li>
          <li>Update application code to use the new column (reversible).</li>
          <li>
            Drop the old column (irreversible—only do this after confirming the
            new column works).
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Test migrations locally</strong> – Run them against a copy
            of production data to catch issues before deploying.
          </li>
          <li>
            <strong>Keep migrations small</strong> – Each migration should do
            one thing. This makes them easier to understand and roll back.
          </li>
          <li>
            <strong>Write reversible migrations</strong> – Always provide a down
            function, even if you don't plan to roll back.
          </li>
          <li>
            <strong>Use transactions</strong> – Wrap migrations in database
            transactions so they either fully succeed or fully fail.
          </li>
          <li>
            <strong>Avoid destructive changes</strong> – Prefer additive changes
            (adding columns) over destructive ones (dropping columns). If you
            must delete data, archive it first.
          </li>
          <li>
            <strong>Version your migrations</strong> – Use timestamps or
            sequential numbers to ensure migrations run in the correct order.
          </li>
          <li>
            <strong>Document breaking changes</strong> – If a migration requires
            application code changes, note this in the migration description.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Zero-downtime migrations</h2>
        <p className="text-muted-foreground">
          Some migrations can cause downtime if not handled carefully. For
          example, adding a NOT NULL column to a large table can lock the table
          for minutes. To avoid this, use a multi-step approach:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>Add the column as nullable.</li>
          <li>Backfill the column in batches (without locking the table).</li>
          <li>Add the NOT NULL constraint once all rows are populated.</li>
        </ol>
        <p className="text-muted-foreground">
          ContractSpec's migration system supports this pattern by allowing you
          to split a logical change into multiple versioned migrations.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/safety/auditing" className="btn-ghost">
          Previous: Audit Logs
        </Link>
        <Link href="/docs/advanced/renderers" className="btn-primary">
          Next: Advanced Topics <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
