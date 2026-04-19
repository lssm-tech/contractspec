import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const artifactPaths = [
	'.contractspec/connect/context-pack.json',
	'.contractspec/connect/plan-packet.json',
	'.contractspec/connect/patch-verdict.json',
	'.contractspec/connect/audit.ndjson',
	'.contractspec/connect/decisions/<decisionId>/',
	'.contractspec/adoption/catalog.json',
	'.contractspec/adoption/overrides.json',
];

export function GuideConnectInRepoPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">Use Connect in a repo</h1>
				<p className="text-lg text-muted-foreground">
					Put coding-agent edits and shell commands behind task-scoped context,
					plan compilation, verification, and local review evidence without
					introducing a second control plane.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">What you&apos;ll build</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					<li>A workspace-level Connect config in `.contractsrc.json`.</li>
					<li>A reuse-first adoption check before new implementation work.</li>
					<li>A context and plan flow for one task.</li>
					<li>
						Verified file and shell mutations with local review/replay evidence.
					</li>
				</ul>
			</div>

			<div className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">1) Enable Connect</h2>
					<p className="text-muted-foreground text-sm">
						Start by making the safety policy explicit. Protected paths,
						generated paths, review thresholds, and command rules live in the
						workspace config, not in editor-specific hooks.
					</p>
					<CodeBlock
						language="json"
						filename=".contractsrc.json"
						code={`{
  "connect": {
    "enabled": true,
    "storage": {
      "root": ".contractspec/connect",
      "contextPack": ".contractspec/connect/context-pack.json",
      "planPacket": ".contractspec/connect/plan-packet.json",
      "patchVerdict": ".contractspec/connect/patch-verdict.json",
      "auditFile": ".contractspec/connect/audit.ndjson",
      "reviewPacketsDir": ".contractspec/connect/review-packets"
    },
    "policy": {
      "protectedPaths": ["packages/libs/contracts-spec/**"],
      "generatedPaths": ["generated/**"],
      "smokeChecks": ["bun run typecheck"],
      "reviewThresholds": {
        "protectedPathWrite": "require_review",
        "breakingChange": "require_review",
        "destructiveCommand": "deny"
      }
    },
    "commands": {
      "allow": ["bun run typecheck"],
      "review": ["git push"],
      "deny": ["git reset --hard", "git push --force", "rm -rf"]
    },
    "adoption": {
      "enabled": true,
      "catalog": {
        "indexPath": ".contractspec/adoption/catalog.json",
        "overrideManifestPath": ".contractspec/adoption/overrides.json"
      },
      "workspaceScan": {
        "include": ["packages/**", "docs/**"],
        "exclude": ["generated/**", "dist/**"]
      },
      "families": {
        "contracts": true,
        "runtime": true,
        "sharedLibs": true
      },
      "thresholds": {
        "workspaceReuse": "permit",
        "contractspecReuse": "permit",
        "ambiguous": "require_review",
        "newImplementation": "require_review"
      }
    }
  }
}`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: Connect has enough policy to classify writes,
						commands, drift, and review thresholds deterministically.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">2) Initialize storage</h2>
					<CodeBlock
						language="bash"
						filename="connect-init"
						code={`contractspec connect init --scope workspace`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: `.contractsrc.json` is updated if needed and
						`.contractspec/connect/` is created.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						3) Mirror the adoption catalog and resolve reuse first
					</h2>
					<p className="text-muted-foreground text-sm">
						Connect adoption is the reuse-first layer for authoring. Mirror the
						local catalog, then resolve the best existing surface for the family
						you are about to touch before you scaffold or invent anything new.
					</p>
					<CodeBlock
						language="bash"
						filename="connect-adoption"
						code={`contractspec connect adoption sync --json

printf '{"goal":"Prefer an existing release helper before adding a new one"}' | \\
  contractspec connect adoption resolve --family sharedLibs --stdin --json`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: a mirrored local adoption catalog plus a reuse
						recommendation that can point to an existing workspace package or a
						ContractSpec surface before the task reaches file mutation.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						4) Project context and compile a plan
					</h2>
					<p className="text-muted-foreground text-sm">
						Use the task id as the thread that connects context, plan, verdict,
						and replay artifacts.
					</p>
					<CodeBlock
						language="bash"
						filename="connect-plan"
						code={`contractspec connect context \\
  --task docs-connect \\
  --paths packages/libs/contracts-spec/src/control-plane/contracts.ts \\
  --json

printf '{"objective":"Document the control-plane contract surface","commands":["bun run typecheck"]}' | \\
  contractspec connect plan --task docs-connect --stdin --json`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: a `ContextPack` and `PlanPacket` that point back to
						`controlPlane.intent.submit`, `controlPlane.plan.compile`, and
						`controlPlane.plan.verify`.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						5) Verify file and shell mutations
					</h2>
					<CodeBlock
						language="bash"
						filename="connect-verify"
						code={`printf '{"operation":"edit","path":"packages/libs/contracts-spec/src/control-plane/contracts.ts"}' | \\
  contractspec connect verify --task docs-connect --tool acp.fs.access --stdin --json

printf 'bun run typecheck' | \\
  contractspec connect verify --task docs-connect --tool acp.terminal.exec --stdin --json`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: a `PatchVerdict` with `permit`, `rewrite`,
						`require_review`, or `deny`, plus a runtime-linked control-plane
						state when that linkage is available.
					</p>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">Artifacts to inspect</h3>
					<ul className="space-y-2 text-muted-foreground text-sm">
						{artifactPaths.map((path) => (
							<li key={path}>
								<code>{path}</code>
							</li>
						))}
					</ul>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						6) Review, replay, and optional Studio sync
					</h2>
					<CodeBlock
						language="bash"
						filename="connect-review-replay"
						code={`contractspec connect review list --json
contractspec connect replay <decisionId> --json
contractspec connect eval <decisionId> --registry ./harness-registry.ts --scenario connect.safe-refactor --json

# Optional when Studio review-bridge mode is enabled
contractspec connect review sync --decision <decisionId> --json`}
					/>
					<p className="text-muted-foreground text-sm">
						Local review packets remain authoritative. Studio sync is an
						operator convenience layer, not a requirement for baseline OSS
						safety.
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/specs/connect" className="btn-primary">
					Back to Connect spec <ChevronRight size={16} />
				</Link>
				<Link href="/docs/architecture/control-plane" className="btn-ghost">
					Control-plane runtime
				</Link>
			</div>
		</div>
	);
}
