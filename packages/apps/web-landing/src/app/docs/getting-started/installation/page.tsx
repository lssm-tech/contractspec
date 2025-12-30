import { CodeBlock } from '@/components/code-block';
import { CommandTabs } from '@/components/command-tabs';
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
          <div className="space-y-4">
            <CommandTabs
              commands={{
                npm: 'npm install @contractspec/lib.contracts @contractspec/lib.schema',
                pnpm: 'pnpm add @contractspec/lib.contracts @contractspec/lib.schema',
                yarn: 'yarn add @contractspec/lib.contracts @contractspec/lib.schema',
                bun: 'bun add @contractspec/lib.contracts @contractspec/lib.schema',
              }}
            />
            <p className="text-muted-foreground text-sm">
              For Next.js projects:
            </p>
            <CommandTabs
              commands={{
                npm: 'npm install @contractspec/lib.contracts',
                pnpm: 'pnpm add @contractspec/lib.contracts',
                yarn: 'yarn add @contractspec/lib.contracts',
                bun: 'bun add @contractspec/lib.contracts',
              }}
            />
            <p className="text-muted-foreground text-sm">
              For database models:
            </p>
            <CommandTabs
              commands={{
                npm: 'npm install @contractspec/app.cli-database prisma @prisma/client',
                pnpm: 'pnpm add @contractspec/app.cli-database prisma @prisma/client',
                yarn: 'yarn add @contractspec/app.cli-database prisma @prisma/client',
                bun: 'bun add @contractspec/app.cli-database prisma @prisma/client',
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Set up your project structure</h2>
          <p className="text-muted-foreground">
            Create directories for your specs and implementations:
          </p>
          <CodeBlock
            language="bash"
            code={`mkdir -p lib/specs
mkdir -p lib/registry
mkdir -p app/api/ops`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Initialize the database</h2>
          <p className="text-muted-foreground">
            If using Prisma, set up your schema and generate the client:
          </p>
          <CommandTabs
            commands={{
              bun: `bunx prisma init
# Edit prisma/schema.prisma with your models
bunx prisma generate
bunx prisma migrate dev --name init`,
              npm: `npx prisma init
# Edit prisma/schema.prisma with your models
npx prisma generate
npx prisma migrate dev --name init`,
              pnpm: `pnpm dlx prisma init
# Edit prisma/schema.prisma with your models
pnpm dlx prisma generate
pnpm dlx prisma migrate dev --name init`,
              yarn: `yarn dlx prisma init
# Edit prisma/schema.prisma with your models
yarn dlx prisma generate
yarn dlx prisma migrate dev --name init`,
            }}
            initialPreference="bun"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Developer Tools (Optional)</h2>
          <p className="text-muted-foreground">
            Enhance your workflow with the ContractSpec CLI and VS Code
            extension:
          </p>
          <div className="space-y-4">
            <CommandTabs
              commands={{
                bun: 'bun add -D @contractspec/app.cli-contractspec',
                npm: 'npm install -D @contractspec/app.cli-contractspec',
                pnpm: 'pnpm add -D @contractspec/app.cli-contractspec',
                yarn: 'yarn add -D @contractspec/app.cli-contractspec',
              }}
              initialPreference="bun"
            />
            <p className="text-muted-foreground text-sm">VS Code Extension:</p>
            <CodeBlock
              language="bash"
              code="code --install-extension lssm.vscode-contractspec"
            />
          </div>
          <p className="text-muted-foreground text-sm">
            See{' '}
            <a
              href="/docs/getting-started/tools"
              className="text-violet-400 hover:underline"
            >
              Developer Tools
            </a>{' '}
            for more details.
          </p>
        </div>

        <div className="card-subtle space-y-4 p-6">
          <h3 className="font-bold">Specs Are Pure TypeScript</h3>
          <p className="text-muted-foreground text-sm">
            ContractSpec specs are TypeScript modules served by runtime
            adapters. There&apos;s no mandatory compilation step—just import
            your specs and pass them to <code>makeNextAppHandler</code> or
            <code>makeElysiaHandler</code>. The CLI and VS Code extension are
            optional productivity tools.
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
