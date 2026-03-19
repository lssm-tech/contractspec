# Daily Workflow with ContractSpec

This is the maintained day-to-day flow for a workspace that already uses ContractSpec.

## 1. Start With Health

```bash
contractspec doctor
contractspec ci
```

- `contractspec doctor` is read-only by default and reports install/config issues.
- `contractspec ci` runs the structure, integrity, dependency, and optional drift checks that should stay green before you branch further.

## 2. Change The Contract First

Create a new spec with the CLI or edit an existing one in place:

```bash
contractspec create --type operation
```

Use `contractspec list` first if you need to confirm what the workspace already exposes.

## 3. Regenerate Derived Artifacts

After the canonical contracts change, rebuild the derived outputs:

```bash
contractspec generate
```

If you maintain multiple generated buckets, use `contractspec sync --validate` instead.

## 4. Review Change Impact

Before opening a PR, inspect the effect of the contract change:

```bash
contractspec impact
contractspec diff path/to/spec-a.ts path/to/spec-b.ts --semantic
```

Use `contractspec impact --baseline main` when you want the PR view against `main`.

## 5. Validate Before Push

```bash
contractspec ci --check-drift
```

That final pass confirms:
- Specs still parse and validate.
- Features still reference real surfaces.
- Derived artifacts are back in sync.

## Common Commands

| Command | Description |
|---------|-------------|
| `contractspec doctor` | Read-only install and config diagnostics |
| `contractspec ci` | CI-grade validation checks |
| `contractspec create --type operation` | Create a new operation spec |
| `contractspec generate` | Rebuild derived artifacts |
| `contractspec sync --validate` | Rebuild all discovered specs with validation |
| `contractspec impact` | Review breaking and non-breaking changes |
| `contractspec diff` | Compare two specs semantically or textually |
