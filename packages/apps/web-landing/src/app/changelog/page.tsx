import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog: ContractSpec",
  description:
    "Updates and releases for ContractSpec. New features, improvements, and breaking changes for the spec-first compiler.",
  keywords: [
    "changelog",
    "updates",
    "releases",
    "features",
    "spec-first compiler",
    "AI code stabilization",
  ],
  openGraph: {
    title: "Changelog: ContractSpec",
    description:
      "Latest releases and improvements to ContractSpec.",
    url: "https://contractspec.chaman.ventures/changelog",
    type: "website",
  },
  alternates: {
    canonical: "https://contractspec.chaman.ventures/changelog",
  },
};

const changes = [
  {
    version: "v1.3.0",
    date: "Dec 2025",
    breaking: false,
    highlights: [
      "Shipped Personalization Engine (behavior tracker + overlay runtime + workflow composer)",
      "Launched overlay editor app with PEM signing",
      "New Prisma models for behavior events and overlay keys",
      "Docs + templates for tenant customization runbooks",
    ],
  },
  {
    version: "v1.2.0",
    date: "Nov 2025",
    breaking: false,
    highlights: [
      "New OverlaySpec editor UI",
      "Policy tracing in dashboard",
      "SLO rollback automation",
      "Spec signing attestation",
    ],
  },
  {
    version: "v1.1.0",
    date: "Oct 2025",
    breaking: false,
    highlights: [
      "Policy decision points (PDP)",
      "Intent → specs compiler",
      "Audit log export (CSV/JSON)",
      "Policy decision replay",
    ],
  },
  {
    version: "v1.0.0",
    date: "Sep 2025",
    breaking: true,
    highlights: [
      "General availability launch",
      "Signed specs with key management",
      "React Native unified renderer",
      "MCP adapter framework",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="section-padding hero-gradient relative border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Changelog
          </h1>
          <p className="text-lg text-muted-foreground">
            Latest releases and improvements to ContractSpec.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto space-y-6">
          {changes.map((change, i) => (
            <div key={i} className="card-subtle p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold">{change.version}</h3>
                  <p className="text-sm text-muted-foreground">{change.date}</p>
                </div>
                {change.breaking && (
                  <span className="text-xs font-bold px-3 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/50">
                    BREAKING
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {change.highlights.map((highlight, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground text-sm flex items-start gap-3"
                  >
                    <span className="text-violet-400 flex-shrink-0">→</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
