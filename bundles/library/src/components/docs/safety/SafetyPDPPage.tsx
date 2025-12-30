import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Policy Decision Points: ContractSpec Docs',
//   description:
//     "Learn how ContractSpec's Policy Decision Point (PDP) enforces access control and data protection policies.",
// };

export function SafetyPDPPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Policy Decision Points</h1>
        <p className="text-muted-foreground">
          A <strong>Policy Decision Point (PDP)</strong> is a centralized
          component that evaluates access control policies and makes
          authorization decisions. According to{' '}
          <a
            href="https://www.strongdm.com/blog/policy-decision-point"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300"
          >
            StrongDM
          </a>
          , the PDP "receives requests for access to resources, evaluates them
          against policies, and returns a decision (permit or deny)."
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          How the PDP works in ContractSpec
        </h2>
        <p className="text-muted-foreground">
          In ContractSpec, the PDP is invoked on every operation—whether it's
          rendering a UI component, executing a capability, or querying a data
          view. The flow is:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            <strong>Request evaluation</strong> – The runtime sends a request to
            the PDP containing:
            <ul className="mt-2 ml-6 list-inside list-disc space-y-1">
              <li>
                The user's identity and attributes (roles, groups, location,
                etc.)
              </li>
              <li>
                The resource being accessed (capability, field, workflow step)
              </li>
              <li>The action being performed (read, write, execute)</li>
              <li>
                Contextual information (time of day, device type, IP address)
              </li>
            </ul>
          </li>
          <li>
            <strong>Policy evaluation</strong> – The PDP evaluates the request
            against all applicable <strong>PolicySpecs</strong>. These specs
            define rules using attribute-based access control (ABAC) and can
            reference:
            <ul className="mt-2 ml-6 list-inside list-disc space-y-1">
              <li>User attributes (e.g., "role == 'admin'")</li>
              <li>Resource attributes (e.g., "field.sensitivity == 'PII'")</li>
              <li>
                Environmental attributes (e.g., "time.hour &gt;= 9 AND time.hour
                &lt; 17")
              </li>
            </ul>
          </li>
          <li>
            <strong>Decision return</strong> – The PDP returns one of:
            <ul className="mt-2 ml-6 list-inside list-disc space-y-1">
              <li>
                <code className="bg-background/50 rounded px-2 py-1">
                  PERMIT
                </code>{' '}
                – The operation is allowed.
              </li>
              <li>
                <code className="bg-background/50 rounded px-2 py-1">DENY</code>{' '}
                – The operation is blocked.
              </li>
              <li>
                <code className="bg-background/50 rounded px-2 py-1">
                  REDACT
                </code>{' '}
                – The operation is allowed, but sensitive fields are masked.
              </li>
            </ul>
          </li>
          <li>
            <strong>Enforcement</strong> – The runtime enforces the decision. If
            denied, the operation fails with a clear error message. If redacted,
            sensitive fields are replaced with placeholders.
          </li>
          <li>
            <strong>Auditing</strong> – Every PDP decision is logged to the{' '}
            <Link
              href="/docs/safety/auditing"
              className="text-violet-400 hover:text-violet-300"
            >
              audit log
            </Link>
            , including the request, decision, and reasoning.
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example PolicySpec</h2>
        <p className="text-muted-foreground">
          Here's a simple policy that restricts access to PII fields:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`policyId: pii-access-control
version: '1.0.0'.0.0
rules:
  - id: allow-admin-full-access
    effect: PERMIT
    condition: user.role == 'admin'
    
  - id: redact-pii-for-support
    effect: REDACT
    condition: |
      user.role == 'support' AND
      field.sensitivity == 'PII'
    redactFields: ['ssn', 'creditCard', 'dateOfBirth']
    
  - id: deny-pii-for-others
    effect: DENY
    condition: |
      user.role NOT IN ['admin', 'support'] AND
      field.sensitivity == 'PII'`}</pre>
        </div>
        <p className="text-muted-foreground">
          With this policy, admins see all data, support staff see redacted PII,
          and other users cannot access PII at all.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Benefits of centralized decision-making
        </h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Consistency</strong> – Policies are enforced uniformly
            across all surfaces (API, UI, workflows).
          </li>
          <li>
            <strong>Auditability</strong> – Every decision is logged, making it
            easy to trace why access was granted or denied.
          </li>
          <li>
            <strong>Flexibility</strong> – Policies can be updated without
            changing application code.
          </li>
          <li>
            <strong>Security</strong> – Reduces the risk of authorization bugs
            by removing ad-hoc checks scattered throughout the codebase.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Performance considerations</h2>
        <p className="text-muted-foreground">
          Because the PDP is invoked on every operation, performance is
          critical. ContractSpec optimizes this by:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Caching policy decisions for identical requests</li>
          <li>Compiling policies into efficient bytecode</li>
          <li>
            Evaluating only the minimal set of rules needed for each request
          </li>
          <li>Running the PDP in-process to avoid network latency</li>
        </ul>
        <p className="text-muted-foreground">
          In practice, PDP overhead is typically less than 1ms per request.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/safety/signing" className="btn-ghost">
          Previous: Spec Signing
        </Link>
        <Link href="/docs/safety/auditing" className="btn-primary">
          Next: Audit Logs <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
