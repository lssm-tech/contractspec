---
targets:
  - '*'
root: false
description: 'Cursor plugin metadata and marketplace readiness checklist'
globs:
  - '**/*'
cursor:
  alwaysApply: false
  description: 'Cursor plugin metadata and marketplace readiness checklist'
  globs:
    - '**/*'
---

# Cursor Marketplace Readiness

Use this checklist when packaging or publishing Cursor plugins from agentpacks.

## Manifest quality

- `pack.json` must include `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, and clear `tags`.
- Ensure names and descriptions are human-readable and stable across releases.
- Verify metadata points to public, reachable repository/docs links.

## Command and rule hygiene

- Commands must map to real workflows and avoid stale references.
- Rules should be concise, non-conflicting, and scoped to intended files.
- Agent and skill names should communicate one clear responsibility.

## Marketplace safety checks

- No references to unavailable MCP servers, private URLs, or internal-only dependencies.
- No secrets, tokens, or environment-specific values in plugin artifacts.
- Verify generated artifacts only include files needed by runtime behavior.

## Release readiness

- Run validation and generation before export.
- Export plugin artifacts and inspect `.cursor-plugin/plugin.json`.
- Keep a short changelog entry for what changed and why.
- Bump versions intentionally and keep compatibility notes for breaking changes.

## Recommended validation flow

1. `bun run agentpacks:validate`
2. `bun run agentpacks:all`
3. `bun run agentpacks:cursor-plugin`
4. Review plugin artifact structure and manifest metadata
