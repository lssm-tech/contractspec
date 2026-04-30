import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function KnowledgeGovernancePage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Knowledge mutation governance</h1>
				<p className="text-muted-foreground">
					Provider-backed knowledge is not read-only forever. Email sends, Drive
					permission changes, tombstone handling, replay repairs, and source
					metadata updates all need explicit governance before they mutate an
					external system.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="card-subtle space-y-2 p-4">
					<h2 className="font-semibold text-lg">Fail closed</h2>
					<p className="text-muted-foreground text-sm">
						Non-dry-run mutations require an idempotency key and audit evidence.
						Approval-required operations need approval refs. Outbound sends also
						need an approved send gate.
					</p>
				</div>
				<div className="card-subtle space-y-2 p-4">
					<h2 className="font-semibold text-lg">Leave evidence</h2>
					<p className="text-muted-foreground text-sm">
						Every evaluation returns an audit envelope with status, missing
						evidence, idempotency, approval refs, and the decision timestamp.
					</p>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Runtime gate</h2>
				<CodeBlock
					language="typescript"
					filename="knowledge-governance.ts"
					code={`const result = await executeGovernedKnowledgeMutation(
  {
    operation: "drive.permission.update",
    sourceId: "src_drive_support",
    requiresApproval: true,
    governance: {
      idempotencyKey: "tenant:drive-permission:123",
      auditEvidence: { evidenceRef: "audit://drive/permission/123" },
      approvalRefs: [{ id: "approval-123" }],
    },
  },
  () => drive.updatePermission(input),
  { audit: (envelope) => auditTrail.write(envelope) },
);

if (result.status === "blocked") {
  return result.auditEnvelope.requiredEvidence;
}`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">ContractSpec surface</h2>
				<p className="text-muted-foreground">
					Use <code>knowledge.mutation.evaluateGovernance</code> when an app or
					control-plane workflow needs to expose mutation decisions as a
					contracted action. It mirrors the runtime helper and gives Connect,
					ops tools, and review packets one stable contract to reference.
				</p>
				<CodeBlock
					language="typescript"
					filename="knowledge-operation.ts"
					code={`import {
  EvaluateKnowledgeMutationGovernance,
} from "@contractspec/lib.contracts-spec/knowledge/operations";

registry.register(EvaluateKnowledgeMutationGovernance);`}
				/>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/knowledge/sources" className="btn-ghost">
					Knowledge sources
				</Link>
				<Link
					href="/docs/guides/provider-backed-knowledge"
					className="btn-primary"
				>
					Adoption guide <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
