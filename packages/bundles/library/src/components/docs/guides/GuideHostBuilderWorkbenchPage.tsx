import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const builderCommands = [
	'builder.workspace.bootstrap',
	'builder.channel.receiveInbound',
	'builder.blueprint.generate',
	'builder.plan.compile',
	'builder.preview.create',
	'builder.preview.runHarness',
	'builder.export.prepare',
	'builder.export.approve',
	'builder.export.execute',
];
export function GuideHostBuilderWorkbenchPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">Host the Builder workbench</h1>
				<p className="text-lg text-muted-foreground">
					Use the reusable Builder workbench as the desktop control surface for
					snapshot loading, guided authoring, preview, readiness, export, and
					mobile review handoff.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">What you&apos;ll build</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					<li>A workspace snapshot fetch path.</li>
					<li>A `BuilderWorkbench` host with action callbacks.</li>
					<li>
						Runtime-mode aware preview/export controls plus mobile review links.
					</li>
				</ul>
			</div>
			<div className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						1) Fetch the workspace snapshot
					</h2>
					<p className="text-muted-foreground text-sm">
						The web shell already exposes a query path for the current Builder
						workspace snapshot. Your host should load it first, then refresh it
						after each successful command.
					</p>
					<CodeBlock
						language="typescript"
						filename="builder-workbench-controller.ts"
						code={`export async function fetchBuilderSnapshot(workspaceId: string) {
  const response = await fetch(
    \`/api/operate/builder/queries/builder.workspace.snapshot?workspaceId=\${encodeURIComponent(workspaceId)}\`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Builder workspace snapshot.");
  }
  const payload = await response.json() as {
    ok: boolean;
    result: BuilderWorkspaceSnapshot;
  };
  if (!payload.ok) {
    throw new Error("Builder workspace snapshot query returned an error.");
  }
  return payload.result;
}`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: one `BuilderWorkspaceSnapshot` containing
						workspace, plan, providers, runtime targets, preview, export, and
						mobile review state.
					</p>
				</div>
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						2) Host the workbench and refresh on action
					</h2>
					<p className="text-muted-foreground text-sm">
						The simplest host pattern is local state plus a small action wrapper
						that executes one Builder command and then refreshes the snapshot.
					</p>
					<CodeBlock
						language="tsx"
						filename="BuilderWorkbenchHost.tsx"
						code={`import {
  BuilderWorkbench,
  useBuilderWorkbenchState,
} from "@contractspec/module.builder-workbench/presentation";

const { snapshot, setSnapshot, promptDraft, setPromptDraft } =
  useBuilderWorkbenchState({
    workspace: initialSnapshot.workspace,
    initialSnapshot,
  });

async function runAction(commandKey: string, payload?: Record<string, unknown>) {
  await executeBuilderCommand({ commandKey, workspaceId, payload });
  setSnapshot(await fetchBuilderSnapshot(workspaceId));
}

<BuilderWorkbench
  snapshot={snapshot}
  promptDraft={promptDraft}
  onPromptDraftChange={setPromptDraft}
  onCapturePrompt={() =>
    runAction("builder.channel.receiveInbound", createPromptEnvelope(workspaceId, promptDraft))
  }
  onGenerateBlueprint={() => runAction("builder.blueprint.generate")}
  onCompilePlan={() => runAction("builder.plan.compile")}
  onCreatePreview={() => runAction("builder.preview.create", { runtimeMode: "hybrid" })}
  onRunReadiness={() => runAction("builder.preview.runHarness")}
  onPrepareExport={() => runAction("builder.export.prepare", { runtimeMode: "hybrid" })}
  onApproveExport={() => runAction("builder.export.approve")}
  onExecuteExport={() => runAction("builder.export.execute")}
  selectedExportRuntimeMode="hybrid"
/>;`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: each successful action leaves the host with a fresh
						snapshot and keeps the workbench tabs aligned with current runtime
						state.
					</p>
				</div>
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						3) Bootstrap providers and routing policy explicitly
					</h2>
					<p className="text-muted-foreground text-sm">
						Builder v3 treats provider routing as policy, not heuristic. Use the
						workspace bootstrap command as the single managed-first setup path
						instead of orchestrating provider registration in the app shell.
					</p>
					<CodeBlock
						language="typescript"
						filename="builder-bootstrap.ts"
						code={`await executeBuilderCommand({
  commandKey: "builder.workspace.bootstrap",
  workspaceId,
  payload: {
    preset: "managed_mvp",
    includeLocalHelperProvider: true,
  },
});`}
					/>
				</div>
				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">Common command keys</h3>
					<ul className="space-y-2 text-muted-foreground text-sm">
						{builderCommands.map((command) => (
							<li key={command}>
								<code>{command}</code>
							</li>
						))}
					</ul>
				</div>
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">4) Keep runtime mode explicit</h2>
					<p className="text-muted-foreground text-sm">
						Preview and export flows are runtime-mode aware. The host chooses
						between `managed`, `local`, and `hybrid` and passes that choice into
						preview or export commands instead of hiding it behind provider
						selection heuristics.
					</p>
					<CodeBlock
						language="typescript"
						filename="runtime-mode"
						code={`const [selectedExportRuntimeMode, setSelectedExportRuntimeMode] =
  React.useState(resolveBuilderExportRuntimeMode(initialSnapshot));

await executeBuilderCommand({
  commandKey: "builder.preview.create",
  workspaceId,
  payload: {
    runtimeMode: selectedExportRuntimeMode,
  },
	});`}
					/>
				</div>
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">5) Link mobile review flows</h2>
					<p className="text-muted-foreground text-sm">
						When a patch proposal, approval ticket, or incident needs operator
						follow-up away from the desktop workbench, deep-link into the mobile
						review route instead of inventing a separate data model.
					</p>
					<CodeBlock
						language="typescript"
						filename="mobile-review-path.ts"
						code={`export function buildBuilderMobileReviewPath(
  workspaceId: string,
  cardId: string
) {
  return \`/operate/builder/workspaces/\${encodeURIComponent(workspaceId)}/mobile-review/\${encodeURIComponent(cardId)}\`;
}`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: the same Builder workspace state stays visible from
						desktop workbench and mobile review surfaces.
					</p>
				</div>
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						6) Keep Connect adjacent, not embedded
					</h2>
					<p className="text-muted-foreground text-sm">
						Builder owns the authoring control plane. When Builder delegates
						into coding repositories, enable Connect in those target workspaces
						for context packs, mutation verification, replay, and review
						packets, but do not replace Builder contracts with Connect
						artifacts.
					</p>
					<CodeBlock
						language="bash"
						filename="connect-init.sh"
						code={`contractspec connect init --scope workspace`}
					/>
				</div>
			</div>
			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/specs/builder-control-plane" className="btn-primary">
					Back to Builder control plane <ChevronRight size={16} />
				</Link>
				<Link href="/docs/studio" className="btn-ghost">
					Studio overview
				</Link>
			</div>
		</div>
	);
}
