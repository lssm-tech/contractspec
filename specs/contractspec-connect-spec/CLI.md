# CLI Surface

## Principles

- one-command bootstrap
- local-first defaults
- useful without Studio
- deterministic output formats
- scriptable in CI and editor hooks

## Proposed commands

```bash
npx @contractspec/connect init
contractspec connect install claude
contractspec connect install cursor
contractspec connect install codex

contractspec connect scan
contractspec connect impact refresh
contractspec connect context
contractspec connect plan --stdin
contractspec connect verify --tool write_file --stdin
contractspec connect verify --tool edit_file --stdin
contractspec connect verify --tool run_command --stdin

contractspec connect replay <decision-id>
contractspec connect sync-pack team/platform@1.2.0 --read-only
contractspec connect review --open studio
contractspec connect eval
```

## Command semantics

### `npx @contractspec/connect init`

Creates:

- `connect.config.ts`
- `connect.overlay.ts`
- `.contractspec/connect/` directory
- optional adapter install prompt

### `contractspec connect install <adapter>`

Installs environment-specific hook files and command wrappers.

### `contractspec connect scan`

Builds the initial impact index from:

- ContractSpec contracts
- generated manifests
- imported endpoint metadata
- repository paths and conventions

### `contractspec connect impact refresh`

Incrementally updates the impact index.

### `contractspec connect context`

Prints or writes the current typed context pack.

### `contractspec connect plan --stdin`

Accepts a natural-language or structured plan proposal on stdin and returns a verified `PlanPacket`.

### `contractspec connect verify --tool <tool> --stdin`

Accepts a normalized tool action payload and returns a `PatchVerdict`.

### `contractspec connect replay <decision-id>`

Re-runs the decision from preserved evidence and prints a diff between historical and current outcomes if artifacts changed.

### `contractspec connect sync-pack <ref> --read-only`

Fetches and installs a signed canon pack into the local cache.

### `contractspec connect review --open studio`

Opens pending review artifacts and, if configured, deep-links into the matching Studio queue.

### `contractspec connect eval`

Runs replay- or invariant-based evaluation against stored decisions or named scenarios.

## Exit code behavior

- `0` allowed / success
- `10` rewrite required
- `20` review required
- `30` denied
- `40` misconfiguration or missing artifact
