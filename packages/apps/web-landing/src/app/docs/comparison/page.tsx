export const metadata = {
  title: 'Comparison Overview: ContractSpec Docs',
  description:
    'See how ContractSpec relates to workflow engines, internal-tool builders, automation platforms, and enterprise orchestrators.',
};

export default function ComparisonOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Comparison overview</h1>
        <p className="text-muted-foreground">
          ContractSpec sits at the intersection of several tool categories. To
          appreciate its unique offering—typed specifications for back-end,
          front-end, workflows and policies with a unified web/mobile
          runtime—this section compares it to related products.
        </p>
        <p className="text-muted-foreground">
          ContractSpec uses <strong>runtime adapters</strong> to serve typed{' '}
          <strong>Operations</strong> (Commands/Queries),{' '}
          <strong>DataViews</strong>, <strong>Workflows</strong>, and{' '}
          <strong>Policies</strong> as REST/GraphQL/MCP endpoints. A{' '}
          <strong>policy decision point</strong> governs every operation, and{' '}
          <strong>OverlaySpecs</strong> allow non-technical users to personalise
          screens safely. Few competitors offer this combination of runtime type
          safety, policy enforcement, and end-user customisation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tool categories</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Examples</th>
                <th className="px-4 py-3 font-semibold">What they do</th>
                <th className="px-4 py-3 font-semibold">Limitations</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Workflow engines</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Prefect, Kestra, Temporal, Airflow, Dagster, Hatchet, Windmill
                </td>
                <td className="px-4 py-3 align-top">
                  Orchestrate code or data pipelines; handle retries, scheduling
                  and observability
                </td>
                <td className="px-4 py-3 align-top">
                  Require writing code; no automatic UI generation or policy
                  enforcement.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Internal-tool builders</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Retool, Appsmith, ToolJet, Budibase
                </td>
                <td className="px-4 py-3 align-top">
                  Drag-and-drop dashboards and admin panels; connect to
                  databases/APIs
                </td>
                <td className="px-4 py-3 align-top">
                  No typed back-end spec; limited enforcement of policies;
                  custom code glues logic.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Automation platforms</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Zapier, Make, n8n, Pipedream
                </td>
                <td className="px-4 py-3 align-top">
                  Connect apps via triggers and actions; visual or low-code
                  interfaces
                </td>
                <td className="px-4 py-3 align-top">
                  Automate tasks but do not generate full apps or enforce
                  per-field policies.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Enterprise orchestrators</strong>
                </td>
                <td className="px-4 py-3 align-top">Redwood RunMyJobs</td>
                <td className="px-4 py-3 align-top">
                  Automate mission-critical workloads with self-service portals
                  and SAP integrations
                </td>
                <td className="px-4 py-3 align-top">
                  Focus on IT workloads; not built for custom app creation or
                  per-user customisation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground">
          Use the pages below to explore each group in detail and see how
          ContractSpec compares.
        </p>
      </div>
    </div>
  );
}
