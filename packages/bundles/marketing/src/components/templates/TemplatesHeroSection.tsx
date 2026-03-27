export interface TemplatesHeroSectionProps {
	localTemplateCount: number;
	sourceCount: number;
}

export function TemplatesHeroSection({
	localTemplateCount,
	sourceCount,
}: TemplatesHeroSectionProps) {
	return (
		<section className="section-padding hero-gradient border-border/70 border-b">
			<div className="editorial-shell space-y-8">
				<div className="max-w-4xl space-y-5">
					<p className="editorial-kicker">Proof through real scenarios</p>
					<h1 className="editorial-title">
						Templates that show the open system in practice.
					</h1>
					<p className="editorial-subtitle">
						These scenarios are the fastest way to understand ContractSpec:
						explicit contracts, aligned surfaces, and an adoption path from OSS
						exploration into Studio deployment.
					</p>
				</div>
				<div className="editorial-proof-strip">
					<div className="editorial-stat">
						<span className="editorial-stat-value">{localTemplateCount}</span>
						<span className="editorial-label">curated scenarios</span>
					</div>
					<div className="editorial-stat">
						<span className="editorial-stat-value">{sourceCount}</span>
						<span className="editorial-label">entry paths</span>
					</div>
					<div className="editorial-stat">
						<span className="editorial-stat-value">OSS</span>
						<span className="editorial-label">first, Studio second</span>
					</div>
				</div>
			</div>
		</section>
	);
}
