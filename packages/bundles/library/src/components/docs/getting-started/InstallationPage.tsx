import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';

export function InstallationPage() {
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
            <li>Node.js 20+ (or Bun 1.0+)</li>
            <li>Existing Next.js app or Bun HTTP server</li>
            <li>PostgreSQL database (for persistence)</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Install Core Libraries</h2>
          <p className="text-muted-foreground">
            Add the contracts runtime and your choice of adapter:
          </p>
          <InstallCommand
            package={[
              '@contractspec/lib.contracts',
              '@contractspec/lib.schema',
            ]}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">For Next.js projects</h2>
          <InstallCommand package="@contractspec/lib.contracts" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">For database models</h2>
          <InstallCommand
            package={[
              '@contractspec/app.cli-database',
              'prisma',
              '@prisma/client',
            ]}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Set up your project</h2>
          <p className="text-muted-foreground">
            Initialize a new ContractSpec project structure:
          </p>
          <CodeBlock
            language="bash"
            code={`bunx contractspec init
# Follow the interactive prompts to configure your project`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Initialize the database</h2>
          <p className="text-muted-foreground">
            If using Prisma, set up your schema and generate the client:
          </p>
          <CodeBlock
            language="bash"
            code={`bunx prisma init
# Edit prisma/schema.prisma with your models
bunx prisma generate
bunx prisma migrate dev --name init`}
          />
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
