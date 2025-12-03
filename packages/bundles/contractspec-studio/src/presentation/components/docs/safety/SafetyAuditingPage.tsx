import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Audit Logs: ContractSpec Docs',
//   description:
//     'Learn how ContractSpec captures and stores audit logs for accountability, security, compliance, and debugging.',
// };

export function SafetyAuditingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">
          An <strong>audit log</strong> (also called an audit trail) is a
          chronological record of system activities. According to{' '}
          <a
            href="https://www.sumologic.com/glossary/audit-log/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300"
          >
            Sumo Logic
          </a>
          , audit logs "provide a detailed record of events and changes within a
          system, enabling organizations to track user actions, system changes,
          and access to sensitive data."
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why audit logs matter</h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Accountability</h3>
            <p className="text-muted-foreground">
              Audit logs answer the question "who did what, when?" This is
              essential for holding users and administrators accountable for
              their actions. If data is deleted or modified, the audit log shows
              exactly who made the change.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Security</h3>
            <p className="text-muted-foreground">
              Audit logs help detect and investigate security incidents. For
              example, if an attacker gains unauthorized access, the logs reveal
              which resources they accessed and what actions they performed.
              This information is critical for incident response and forensics.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Compliance</h3>
            <p className="text-muted-foreground">
              Many regulations (GDPR, HIPAA, SOC 2, PCI DSS) require
              organizations to maintain audit logs. These logs must be
              tamper-evident, retained for a specified period, and available for
              inspection by auditors.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Debugging</h3>
            <p className="text-muted-foreground">
              When something goes wrong in production, audit logs provide a
              detailed timeline of events leading up to the failure. This makes
              it much easier to diagnose and fix issues.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What ContractSpec logs</h2>
        <p className="text-muted-foreground">
          ContractSpec automatically logs every significant operation,
          including:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>API calls</strong> – Every invocation of a capability,
            including inputs, outputs, and the user who made the call.
          </li>
          <li>
            <strong>Policy decisions</strong> – Every decision made by the{' '}
            <Link
              href="/docs/safety/pdp"
              className="text-violet-400 hover:text-violet-300"
            >
              Policy Decision Point
            </Link>
            , including the rule that matched and the reason for the decision.
          </li>
          <li>
            <strong>Data access</strong> – Every query to a data view, including
            which fields were accessed and whether any were redacted.
          </li>
          <li>
            <strong>Workflow execution</strong> – Every step in a workflow,
            including retries, compensations, and failures.
          </li>
          <li>
            <strong>Administrative actions</strong> – Spec deployments,
            configuration changes, user role assignments, and other privileged
            operations.
          </li>
          <li>
            <strong>Authentication events</strong> – Login attempts, password
            resets, and session expirations.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Audit log format</h2>
        <p className="text-muted-foreground">
          Each audit log entry is a structured JSON object containing:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`{
  "timestamp": "2025-11-13T14:32:15.123Z",
  "eventId": "evt_abc123",
  "eventType": "capability.invoked",
  "actor": {
    "userId": "user_xyz789",
    "role": "admin",
    "ipAddress": "203.0.113.42"
  },
  "resource": {
    "type": "capability",
    "id": "transferFunds",
    "version": "1.2.0"
  },
  "action": "execute",
  "result": "success",
  "metadata": {
    "inputs": {
      "recipient": "user_def456",
      "amount": 100.00
    },
    "outputs": {
      "transactionId": "txn_ghi789",
      "timestamp": "2025-11-13T14:32:15.456Z"
    }
  },
  "policyDecision": {
    "decision": "PERMIT",
    "ruleId": "allow-admin-transfers",
    "reason": "User has admin role"
  }
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Storage and retention</h2>
        <p className="text-muted-foreground">
          Audit logs are stored in a tamper-evident append-only log. Once
          written, entries cannot be modified or deleted. This ensures the
          integrity of the audit trail.
        </p>
        <p className="text-muted-foreground">
          ContractSpec supports multiple storage backends:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Local file system</strong> – For development and testing.
          </li>
          <li>
            <strong>Cloud object storage</strong> – S3, GCS, or Azure Blob
            Storage for production.
          </li>
          <li>
            <strong>SIEM integration</strong> – Forward logs to Splunk, Datadog,
            or other security information and event management systems.
          </li>
        </ul>
        <p className="text-muted-foreground">
          You can configure retention policies to automatically archive or
          delete old logs after a specified period (e.g., 7 years for GDPR
          compliance).
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Querying audit logs</h2>
        <p className="text-muted-foreground">
          ContractSpec provides a query API for searching audit logs. You can
          filter by:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Time range</li>
          <li>Event type</li>
          <li>Actor (user ID, role, IP address)</li>
          <li>Resource (capability, data view, workflow)</li>
          <li>Result (success, failure, denied)</li>
        </ul>
        <p className="text-muted-foreground">
          Example query: "Show all failed login attempts from IP address
          203.0.113.42 in the last 24 hours."
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Review logs regularly</strong> – Set up alerts for
            suspicious activity (e.g., repeated failed login attempts,
            unauthorized access attempts).
          </li>
          <li>
            <strong>Protect log access</strong> – Only authorized personnel
            should be able to view audit logs. Use role-based access control to
            restrict access.
          </li>
          <li>
            <strong>Retain logs long enough</strong> – Check your compliance
            requirements and configure retention policies accordingly.
          </li>
          <li>
            <strong>Test log integrity</strong> – Periodically verify that logs
            have not been tampered with by checking cryptographic signatures.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/safety/pdp" className="btn-ghost">
          Previous: Policy Decision Points
        </Link>
        <Link href="/docs/safety/migrations" className="btn-primary">
          Next: Migrations <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
