import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function StartHerePage() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="font-bold text-4xl">Start here</h1>
				<p className="text-lg text-muted-foreground">
					A fast onboarding path from install to your first generated contract.
				</p>
			</div>

			<div className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Install the CLI</h2>
					<InstallCommand package="contractspec" dev />
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Generate repo-local guidance</h2>
					<CodeBlock
						language="bash"
						filename="start-here-onboard"
						code={`contractspec onboard
# optional focused track
contractspec onboard knowledge --example knowledge-canon`}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Initialize your project</h2>
					<CodeBlock
						language="bash"
						filename="start-here-init"
						code={`bunx contractspec init`}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Author your first contract</h2>
					<CodeBlock
						language="bash"
						filename="start-here-create"
						code={`contractspec create --type operation`}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">Generate implementation</h2>
					<CodeBlock
						language="bash"
						filename="start-here-build"
						code={`contractspec generate
contractspec validate`}
					/>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3 pt-2">
				<Link href="/docs/getting-started/hello-world" className="btn-primary">
					Next: Hello World <ChevronRight size={16} />
				</Link>
				<Link
					href="/docs/getting-started/troubleshooting"
					className="btn-ghost"
				>
					Troubleshooting
				</Link>
				<Link href="/docs/getting-started/compatibility" className="btn-ghost">
					Compatibility
				</Link>
			</div>
		</div>
	);
}
