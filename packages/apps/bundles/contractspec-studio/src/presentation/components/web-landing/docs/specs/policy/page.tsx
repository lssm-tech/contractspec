import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Policy: ContractSpec Docs',
//   description:
//     'Learn how to define attribute-based access control and data protection policies in ContractSpec.',
// };

export default function PolicyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Policy</h1>
        <p className="text-muted-foreground">
          A <strong>PolicySpec</strong> defines who can do what, when, and under
          what conditions. ContractSpec uses attribute-based access control
          (ABAC) to enforce policies across your entire application—from API
          endpoints to UI components.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why policies matter</h2>
        <p className="text-muted-foreground">
          Traditional access control relies on roles (RBAC), which can become
          unwieldy as applications grow. ABAC is more flexible—it evaluates
          policies based on attributes of the user, resource, action, and
          context.
        </p>
        <p className="text-muted-foreground">
          ContractSpec's policy engine ensures that access control is consistent
          across all surfaces. You don't have to remember to add authorization
          checks in every API endpoint or UI component—the{' '}
          <Link
            href="/docs/safety/pdp"
            className="text-violet-400 hover:text-violet-300"
          >
            Policy Decision Point
          </Link>{' '}
          enforces policies automatically.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Policy structure</h2>
        <p className="text-muted-foreground">
          A PolicySpec contains one or more rules. Each rule has:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Effect</strong> – PERMIT, DENY, or REDACT
          </li>
          <li>
            <strong>Condition</strong> – A boolean expression that determines
            when the rule applies
          </li>
          <li>
            <strong>Scope</strong> – Which resources, actions, or fields the
            rule applies to
          </li>
          <li>
            <strong>Priority</strong> – Rules are evaluated in priority order;
            the first matching rule wins
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example PolicySpec</h2>
        <p className="text-muted-foreground">
          Here's a policy that controls access to customer data in TypeScript:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { definePolicy } from '@lssm/lib.contracts';

export const CustomerDataAccess = definePolicy({
  meta: {
    name: 'customer.data.access',
    version: 1,
  },
  rules: [
    {
      id: 'admin-full-access',
      priority: 100,
      effect: 'PERMIT',
      condition: (ctx) => ctx.user.role === 'admin',
      scope: {
        resources: ['customer'],
        actions: ['read', 'write', 'delete'],
      },
    },
    {
      id: 'sales-read-assigned',
      priority: 200,
      effect: 'PERMIT',
      condition: (ctx) => 
        ctx.user.role === 'sales' && 
        ctx.resource.assignedTo === ctx.user.id,
      scope: {
        resources: ['customer'],
        actions: ['read', 'write'],
      },
    },
    {
      id: 'support-read-redacted',
      priority: 300,
      effect: 'REDACT',
      condition: (ctx) => ctx.user.role === 'support',
      scope: {
        resources: ['customer'],
        actions: ['read'],
      },
      redactFields: ['creditCard', 'ssn', 'bankAccount'],
    },
  ],
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Attributes</h2>
        <p className="text-muted-foreground">
          Policy conditions can reference attributes from four categories:
        </p>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">User attributes</h3>
            <p className="text-muted-foreground">
              <code className="bg-background/50 rounded px-2 py-1">
                user.id
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                user.role
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                user.groups
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                user.department
              </code>
              , custom attributes
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Resource attributes</h3>
            <p className="text-muted-foreground">
              <code className="bg-background/50 rounded px-2 py-1">
                resource.type
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                resource.owner
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                resource.sensitivity
              </code>
              , custom attributes
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Action attributes</h3>
            <p className="text-muted-foreground">
              <code className="bg-background/50 rounded px-2 py-1">action</code>{' '}
              (read, write, delete, execute, export, etc.)
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Context attributes</h3>
            <p className="text-muted-foreground">
              <code className="bg-background/50 rounded px-2 py-1">
                time.hour
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                time.dayOfWeek
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                request.ipAddress
              </code>
              ,{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                request.userAgent
              </code>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Data classification</h2>
        <p className="text-muted-foreground">
          You can tag fields with sensitivity levels in your{' '}
          <Link
            href="/docs/specs/capabilities"
            className="text-violet-400 hover:text-violet-300"
          >
            CapabilitySpecs
          </Link>{' '}
          and{' '}
          <Link
            href="/docs/specs/dataviews"
            className="text-violet-400 hover:text-violet-300"
          >
            DataViewSpecs
          </Link>
          :
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`fields:
  - name: email
    type: string
    sensitivity: PII
  - name: creditCard
    type: string
    sensitivity: PII
    encrypted: true
  - name: diagnosis
    type: string
    sensitivity: PHI
  - name: salary
    type: number
    sensitivity: confidential`}</pre>
        </div>
        <p className="text-muted-foreground">
          Policies can then reference these tags to enforce blanket rules like
          "support staff cannot see PII" or "PHI can only be accessed from
          approved IP addresses."
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Testing policies</h2>
        <p className="text-muted-foreground">
          ContractSpec provides tools for testing policies before deployment:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Policy simulator</strong> – Test how policies evaluate for
            different users and scenarios
          </li>
          <li>
            <strong>Coverage analysis</strong> – Identify resources or actions
            that aren't covered by any policy
          </li>
          <li>
            <strong>Conflict detection</strong> – Find rules that might conflict
            or produce unexpected results
          </li>
          <li>
            <strong>Audit mode</strong> – Run policies in audit-only mode to see
            what would be blocked without actually blocking it
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Start with a deny-by-default policy—explicitly permit what should be
            allowed.
          </li>
          <li>
            Use clear, descriptive rule IDs that explain what the rule does.
          </li>
          <li>
            Set priorities carefully to ensure rules are evaluated in the right
            order.
          </li>
          <li>
            Test policies thoroughly with realistic user scenarios before
            deploying.
          </li>
          <li>
            Monitor policy decisions in production using{' '}
            <Link
              href="/docs/safety/auditing"
              className="text-violet-400 hover:text-violet-300"
            >
              audit logs
            </Link>
            .
          </li>
          <li>
            Review and update policies regularly as your application and
            requirements evolve.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/specs/workflows" className="btn-ghost">
          Previous: Workflows
        </Link>
        <Link href="/docs/specs/overlays" className="btn-primary">
          Next: Overlays <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
