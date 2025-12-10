---
description: LLMs Guide Policy — every app must expose a single, canonical llms file and URL
globs:
alwaysApply: true
---

LLMs Guide File (llms)

Intent

- Each app must provide a single, canonical, AI-consumable file that orients large language models (LLMs) about the app: what it does, how it is structured, where to find APIs, flags, data, and guardrails.
- This is an all-in-one document intended for automation and agents (ai-agent), not marketing copy.

Public URL policy (must)

- Expose the guide at one of these stable endpoints:
  - Subdomain: llms.<app-domain>
  - Path: /llms (and aliases /llms.txt, /llms.md)
- Both subdomain and path forms should resolve successfully. If only one physical file exists, use rewrites to serve the others.

File location and format (must)

- Store the primary file in the app's public assets so it can be served by the web server with zero auth.
- Name: llms.txt (preferred) or llms.md
- Encoding: UTF-8, line-length reasonable for diffs.

Implementation guidance (Next.js App Router)

- Place the canonical file at public/llms.txt (or public/llms.md).
- Add a rewrite so /llms resolves to the canonical file (and allow /llms.txt and /llms.md).
- Add middleware to rewrite host llms.<domain> → /llms.
- Avoid server-side computation; the file should be static and cacheable.

Minimum content checklist (should)

- App purpose and target users
- Primary domains/features and bounded contexts
- Routing and entry points (not secrets)
- Authentication methods and roles
- API surfaces (REST/GraphQL) with base paths, not full schemas
- Eventing/analytics naming conventions and key events
- Feature flags: naming convention and where defined
- Data stores: types and high-level schemas (links over dumps)
- Environment markers: dev/stage/prod domain patterns
- Links to deeper docs under docs/tech and docs/ops

Change management (must)

- Keep the file in sync with significant product or API changes.
- If the app introduces enums/flags/APIs used in ≥2 places, ensure docs/ contains the canonical definition and reference it from this file.

Quality heuristics

- Single source: one file per app. Do not scatter.
- Machine-readable first: concise, structured sections; avoid prose-only walls of text.
- Stable URL: links should be durable across deployments.

Enforcement checklist (per app)

- `public/llms.txt` (or `.md`) exists and is current.
- Rewrites allow `/llms`, `/llms.txt`, `/llms.md`.
- Subdomain `llms.<app-domain>` rewrites to `/llms`.
- File served without auth; cached/static.
- Update whenever domains, APIs, flags, data stores, or routing change.

Verification (Next.js App Router)

- `next.config` rewrites include `/llms*` → `public/llms.txt`.
- Middleware handles host `llms.<domain>` → `/llms`.
- Manual check: `curl <host>/llms` returns file; same for `/llms.txt` and `/llms.md`.
