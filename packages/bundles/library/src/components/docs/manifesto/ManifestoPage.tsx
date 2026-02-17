// export const metadata = {
//   title: 'Manifesto: ContractSpec',
//   description:
//     'Our philosophy: compiler not prison, no lock-in, standard tech, incremental adoption, AI governance.',
// };

export function ManifestoPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Manifesto</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec is the deterministic, spec-first compiler that keeps
          AI-written software coherent, safe, and regenerable. We're building
          the safety layer for AI-coded systems.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Compiler, not prison</h2>
          <p className="text-muted-foreground">
            ContractSpec is a tool in your toolchain, not a platform you're
            locked into. Like TypeScript compiles to JavaScript, ContractSpec
            compiles specs to standard code. The generated output is
            yours—readable, modifiable, and ejectable at any time.
          </p>
          <p className="text-muted-foreground">
            We believe developers should own their code. There's no proprietary
            runtime, no vendor-specific abstractions, no magic that hides
            complexity. You can always see what ContractSpec generates,
            understand it, and take it with you if you leave.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Standard tech, no magic</h2>
          <p className="text-muted-foreground">
            Everything ContractSpec generates uses technology you already know:
            TypeScript, Zod, Prisma, GraphQL, REST, React. There's no new
            language to learn, no YAML configuration hell, no DSL that only
            works in our ecosystem.
          </p>
          <p className="text-muted-foreground">
            Specs are just TypeScript. If you can write{' '}
            <code className="rounded bg-violet-500/10 px-1.5 py-0.5 text-sm">
              z.object({'{'} name: z.string() {'}'})
            </code>
            , you can write a ContractSpec. Your existing skills transfer
            directly.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Incremental adoption</h2>
          <p className="text-muted-foreground">
            You don't rewrite your app to use ContractSpec. You stabilize one
            module at a time. Start with a single API endpoint, a single data
            model, a single contract. See the value. Expand gradually.
          </p>
          <p className="text-muted-foreground">
            This isn't a big-bang migration. It's a safety layer you add
            incrementally to existing AI-generated chaos. No pressure. No
            deadlines. Your pace.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">AI governance</h2>
          <p className="text-muted-foreground">
            In 2025, AI agents generate enormous amounts of code. But they can't
            enforce invariants, they break multi-surface consistency, and they
            hallucinate refactors. The result is code that's hard to maintain
            and dangerous to trust.
          </p>
          <p className="text-muted-foreground">
            ContractSpec provides the governance layer. Contracts define what
            the system <em>should</em> do. AI agents read specs, not
            implementations. Code that violates contracts gets flagged and
            rejected before it can cause damage.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Multi-surface consistency</h2>
          <p className="text-muted-foreground">
            One spec generates API endpoints, database schemas, UI types, event
            definitions, and MCP tools. All surfaces stay in sync because they
            share the same source of truth.
          </p>
          <p className="text-muted-foreground">
            No more chasing drift between your API and your database. No more
            frontend types that don't match backend contracts. One change to the
            spec, all surfaces update consistently.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Safe regeneration</h2>
          <p className="text-muted-foreground">
            You can regenerate code at any time without fear. Specs enforce
            invariants. Breaking changes are caught at compile time, not in
            production. Roll back to any previous version with confidence.
          </p>
          <p className="text-muted-foreground">
            This is the promise of spec-first development: the code is derived
            from the spec, so regenerating it is always safe. No more "don't
            touch that file" warnings. No more fear of AI-generated spaghetti.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Join us</h2>
        <p className="text-muted-foreground">
          We're building the safety layer for AI-coded systems. If you believe
          developers should own their code, that AI needs governance, and that
          standard tech beats proprietary magic—we'd love to have you.
        </p>
        <p className="text-muted-foreground">
          You keep your app. We stabilize it, one module at a time. You own the
          code. It's standard tech.{' '}
          <span className="font-semibold text-violet-400">
            We're the compiler, not the prison.
          </span>
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <a href="/install" className="btn-primary">
            Install OSS Core
          </a>
          <a href="https://app.contractspec.studio" className="btn-ghost">
            Try Studio
          </a>
        </div>
      </div>
    </div>
  );
}
