import Link from 'next/link';

// export const metadata = {
//   title: 'Enterprise Orchestration Comparison: ContractSpec Docs',
//   description:
//     'See how Redwood RunMyJobs compares to ContractSpec for enterprise orchestration.',
// };

export default function EnterprisePlatformsComparisonPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          Enterprise orchestration platforms
        </h1>
        <p className="text-muted-foreground">
          Enterprise orchestration platforms manage mission-critical workloads
          and integrate deeply with ERP systems. They prioritise governance,
          reliability and compliance, but they do not provide spec-driven app
          generation or per-user customisation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Redwood RunMyJobs</h2>
        <p className="text-muted-foreground">
          <Link
            href="https://www.redwood.com/workload-automation/"
            className="hover:text-foreground underline decoration-dotted underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            RunMyJobs by Redwood
          </Link>{' '}
          is a cloud-native service orchestration and automation platform. Key
          attributes include:
        </p>
        <ul className="text-muted-foreground space-y-2">
          <li>
            <strong>Self-service portal.</strong> Business users can run and
            customise workloads while IT ensures governance and compliance
          </li>
          <li>
            <strong>Full-stack orchestration.</strong> Integrates with both SAP
            and non-SAP systems; Redwood is recognised as a Leader in Gartner’s
            Magic Quadrant for service orchestration
          </li>
          <li>
            <strong>Observability and AI insights.</strong> Dashboards and
            AI-enhanced analytics identify bottlenecks and forecast issues
          </li>
          <li>
            <strong>Deep SAP integration.</strong> Supports SAP’s latest
            technologies and orchestrates mission-critical business processes
          </li>
          <li>
            <strong>Connectors &amp; wizard.</strong> Provides pre-built
            connectors and a wizard to link on-prem and cloud systems
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Comparison with ContractSpec</h3>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Aspect</th>
                <th className="px-4 py-3 font-semibold">RunMyJobs</th>
                <th className="px-4 py-3 font-semibold">ContractSpec</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Target user</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Enterprise IT and operations teams automating SAP and
                  mission-critical workflows.
                </td>
                <td className="px-4 py-3 align-top">
                  Developers, product teams and SMBs wanting to generate
                  policy-safe apps with customisable UIs.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Workload focus</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Service orchestration and job scheduling across ERP/legacy
                  systems
                </td>
                <td className="px-4 py-3 align-top">
                  End-to-end application generation with back-end, UI and
                  policies.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>User interface</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Self-service portal to run/monitor jobs; no custom UI
                  generation for new apps.
                </td>
                <td className="px-4 py-3 align-top">
                  Generates React/React-Native UIs from specs; users can
                  personalise layout via overlays.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Open source</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Proprietary SaaS; enterprise agreements.
                </td>
                <td className="px-4 py-3 align-top">
                  Core compiler is proprietary; SDK and certain modules may be
                  open-source; offers hosted and on-prem options.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Policy &amp; personalisation</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  IT controls governance; no per-user overlay concept.
                </td>
                <td className="px-4 py-3 align-top">
                  Built-in policy engine and per-user overlays for safe
                  personalisation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground">
          Redwood RunMyJobs is designed for orchestrating enterprise workloads
          and SAP processes. ContractSpec targets a different problem:
          generating complete applications from typed specs and letting end
          users adapt them safely.
        </p>
      </div>
    </div>
  );
}
