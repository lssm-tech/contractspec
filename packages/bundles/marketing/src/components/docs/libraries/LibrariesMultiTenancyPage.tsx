// export const metadata: Metadata = {
//   title: 'Multi-Tenancy Library | ContractSpec',
//   description: 'Utilities for RLS, provisioning, and isolation.',
// };

export function LibrariesMultiTenancyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Multi-Tenancy Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@contractspec/lib.multi-tenancy</code> library provides the
          core building blocks for secure SaaS applications.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Prisma RLS Middleware</h2>
        <p>
          Automatically injects <code>tenantId</code> into all queries.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { createRlsMiddleware } from '@contractspec/lib.multi-tenancy/rls';
import { prisma } from './db';
import { getTenantId } from './context';

prisma.$use(createRlsMiddleware(() => getTenantId()));`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Provisioning Service</h2>
        <p>
          Automates the creation of new tenants, including database setup and
          default user creation.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { TenantProvisioningService } from '@contractspec/lib.multi-tenancy/provisioning';

const service = new TenantProvisioningService({ db: prisma });
await service.provision({
  id: 'acme',
  name: 'Acme Corp',
  slug: 'acme',
  ownerEmail: 'admin@acme.com'
});`}
        </pre>
      </div>
    </div>
  );
}
