// export const metadata = {
//   title: 'Internal-Tool Builders Comparison: ContractSpec Docs',
//   description:
//     'See how popular internal-tool builders compare to ContractSpec on UI generation, policies, and personalisation.',
// };

export function ComparisonInternalToolBuildersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Internal-tool builders</h1>
        <p className="text-muted-foreground">
          Internal-tool builders let teams quickly assemble dashboards and admin
          panels. These platforms often provide drag-and-drop UIs and connectors
          to databases and APIs, but they rely on developers to write custom
          code for business logic and seldom enforce policies across surfaces.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Feature comparison</h2>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Retool</th>
                <th className="px-4 py-3 font-semibold">Appsmith</th>
                <th className="px-4 py-3 font-semibold">ToolJet</th>
                <th className="px-4 py-3 font-semibold">Budibase</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  UI builder
                </td>
                <td className="px-4 py-3 align-top">
                  Drag-and-drop canvas; shape UI components easily
                </td>
                <td className="px-4 py-3 align-top">
                  Visual builder with drag-and-drop widgets
                </td>
                <td className="px-4 py-3 align-top">
                  Drag-and-drop UI widgets (tables, charts, forms)
                </td>
                <td className="px-4 py-3 align-top">
                  Pre-built components and templates for mobile/desktop
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Custom code &amp; logic
                </td>
                <td className="px-4 py-3 align-top">
                  Full code insertion anywhere via IDE
                </td>
                <td className="px-4 py-3 align-top">
                  Logic via JavaScript or natural-language prompts in a central
                  IDE
                </td>
                <td className="px-4 py-3 align-top">
                  Supports business logic in JavaScript or Python queries
                </td>
                <td className="px-4 py-3 align-top">
                  Custom logic via JavaScript; plugins and external embeds
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Data connectors
                </td>
                <td className="px-4 py-3 align-top">
                  Wide support for databases and APIs (PostgreSQL, MongoDB,
                  GraphQL, etc.).
                </td>
                <td className="px-4 py-3 align-top">
                  Connects to LLMs and databases
                </td>
                <td className="px-4 py-3 align-top">
                  Built-in database; connects to PostgreSQL, MongoDB, APIs,
                  GraphQL, SaaS
                </td>
                <td className="px-4 py-3 align-top">
                  Connects to external databases, REST, CSV or built-in DB
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Open source &amp; self-host
                </td>
                <td className="px-4 py-3 align-top">
                  Proprietary; cloud or on-prem subscription.
                </td>
                <td className="px-4 py-3 align-top">
                  Open source (Apache-2.0); self-host or cloud.
                </td>
                <td className="px-4 py-3 align-top">
                  Open source; self-host via Docker or cloud.
                </td>
                <td className="px-4 py-3 align-top">
                  Open source; self-host via Docker/Kubernetes
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top font-semibold">
                  Policy &amp; personalisation
                </td>
                <td className="px-4 py-3 align-top">
                  No built-in policy engine; personalisation limited to user
                  roles.
                </td>
                <td className="px-4 py-3 align-top">
                  No typed policy engine; customisation depends on user roles.
                </td>
                <td className="px-4 py-3 align-top">
                  No policy engine; personalisation via user roles.
                </td>
                <td className="px-4 py-3 align-top">
                  No policy engine; personalisation via RBAC &amp; SSO
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">ContractSpec’s differences</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>
            <strong>Typed specifications</strong> produce both the API and UI.
            You define capabilities, data views and workflows, and the compiler
            generates code, forms and screens—no manual widget wiring.
          </li>
          <li>
            <strong>Policy enforcement</strong> at run time ensures PII and ABAC
            rules across the entire app.
          </li>
          <li>
            <strong>Overlay personalisation</strong> allows tenants and users to
            change layouts safely without code.
          </li>
          <li>
            <strong>Unified mobile/web runtime</strong> means you don’t need
            separate builders for React Native vs web.
          </li>
        </ul>
        <p className="text-muted-foreground">
          Internal-tool builders are useful for quick dashboards. ContractSpec
          extends this by generating the whole stack from specs and enforcing
          policies throughout.
        </p>
      </div>
    </div>
  );
}
