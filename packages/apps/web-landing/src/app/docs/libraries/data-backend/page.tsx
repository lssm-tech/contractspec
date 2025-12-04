import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Data & Backend Libraries: ContractSpec Docs',
//   description:
//     'Essential backend utilities for database, logging, error handling, and events.',
// };

export default function DataBackendLibrariesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Data & Backend</h1>
        <p className="text-muted-foreground">
          A collection of robust, platform-agnostic libraries for building the
          backend infrastructure of your LSSM applications.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Libraries</h2>

        <div className="space-y-6">
          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/app.cli-database</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Prisma Wrapper & CLI</strong>. Provides a unified way to
              manage database schemas, migrations, and clients. Includes seeders
              and factory patterns for testing.
            </p>
          </div>

          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/lib.bus</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Type-Safe Event Bus</strong>. Decouple your architecture
              with typed events. Supports in-memory dispatch for monoliths and
              can be extended for distributed message queues (Redis, SQS).
            </p>
          </div>

          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/lib.logger</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>High-Performance Logging</strong>. Optimized for Bun and
              structured JSON output. Includes plugins for ElysiaJS to log HTTP
              requests automatically.
            </p>
          </div>

          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/lib.error</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Standardized Errors</strong>. Use `AppError` with standard
              codes (NOT_FOUND, UNAUTHORIZED) to ensure consistent HTTP
              responses and error handling across services.
            </p>
          </div>

          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">@lssm/lib.exporter</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Data Export</strong>. Generate CSV and XML files from your
              data. Platform-agnostic and streaming-friendly.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: Unified Backend Flow</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { logger } from '@lssm/lib.logger';
import { AppError } from '@lssm/lib.error';
import { db } from '@lssm/app.cli-database';
import { EventBus } from '@lssm/lib.bus';

export async function createUser(email: string) {
  logger.info({ email }, 'Creating user');

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('User already exists', 'CONFLICT');
  }

  const user = await db.user.create({ data: { email } });
  
  await EventBus.publish('user.created', { userId: user.id });
  
  return user;
}`}</pre>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/runtime" className="btn-primary">
          Next: Runtime <ChevronRight size={16} />
        </Link>
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
      </div>
    </div>
  );
}
