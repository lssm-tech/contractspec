## Sandbox guarantees

- Route: `/sandbox`
- **No auth requirement**
- **No PostHog init**
- **No Vercel Analytics**
- Local-only state (in-browser runtime + localStorage where needed)

## What Sandbox is for

- Try templates and feature modules safely
- Preview specs/builder/evolution/learning
- Produce copyable CLI commands (no side effects)

## What Sandbox is *not* for

- Persisted projects/workspaces
- Real deployments
- Organization-scoped integrations (unless explicitly enabled later)
