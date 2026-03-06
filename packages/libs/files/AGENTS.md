# AI Agent Guide — `@contractspec/lib.files`

Scope: `packages/libs/files/*`

Files, documents, and attachments module. Provides file entity schemas, storage adapters, and capability contracts.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

| Subpath                | Description              |
| ---------------------- | ------------------------ |
| `.`                    | Main entry               |
| `./contracts`          | Contract definitions     |
| `./docs`               | Documentation blocks     |
| `./entities`           | File entity schemas      |
| `./events`             | Domain events            |
| `./files.capability`   | Capability contract      |
| `./files.feature`      | Feature definition       |
| `./storage`            | Storage adapter interface|

## Guardrails

- Storage interface is the adapter boundary — do not couple consumers to a specific storage provider.
- File entity schema is shared; field changes require migration coordination.
- Capability contract is public API.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
