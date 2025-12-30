// export const metadata = {
//   title: 'Windmill Comparison: ContractSpec Docs',
//   description:
//     'Understand how Windmill compares to ContractSpec across entry model, policy enforcement, and personalisation.',
// };

export default function WindmillComparisonPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Windmill</h1>
        <p className="text-muted-foreground">
          Windmill is an open-source platform that turns{' '}
          <strong>scripts</strong> into endpoints, workflows and UIs. It seeks
          to remove boilerplate by generating interfaces and workflows around
          existing code
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Platform features</h2>
        <ul className="text-muted-foreground space-y-3">
          <li>
            <strong>Script-driven model.</strong> Write scripts in TypeScript,
            Python, Go, PHP, Bash, C#, SQL or Rust; Windmill infers
            dependencies, creates lockfiles and JSON schemas, then serves
            minimal UIs automatically
          </li>
          <li>
            <strong>Visual flow editor.</strong> Compose scripts into workflows
            with retries, error handling, loops, branching, suspending flows and
            approval steps
          </li>
          <li>
            <strong>Low-code UI builder.</strong> Build dashboards and admin
            panels using inline scripts and trigger flows from the UI
          </li>
          <li>
            <strong>Enterprise readiness.</strong> Features include RBAC
            permissions, secret management, OAuth handling, CLI/git sync,
            scheduling and webhooks
          </li>
          <li>
            <strong>Use cases.</strong> Deploy scripts as webhooks or cron jobs;
            create “applicative workflows” combining external APIs; build ETLs
            and interactive dashboards
          </li>
          <li>
            <strong>Open source &amp; self-hosting.</strong> Windmill emphasises
            an open-source codebase and self-hosting options
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comparison with ContractSpec</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Windmill</th>
                <th className="px-4 py-3 font-semibold">ContractSpec</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Entry model</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Write scripts; platform auto-generates UI and workflows
                </td>
                <td className="px-4 py-3 align-top">
                  Define typed specs (Capabilities, DataViews, Workflows,
                  Policies); compiler outputs back-end, front-end and forms.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Language support</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  20+ languages via embedded runtimes
                </td>
                <td className="px-4 py-3 align-top">
                  Uses TypeScript/JavaScript for providers; supports other
                  back-ends through capability providers.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>UI generation</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Minimal UI forms from script parameters; low-code app builder
                </td>
                <td className="px-4 py-3 align-top">
                  Generates full web and mobile UIs from specs; user layouts can
                  be customised via signed overlays.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Policy &amp; personalization</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  RBAC and secret management; no per-user overlay concept
                </td>
                <td className="px-4 py-3 align-top">
                  Built-in policy engine enforcing ABAC/PII on every
                  render/mutate; overlays allow safe per-user customisation.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Open source</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Fully open source and self-hostable
                </td>
                <td className="px-4 py-3 align-top">
                  Closed-source core (SDK is open); offers hosted and on-prem
                  modes.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Ideal for</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Teams wanting to expose scripts as APIs, workflows or
                  dashboards without heavy infrastructure.
                </td>
                <td className="px-4 py-3 align-top">
                  Teams needing a spec-driven platform that generates code and
                  UI, enforces policies and lets non-technical users tailor the
                  experience.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground">
          Windmill excels at converting scripts into workflows and admin panels.
          ContractSpec takes a <strong>spec-first</strong> approach, generating
          the entire stack and enforcing policies, making it suitable for
          long-lived applications that must evolve safely.
        </p>
      </div>
    </div>
  );
}
