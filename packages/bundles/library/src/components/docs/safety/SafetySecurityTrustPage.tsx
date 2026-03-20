import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function SafetySecurityTrustPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Security & Trust</h1>
				<p className="text-muted-foreground">
					ContractSpec focuses on deterministic, auditable software delivery.
					This page summarizes our security posture and trust commitments so
					teams can adopt with clarity.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">Security policy</h2>
				<p className="text-muted-foreground text-sm">
					We publish a dedicated security policy that explains how to report
					vulnerabilities and how we respond.
				</p>
				<Link href="/SECURITY.md" className="btn-primary">
					Read the security policy <ChevronRight size={16} />
				</Link>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">Release hygiene</h3>
					<p className="text-muted-foreground text-sm">
						We ship with deterministic CI, changesets, and contract validation
						so teams can trust every release.
					</p>
					<ul className="space-y-2 text-muted-foreground text-sm">
						<li>Changesets required for published packages.</li>
						<li>CI gate for contract validation and drift detection.</li>
						<li>Rollback-friendly release process.</li>
					</ul>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">Data handling</h3>
					<p className="text-muted-foreground text-sm">
						ContractSpec promotes strict data classification and policy-driven
						access. Specs can tag sensitive fields for enforcement.
					</p>
					<ul className="space-y-2 text-muted-foreground text-sm">
						<li>Schema-level sensitivity tags.</li>
						<li>Policy Decision Point enforcement.</li>
						<li>Audit logs for operational traceability.</li>
					</ul>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">Supply chain</h3>
					<p className="text-muted-foreground text-sm">
						We track dependency updates and keep the monorepo build
						reproducible.
					</p>
					<ul className="space-y-2 text-muted-foreground text-sm">
						<li>Dependabot + Renovate-style updates where available.</li>
						<li>Signed release artifacts planned for Studio release cycles.</li>
						<li>Transparent changelogs for every package.</li>
					</ul>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">Responsible disclosure</h3>
					<p className="text-muted-foreground text-sm">
						We respond quickly to security reports and coordinate fixes before
						public disclosure.
					</p>
					<ul className="space-y-2 text-muted-foreground text-sm">
						<li>Security response within 5 business days.</li>
						<li>Private disclosure via security@contractspec.io.</li>
						<li>Credit for researchers (with permission).</li>
					</ul>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Next steps</h2>
				<p className="text-muted-foreground">
					Explore the broader safety controls or read the roadmap to see
					upcoming trust investments.
				</p>
				<div className="flex flex-wrap gap-4 pt-4">
					<Link href="/docs/safety" className="btn-ghost">
						Safety overview <ChevronRight size={16} />
					</Link>
					<Link href="/ROADMAP.md" className="btn-ghost">
						Roadmap <ChevronRight size={16} />
					</Link>
				</div>
			</div>
		</div>
	);
}
