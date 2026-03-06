# AI Agent Guide — `@contractspec/lib.identity-rbac`

Scope: `packages/libs/identity-rbac/*`

Identity, Organizations, and RBAC module. Provides role/permission schemas, policy evaluation, and capability contracts for access control.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, apps

## Public Exports

| Subpath                        | Description              |
| ------------------------------ | ------------------------ |
| `.`                            | Main entry               |
| `./contracts`                  | Contract definitions     |
| `./entities`                   | Identity/org entities    |
| `./events`                     | Domain events            |
| `./identity-rbac.capability`   | Capability contract      |
| `./identity-rbac.feature`      | Feature definition       |
| `./policies`                   | RBAC policy definitions  |

## Guardrails

- **Security-critical** — RBAC policies control access across the platform.
- Role and permission schemas must stay backward-compatible; removals are breaking.
- Capability contract is public API; policy evaluation must be deterministic.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
