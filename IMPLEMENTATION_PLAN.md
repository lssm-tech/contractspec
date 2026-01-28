# Documentation System Strategy for ContractSpec

## Context
* The ContractSpec monorepo is a large TypeScript/Next.js‐based project organised into **packages** (tools, libs, integrations, modules, examples, bundles and apps).  The root `package.json` uses workspaces to include various apps and bundles【483485091951250†L0-L16】.  Notably, the **web landing** package (`@contractspec/app.web‑landing`) serves as the marketing website and documentation site【421645979657509†L0-L10】.  Its README notes that the project currently includes a **documentation section** built into the `src/app/(docs)/` route【421645979657509†L51-L58】 and emphasises that content changes should be made inside the **library bundle** (`packages/bundles/library`)【421645979657509†L41-L47】.

* The library bundle README states that it provides **documentation pages** and components under `components/docs/*` as part of the reusable library【902824986711014†L6-L29】.  This implies that the docs are currently implemented as React/MDX components within the codebase, but there is no automated mechanism ensuring that the documentation stays in sync with the underlying TypeScript contracts.

## Business Requirement
As a CPO, I want to ensure that external developers and partners can quickly understand and adopt ContractSpec.  Our current pain point is that the **documentation needs to stay in sync with the evolving contracts** and must be easy to navigate.  The documentation should be **wow‑worthy**, provide interactive examples, and be straightforward to adopt in a **new project**.

## High‑Level Product Idea
Create a **living documentation system** that automatically generates reference docs from ContractSpec definitions, combines them with curated guides and examples, and publishes them as part of our web‑landing site.  The system should:

1. **Stay in sync** with code: generate API/contract reference pages directly from TypeScript contract definitions.  When a contract changes, the docs should update automatically.
2. **Be easy to adopt**: include a starter guide and CLI commands so users can add the docs to their own projects with minimal setup.
3. **Provide compelling examples**: host working example applications under `packages/examples` with links and code snippets embedded in the docs.
4. **Be hosted on the existing website**: integrate with the Next.js web landing so documentation lives under `/docs`, using our design system.
5. **Scale with features**: support versioning, search, and interactive sandboxes for trying contracts.

## Implementation Steps
The following plan outlines the work required.  It is intentionally **product‑centred**, leaving technical details to the coding agent.

### 1. Evaluate and select a documentation generator
* Assess popular tools (e.g., **TypeDoc**, **Docusaurus**, **Nextra**, **Storybook Docs**) to determine which best fits a Next.js environment and can generate docs from TypeScript interfaces and JSDoc comments.
* Prefer a tool that supports **MDX** so we can mix generated reference material with manually written guides and code snippets.
* Ensure the tool can be run via a CLI in our monorepo and integrated into the build pipeline.

### 2. Design a doc generation pipeline
* Create a **build script** (e.g., in `packages/tools/docs-generator`) that reads ContractSpec definitions and produces structured JSON/MDX outputs.  It should:
   * Parse TypeScript types, functions and decorators representing contracts.
   * Output reference pages containing contract name, description, parameters, return types and examples.
   * Expose a CLI (e.g., `bun run docs:generate`) for local generation.
* Integrate this pipeline into the CI so docs are regenerated on each release.

### 3. Integrate docs into the web landing site
* Within `packages/apps/web-landing`, create a **docs directory** (e.g., `src/content/docs` or use the existing `src/app/(docs)/` route) to hold generated MDX files.
* Configure Next.js with an MDX plugin (like `@next/mdx`) or adopt a static site generator (e.g., Docusaurus) if necessary.
* Build a **layout component** that applies our design system styles to documentation pages and provides navigation, search and dark‑mode support.
* Use **live code blocks** and interactive components (from `@contractspec/lib.example-shared-ui`) to embed example snippets from `packages/examples` so users can run and edit them.

### 4. Develop onboarding and adoption guides
* Draft a **Getting Started** guide that explains how to add ContractSpec to a new project, emphasising our “specification‑first” approach.  Place this guide at `/docs/getting-started`.
* Provide a **Guide on generating docs** for users who adopt ContractSpec in their own monorepo: document how to install the docs generator CLI, run it and integrate the output into their sites.
* Include a **Frequently Asked Questions** section and **troubleshooting tips**.

### 5. Curate and integrate examples
* Review existing examples in `packages/examples` (e.g., saas boilerplate, CRM pipeline, agent console).  For each:
   * Ensure the example is runnable with minimal configuration.
   * Write a corresponding doc page under `/docs/examples/<name>` describing what the example demonstrates and linking to the source code.
   * Embed code snippets and interactive demos in the docs using components from `@contractspec/example.*` and `@contractspec/lib.example-shared-ui`.

### 6. Implement versioning and deployment
* Determine whether docs should be versioned alongside releases (e.g., `/docs/v1.0`, `/docs/v1.1`).  Use tags or branches in the docs generator to output versioned builds.
* Add a **docs deployment** step in the CI/CD pipeline so that when the `main` branch is updated, the docs are built and deployed to the production environment (Vercel or similar) under `/docs`.
* For internal documentation (developer‑only), consider a separate environment or restricted route.

### 7. Validate and iterate
* Perform user testing with our design partner to ensure the generated docs solve their pain points:
   * Validate that the docs are **comprehensive** and always current.
   * Gather feedback on navigation, examples and overall clarity.
* Iterate on the docs generator and site based on feedback, adding features like full‑text search, copy‑to‑clipboard for code blocks, or interactive API explorers.

## Expected Outcomes
By executing this plan, ContractSpec will have a **polished, self‑updating documentation system** that aligns with the product vision and reduces friction for adoption.  External users will benefit from clear, interactive docs and examples, while our team will maintain a single source of truth that stays synchronized with the codebase【421645979657509†L41-L47】.  The adoption guides will empower partners to integrate the docs system into their own projects, reinforcing ContractSpec’s commitment to specification‑first development and type‑safe AI applications.
