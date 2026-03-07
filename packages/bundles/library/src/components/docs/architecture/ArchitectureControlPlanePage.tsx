import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function ArchitectureControlPlanePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Control Plane Runtime</h1>
        <p className="text-muted-foreground">
          The control plane is the governance layer for agentic execution. It
          turns incoming intent into deterministic plans, enforces risk policy
          before side effects, and records replayable traces for audits.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Canonical execution loop</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>Accept intent and create execution identity + trace context.</li>
          <li>Compile intent into a typed, deterministic plan DAG.</li>
          <li>Verify plan against policy and risk rules.</li>
          <li>Route into autonomous or assist mode based on verdict.</li>
          <li>Execute steps with idempotent keys and explicit stage events.</li>
          <li>Persist outcomes for replay, audits, and operator visibility.</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Contract surfaces (v1 baseline)</h2>
        <p className="text-muted-foreground">
          The runtime is contract-first. Commands, queries, events, and
          capabilities are explicit and versioned under
          <code> @contractspec/lib.contracts-spec</code>.
        </p>
        <CodeBlock
          language="text"
          code={`Commands
- controlPlane.intent.submit
- controlPlane.plan.compile
- controlPlane.plan.verify
- controlPlane.execution.start
- controlPlane.execution.approve
- controlPlane.execution.reject
- controlPlane.execution.cancel
- controlPlane.skill.install
- controlPlane.skill.disable

Queries
- controlPlane.execution.get
- controlPlane.execution.list
- controlPlane.trace.get
- controlPlane.policy.explain
- controlPlane.skill.list
- controlPlane.skill.verify

Events
- controlPlane.intent.received
- controlPlane.plan.compiled
- controlPlane.plan.rejected
- controlPlane.execution.step.started
- controlPlane.execution.step.blocked
- controlPlane.execution.step.completed
- controlPlane.execution.completed
- controlPlane.execution.failed
- controlPlane.skill.installed
- controlPlane.skill.rejected

Capabilities
- control-plane.core
- control-plane.approval
- control-plane.audit
- control-plane.skill-registry
- control-plane.channel-runtime`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Policy and safety posture</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            No side-effect action executes unless it comes from a compiled plan.
          </li>
          <li>High-risk actions are blocked from autonomous mode in v1.</li>
          <li>
            Approval commands provide explicit human-in-the-loop transitions.
          </li>
          <li>
            Skill installation is modeled as governance-controlled operations.
          </li>
          <li>
            Trace queries expose policy rationale and step outcomes for replay.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Implementation map</h2>
        <CodeBlock
          language="text"
          code={`packages/libs/contracts-spec/src/control-plane/
  commands/
  queries/
  events/
  capabilities/
  contracts.ts
  contracts.test.ts

packages/apps/web-landing/src/app/docs/architecture/control-plane/page.tsx
implementation_plan_controle_plane.md`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What comes next</h2>
        <p className="text-muted-foreground">
          WS1 delivers the contract fabric. Next increments add planner/executor
          split, policy escalation, capability-bound authorization, signed skill
          compatibility checks, and full replay tooling.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/docs/architecture/integration-binding"
          className="btn-ghost"
        >
          Previous: Integration Binding
        </Link>
        <Link href="/docs/safety/auditing" className="btn-primary">
          Audit Logs <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
