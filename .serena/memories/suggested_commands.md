Common commands (Bun/Turbo):
- Install: bun install
- Dev all apps: bun dev
- Dev web: bun dev --filter=@contractspec/app.web-landing
- Lint: bun run lint
- Lint check: bun run lint:check
- Lint fix: bun run lint:fix
- Build: bun run build
- Build web: bun run build:web
- Build api: bun run build:api
- Build worker: bun run build:worker
- Build types: bun run build:types
- Clean: bun run clean
- DB deploy: bun run db:deploy
- CI validation: bunx contractspec ci
- Rulesync: bun run rulesync:all (edit .rulesync/, not .agent/)

Git utilities (Darwin): git status, git diff, git log. Use ls/rg/find as needed.