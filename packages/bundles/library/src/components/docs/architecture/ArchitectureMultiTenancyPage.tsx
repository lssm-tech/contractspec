// export const metadata: Metadata = {
//   title: 'Multi-Tenancy Architecture | ContractSpec',
//   description:
//     'Learn how ContractSpec handles data isolation and tenant management.',
// };

import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function ArchitectureMultiTenancyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Multi-Tenancy</h1>
        <p className="text-muted-foreground">
          ContractSpec is designed from the ground up for multi-tenancy. Apps
          built with ContractSpec can serve multiple organizations (tenants) from
          a single deployment, while ensuring strict data isolation and
          configuration separation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core Concepts</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Tenant</strong>: An organization or customer that uses your
            app. Each tenant has a unique <code>tenantId</code>.
          </li>
          <li>
            <strong>Tenant Isolation</strong>: Data and configuration for one
            tenant is never accessible to another tenant unless explicitly
            shared.
          </li>
          <li>
            <strong>Tenant Context</strong>: Every request and operation runs
            within the context of a specific tenant.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tenant Resolution</h2>
        <p className="text-muted-foreground">
          The runtime automatically resolves the tenant context for every
          request based on:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Subdomain (e.g., <code>acme.app.com</code>)</li>
          <li>Custom Domain (e.g., <code>portal.acme.com</code>)</li>
          <li>
            Header (e.g., <code>x-tenant-id: acme-corp</code>)
          </li>
          <li>Authentication Token (embedded tenant claim)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Configuration Isolation</h2>
        <p className="text-muted-foreground">
          Each tenant has its own <code>TenantAppConfig</code> which defines:
        </p>
        <CodeBlock
          language="typescript"
          code={`type TenantAppConfig = {
  tenantId: string;
  blueprintId: string;
  // ...
  integrationBindings: AppIntegrationBinding[];
  knowledgeBindings: AppKnowledgeBinding[];
  featureFlags: Record<string, boolean>;
};`}
        />
        <p className="text-muted-foreground mt-2">
          This allows you to customize feature flags, integration connections,
          and knowledge sources per tenant without changing the application
          code.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/architecture" className="btn-ghost">
          Back to Architecture
        </Link>
        <Link href="/docs/libraries/multi-tenancy" className="btn-primary">
          Multi-Tenancy Library <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
