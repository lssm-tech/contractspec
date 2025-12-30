/* eslint-disable no-irregular-whitespace */

// export const metadata = {
//   title: 'Automation Platforms Comparison: ContractSpec Docs',
//   description:
//     'Compare automation platforms like Zapier, Make, n8n, and Pipedream with ContractSpec.',
// };

export default function AutomationPlatformsComparisonPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Automation platforms</h1>
        <p className="text-muted-foreground">
          Automation platforms connect apps and automate tasks through triggers
          and actions. They serve operations and non-technical users well but
          stop short of generating full applications or enforcing fine-grained
          policies.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Feature comparison</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Zapier</th>
                <th className="px-4 py-3 font-semibold">Make (Integromat)</th>
                <th className="px-4 py-3 font-semibold">n8n</th>
                <th className="px-4 py-3 font-semibold">Pipedream</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Workflow model
                </td>
                <td className="px-4 py-3 align-top">
                  Zaps: trigger + one or more actions
                </td>
                <td className="px-4 py-3 align-top">
                  Real-time visual orchestration for AI agents and automations
                </td>
                <td className="px-4 py-3 align-top">
                  Node-based workflow builder with drag-and-drop and code; build
                  multi-step AI agents
                </td>
                <td className="px-4 py-3 align-top">
                  Workflows connect any API; Pipedream Connect SDK adds
                  integrations quickly
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Visual builder?
                </td>
                <td className="px-4 py-3 align-top">
                  Yes (simple; web-based).
                </td>
                <td className="px-4 py-3 align-top">Yes; AI-assisted editor</td>
                <td className="px-4 py-3 align-top">Yes; visual canvas.</td>
                <td className="px-4 py-3 align-top">
                  Code-centric editor; no visual UI builder
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Self-host?
                </td>
                <td className="px-4 py-3 align-top">No (cloud only).</td>
                <td className="px-4 py-3 align-top">Cloud only.</td>
                <td className="px-4 py-3 align-top">Yes (Docker, self-host)</td>
                <td className="px-4 py-3 align-top">Cloud only (hosted).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Integrations &amp; AI
                </td>
                <td className="px-4 py-3 align-top">
                  Connects almost 8 000 apps; limited AI features.
                </td>
                <td className="px-4 py-3 align-top">
                  3 000+ pre-built apps; supports GenAI tools; GDPR/SOC2 and SSO
                </td>
                <td className="px-4 py-3 align-top">
                  Integrates LLMs; allows JS or Python code and library imports;
                  chatbots with Slack/Teams
                </td>
                <td className="px-4 py-3 align-top">
                  MCP servers add 3 000+ APIs and 10 000+ tools to agents; AI
                  agent builder prompts and deploys agents; SOC 2/ HIPAA/GDPR
                  compliant
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Policy &amp; UI generation
                </td>
                <td className="px-4 py-3 align-top">
                  No policy engine; does not generate user interfaces.
                </td>
                <td className="px-4 py-3 align-top">
                  No policy engine; does not generate UIs beyond a workflow
                  dashboard.
                </td>
                <td className="px-4 py-3 align-top">
                  No policy engine; no UI builder
                </td>
                <td className="px-4 py-3 align-top">
                  No policy engine; does not generate UI.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Why ContractSpec differs</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>
            <strong>Full application generation</strong> – ContractSpec compiles
            specs into back-end, events and user interfaces for both web and
            mobile.
          </li>
          <li>
            <strong>Policy enforcement</strong> – A built-in policy engine
            governs PII access and mutations across the UI.
          </li>
          <li>
            <strong>Customisation via overlays</strong> – Non-technical users
            can safely personalise layouts while respecting policies.
          </li>
          <li>
            <strong>Extensible capabilities</strong> – Connect to external APIs
            and services via capability providers while maintaining type safety.
          </li>
        </ul>
        <p className="text-muted-foreground">
          Automation tools simplify integrations and tasks; ContractSpec goes
          further by generating a complete, policy-safe application around your
          data and processes.
        </p>
      </div>
    </div>
  );
}
