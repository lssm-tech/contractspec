export const metadata = {
  title: 'Workflow Engines Comparison: ContractSpec Docs',
  description:
    'Compare popular workflow engines with ContractSpec to understand core strengths and differences.',
};

export default function WorkflowEnginesComparisonPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Workflow engines</h1>
        <p className="text-muted-foreground">
          Workflow engines orchestrate long-running tasks and data pipelines.
          They provide retries, scheduling and visibility, but most expect
          developers to write code and do not generate user interfaces. Here’s
          how the major engines compare to ContractSpec.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Key differences summary</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Engine</th>
                <th className="px-4 py-3 font-semibold">Core strengths</th>
                <th className="px-4 py-3 font-semibold">UI generation?</th>
                <th className="px-4 py-3 font-semibold">
                  Policy/PII enforcement?
                </th>
                <th className="px-4 py-3 font-semibold">Self-host?</th>
                <th className="px-4 py-3 font-semibold">Primary use</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Prefect</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Python-native; dynamic DAGs adapt to change; annotate code
                  without rewriting; strong observability and audit logs
                </td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">Yes</td>
                <td className="px-4 py-3 align-top">
                  Data pipelines and dynamic workflows.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Kestra</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Declarative YAML; event-driven triggers; mix of code and
                  no-code; write logic in Python/R/Java/Julia/Ruby; deploy
                  anywhere
                </td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">Yes</td>
                <td className="px-4 py-3 align-top">
                  Data pipelines and hybrid orchestration.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Temporal</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Durable execution; workflows never lose state; multi-language
                  SDKs; automatic retries
                </td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">Yes</td>
                <td className="px-4 py-3 align-top">
                  Durable microservice and business workflows.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Airflow</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Open-source; define workflows as Python code; schedule and
                  monitor via UI; extensible via custom operators
                </td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">Yes</td>
                <td className="px-4 py-3 align-top">Data ETL pipelines.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Dagster</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Data-asset model; local testing and reusable components;
                  built-in data quality and catalog; orchestrates AI/data
                  pipelines across multiple tools
                </td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">Yes</td>
                <td className="px-4 py-3 align-top">
                  Data/AI pipelines with strong observability.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Hatchet</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Modern engine focused on performance and durability; tasks and
                  workflows as code; durable functions with guardrails and
                  retries
                </td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">No</td>
                <td className="px-4 py-3 align-top">Yes</td>
                <td className="px-4 py-3 align-top">
                  High-throughput background jobs and microservices.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <strong>Windmill</strong>
                </td>
                <td className="px-4 py-3 align-top">
                  Multi-language scripts; auto-generates UI; integrated flow
                  editor
                </td>
                <td className="px-4 py-3 align-top">Yes (basic)</td>
                <td className="px-4 py-3 align-top">RBAC &amp; secrets only</td>
                <td className="px-4 py-3 align-top">Yes</td>
                <td className="px-4 py-3 align-top">
                  Scripts into workflows and dashboards.
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
            <strong>Spec-first generation</strong> – Instead of writing code,
            you define typed specs for capabilities, data views and workflows;
            the compiler outputs both back-end and front-end.
          </li>
          <li>
            <strong>Policy engine</strong> – Every render and mutate passes
            through an ABAC/PII policy decision point.
          </li>
          <li>
            <strong>Personalisation</strong> – Signed OverlaySpecs allow
            tenant/user-specific UI changes without touching code.
          </li>
          <li>
            <strong>Unified runtime</strong> – React/React-Native rendering
            ensures consistent experiences across web and mobile.
          </li>
        </ul>
        <p className="text-muted-foreground">
          Workflow engines are excellent for orchestrating back-end tasks.
          ContractSpec builds on this by serving complete applications with
          runtime policy enforcement and user personalisation via TypeScript
          specs.
        </p>
      </div>
    </div>
  );
}
