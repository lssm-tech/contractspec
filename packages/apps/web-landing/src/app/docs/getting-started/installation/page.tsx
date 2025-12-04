import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Installation: ContractSpec Docs',
//   description:
//     'Install the ContractSpec CLI and set up your development environment.',
// };

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Installation</h1>
        <p className="text-muted-foreground text-lg">
          Add ContractSpec to your existing Next.js or Bun project, or start
          fresh.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Prerequisites</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>• Node.js 20+ (or Bun 1.0+)</li>
            <li>• Existing Next.js app or Bun HTTP server</li>
            <li>• PostgreSQL database (for persistence)</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Install Core Libraries</h2>
          <p className="text-muted-foreground">
            Add the contracts runtime and your choice of adapter:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`# Core libraries
npm install @lssm/lib.contracts @lssm/lib.schema

# For Next.js projects
npm install @lssm/lib.contracts

# For database models
npm install @lssm/app.cli-database prisma @prisma/client`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Set up your project structure</h2>
          <p className="text-muted-foreground">
            Create directories for your specs and implementations:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`mkdir -p lib/specs
mkdir -p lib/registry
mkdir -p app/api/ops`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Initialize the database</h2>
          <p className="text-muted-foreground">
            If using Prisma, set up your schema and generate the client:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`npx prisma init
# Edit prisma/schema.prisma with your models
npx prisma generate
npx prisma migrate dev --name init`}</pre>
          </div>
        </div>

        <div className="card-subtle space-y-4 p-6">
          <h3 className="font-bold">Why No Global CLI?</h3>
          <p className="text-muted-foreground text-sm">
            ContractSpec specs are pure TypeScript modules served by runtime
            adapters. There's no code generation step or deployment CLI—just
            import your specs and pass them to <code>makeNextAppHandler</code>{' '}
            or
            <code>makeElysiaHandler</code>. Database migrations use standard
            Prisma CLI commands.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Link
            href="/docs/getting-started/hello-world"
            className="btn-primary"
          >
            Next: First Operation <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
