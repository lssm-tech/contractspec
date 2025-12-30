// export const metadata: Metadata = {
//   title: 'Multi-Tenancy Architecture | ContractSpec',
//   description:
//     'Learn how ContractSpec handles data isolation and tenant management.',
// };

export default function MultiTenancyArchitecturePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Multi-Tenancy Architecture</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec is designed for B2B SaaS applications where data
          isolation is critical. We support multiple isolation strategies
          ranging from logical separation (RLS) to physical separation
          (database-per-tenant).
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Row-Level Security (RLS)</h2>
        <p>
          By default, ContractSpec uses logical isolation via Row-Level
          Security. Every database query is intercepted by middleware that
          injects the current <code>tenantId</code> into the <code>WHERE</code>{' '}
          clause.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`// User code
await db.users.findMany({});

// Actual query executed
SELECT * FROM "User" WHERE "tenantId" = 'current-tenant-id';`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tenant Context</h2>
        <p>
          The tenant context is resolved at the API layer (e.g., from a
          subdomain or header) and propagated through the{' '}
          <code>WorkflowRunner</code> and
          <code>OperationExecutor</code>.
        </p>
      </div>
    </div>
  );
}
