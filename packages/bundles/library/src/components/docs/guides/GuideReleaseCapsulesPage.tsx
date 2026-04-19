import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const docSyncTargets = [
	'root `README.md` and generated root `AGENTS.md` inputs when contributor or operator workflow changes',
	'the nearest package `README.md` and `AGENTS.md` for any touched public package surface',
	'website docs and `/llms*` summaries when the release changes how users or contributors should work',
];

export function GuideReleaseCapsulesPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">Author release capsules</h1>
				<p className="text-lg text-muted-foreground">
					Pair each publishable changeset with a structured release capsule so
					changelog, upgrade, and docs surfaces all read from the same release
					source of truth.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">What you&apos;ll build</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					<li>
						A <code>.changeset/&lt;slug&gt;.md</code> file for package/version
						intent.
					</li>
					<li>
						A <code>.changeset/&lt;slug&gt;.release.yaml</code> companion for
						audiences, migrations, validation, and evidence.
					</li>
					<li>
						Generated release artifacts that the website changelog and upgrade
						flows can consume safely.
					</li>
				</ul>
			</div>

			<div className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						1) Create the paired changeset files
					</h2>
					<p className="text-muted-foreground text-sm">
						The Markdown file states the package bumps and reader-facing change
						intent. The YAML file carries the structured release metadata.
					</p>
					<CodeBlock
						language="yaml"
						filename=".changeset/contract-dx-first-slice.release.yaml"
						code={`schemaVersion: "1"
slug: contract-dx-first-slice
summary: Improve app-config, theme, and feature authoring with explicit validation and shared setup alignment.
isBreaking: false
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: minor
validation:
  commands:
    - "cd packages/libs/contracts-spec && bun run test && bun run typecheck"
  evidence:
    - "Package-level validation entrypoints now back setup, docs, and CLI authoring flows."`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: every publishable slug has both the human-facing
						changeset and the structured release capsule beside it.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						2) Use the release authoring commands instead of raw drift-prone
						edits
					</h2>
					<CodeBlock
						language="bash"
						filename="release-authoring"
						code={`contractspec release init --summary "Improve app-config, theme, and feature authoring"

# Or revise an existing capsule with the guided flow
contractspec release edit contract-dx-first-slice`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: the CLI scaffolds or revises the paired files with
						the current release schema instead of leaving maintainers to
						hand-roll YAML structure.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						3) Build the generated release artifacts before consuming them
					</h2>
					<CodeBlock
						language="bash"
						filename="release-build"
						code={`contractspec release build`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: `generated/releases/manifest.json`,
						`generated/releases/upgrade-manifest.json`, and the related
						customer/maintainer guidance files are refreshed from the release
						capsules.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">
						4) Enforce completeness before publishing or building the changelog
					</h2>
					<CodeBlock
						language="bash"
						filename="release-check"
						code={`contractspec release check --strict`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: missing capsules, incomplete migration guidance, or
						stale generated release artifacts are flagged before the website
						changelog or publish workflow treats the release data as canonical.
					</p>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">
						5) Sync the public docs if workflow expectations changed
					</h3>
					<ul className="space-y-2 text-muted-foreground text-sm">
						{docSyncTargets.map((target) => (
							<li key={target}>{target}</li>
						))}
					</ul>
				</div>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/guides/connect-in-a-repo" className="btn-primary">
					Connect guide <ChevronRight size={16} />
				</Link>
				<Link href="/changelog" className="btn-ghost">
					Website changelog
				</Link>
			</div>
		</div>
	);
}
