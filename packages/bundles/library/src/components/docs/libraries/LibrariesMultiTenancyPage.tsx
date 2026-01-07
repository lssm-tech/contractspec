import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

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
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.multi-tenancy" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Prisma RLS Middleware</h2>
        <p className="text-muted-foreground">
          Automatically injects <code>tenantId</code> into all queries.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { createRlsMiddleware } from '@contractspec/lib.multi-tenancy/rls';
import { prisma } from './db';
import { getTenantId } from './context';

prisma.$use(createRlsMiddleware(() => getTenantId()));`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Provisioning Service</h2>
        <p className="text-muted-foreground">
          Automates the creation of new tenants, including database setup and
          default user creation.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { TenantProvisioningService } from '@contractspec/lib.multi-tenancy/provisioning';

const service = new TenantProvisioningService({ db: prisma });
await service.provision({
  id: 'acme',
  name: 'Acme Corp',
  slug: 'acme',
  ownerEmail: 'admin@acme.com'
});`}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/progressive-delivery" className="btn-primary">
          Next: Progressive Delivery <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
