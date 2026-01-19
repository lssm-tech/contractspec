Project: ContractSpec monorepo. Purpose: spec-first compiler/framework to keep AI-generated software coherent, safe, and regenerable; generates API/DB/UI/SDK/MCP from TypeScript/Zod contracts. Website: https://contractspec.io. Repo: https://github.com/lssm-tech/contractspec.

Architecture: layered monorepo with workspaces in packages/apps (thin adapters), packages/bundles (domain logic/UI), packages/libs (shared infra/contracts/design system), plus packages/tools, modules, integrations, examples, apps-registry. Follow AGENTS.md for detailed map and dependency flows.

Tech stack: TypeScript (strict), Bun package manager, Turbo build, React 19, Next 16, Zod, ESLint, Prettier, Changesets.