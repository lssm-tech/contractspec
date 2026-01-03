# Package Architecture & Hierarchy

This document outlines the structure of the ContractSpec monorepo. It is the **source of truth** for AI Agents understanding where code should live and how dependencies flow.

## Core Hierarchy

The codebase follows a strict layered architecture:

**`apps` → `bundles` → `modules` → `libs`**

### 1. Level 1: Libs (`packages/libs/`)
*   **Role**: Foundation. Shared infrastructure, contracts, utilities, and atomic UI components.
*   **Rules**:
    *   Pure infrastructure only. **NO business logic**.
    *   Must be platform-agnostic (usable in web, CLI, mobile).
    *   **Zero dependencies** on bundles or apps.
*   **Examples**: `contracts`, `design-system`, `schema`, `utils-typescript`.

### 2. Level 2: Modules (`packages/modules/`)
*   **Role**: Specialized implementations. Self-contained lifecycle or feature modules.
*   **Rules**:
    *   Sits between Libs and Bundles.
    *   Can import from `libs`.
    *   Used by `bundles` and `apps`.
*   **Examples**: `lifecycle-core`, `lifecycle-advisor`.

### 3. Level 3: Bundles (`packages/bundles/`)
*   **Role**: Core Business Logic. Organized by **domain**, not technical concern.
*   **Rules**:
    *   Contains domain models, services, and reusable "smart" UI components.
    *   Can import from `libs` and `modules`.
    *   **Cannot import from apps**.
    *   **Cannot import from other bundles** (unless via a shared lib interface, to maintain loose coupling).
*   **Examples**: `contractspec-studio`, `workspace`, `marketing`.

### 4. Level 4: Apps (`packages/apps/`)
*   **Role**: Platform Adapters. Thin entry points that wire bundles to a specific platform (Next.js, CLI, VSCode).
*   **Rules**:
    *   **Minimal logic**. Just routing, configuration, and wiring.
    *   Re-exports UI from bundles; does not implement complex UI itself.
    *   Can import from `bundles`, `modules`, and `libs`.
*   **Examples**: `web-landing` (Next.js), `cli-contractspec` (CLI), `vscode-contractspec` (Extension).

## Directory Definitions

*   **`packages/libs/`**: Low-level, shared, stateless utilities and definitions.
*   **`packages/bundles/`**: Domain-specific business logic and stateful components.
*   **`packages/apps/`**: Deployable units and platform-specific consumers.
*   **`packages/modules/`**: Specialized, self-contained lifecycle/feature modules that may not fit standard bundles.
*   **`packages/examples/`**: Reference implementations, demos, and **ready-to-clone focused use-cases** (docused).
*   **`packages/tools/`**: Internal build tools, scripts, and custom ESLint/TS configs.
*   **`packages/integrations/`**: Runtime adapters (e.g., specific cloud providers or database drivers).
*   **`packages/apps-registry/`**: Metadata and definitions for the ContractSpec application registry.

## Dependency Rules

| Layer | Can Import From | Forbidden Imports |
| :--- | :--- | :--- |
| **Apps** | `bundles`, `modules`, `libs` | Other `apps` |
| **Bundles** | `modules`, `libs` | `apps`, `bundles` (circular) |
| **Modules** | `libs` | `apps`, `bundles`, `modules` (circular) |
| **Libs** | Other `libs` (be careful of cycles) | `apps`, `bundles`, `modules` |

> **Strict Rule**: Dependencies flow **DOWN** (Apps → Bundles → Libs). Never up.

## Component Hierarchy (Frontend)

1.  **Bundles** (`presentation/`): Domain-specific organisms & templates.
2.  **Modules** (`presentation/`): Feature-specific components.
3.  **Design System** (`libs/design-system`): Atoms, molecules, tokens.
4.  **UI Kit** (`libs/ui-kit`): Low-level primitives (only if missing from Design System).
5.  **Raw HTML**: ❌ **FORBIDDEN** in Apps/Bundles. Always use Design System components.

## Where to create valid code?

*   **Generic Utility?** → `packages/libs/utils-*`
*   **New Business Feature?** → `packages/bundles/<domain>`
*   **New Page/Route?** → `packages/apps/<app>` (which imports page content from `bundles`)
*   **New UI Component?**
    *   Is it generic (Button, Card)? → `packages/libs/design-system`
    *   Is it domain-specific (ProjectList, specEditor)? → `packages/bundles/<domain>/src/presentation`

## Reference Rules

Always check `.agent/rules/package-architecture.md` for the comprehensive guidelines on file splitting, naming conventions, and detailed architectural principles.
