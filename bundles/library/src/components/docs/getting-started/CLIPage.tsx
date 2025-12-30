import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'CLI Reference: ContractSpec Docs',
//   description: 'Complete reference for the ContractSpec CLI commands.',
// };

export function CLIPage() {
  const commands = [
    {
      name: 'prisma',
      description: 'Standard Prisma CLI for database management',
      usage: 'bunx prisma <command>',
      examples: [
        'bunx prisma generate           # Generate client from schema',
        'bunx prisma migrate dev         # Create and apply migration',
        'bunx prisma migrate deploy      # Apply migrations in production',
        'bunx prisma db seed             # Run seed script',
        'bunx prisma studio              # Open database GUI',
      ],
    },
    {
      name: 'Custom database scripts',
      description:
        'Project-specific database helpers (if using @contractspec/app.cli-database)',
      usage: 'bun database <command>',
      examples: [
        'bun database generate          # Wrapper for prisma generate',
        'bun database migrate:dev       # Dev migrations with extras',
        'bun database seed              # Custom seeding logic',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Database & Development Tools</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec has no proprietary CLI. Use standard tools like Prisma,
          tsc, and your build system. Specs are pure TypeScript served at
          runtime.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card-subtle space-y-4 p-6">
          <h3 className="font-bold">No Code Generation Required</h3>
          <p className="text-muted-foreground text-sm">
            Unlike GraphQL or gRPC, ContractSpec specs are TypeScript modules
            that get imported directly. There's no compilation step, no codegen,
            no CLI to install. Just write your spec, register it, and serve it
            with an adapter like <code>makeNextAppHandler</code>.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Database Management</h2>
          <p className="text-muted-foreground">
            Use Prisma CLI directly for all database operations:
          </p>
          {commands.map((cmd, i) => (
            <div key={i} className="card-subtle space-y-3 p-6">
              <h3 className="text-lg font-bold">{cmd.name}</h3>
              <p className="text-muted-foreground text-sm">{cmd.description}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Usage:
                  </p>
                  <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-sm">
                    <pre>{cmd.usage}</pre>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Common commands:
                  </p>
                  <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded border p-3 font-mono text-sm">
                    <pre>{cmd.examples.join('\n')}</pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Development Workflow</h2>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`# 1. Start your dev server (Next.js, Bun, etc.)
npm run dev

# 2. Make database schema changes
# Edit prisma/schema.prisma

# 3. Apply migrations
bunx prisma migrate dev --name add_user_roles

# 4. Write specs and handlers in TypeScript
# No CLI needed—just import and register

# 5. Test your operations
curl -X POST http://localhost:3000/api/ops/billing.capturePayment \\
  -H "Content-Type: application/json" \\
  -d '{"invoiceId": "inv_123", "amount": 99.99}'`}</pre>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/specs/capabilities" className="btn-primary">
          Next: Capabilities <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
