# AI Agent Guide — `@contractspec/action.validation`

Scope: `packages/apps/action-validation/*`

This is the ContractSpec GitHub Action for CI/CD integration.

## Structure

- `action.yml` - GitHub Action definition (composite action)
- `README.md` - Usage documentation
- `package.json` - Package metadata (private, not published to npm)

## How It Works

This is a **composite action** that:

1. Sets up Bun
2. Installs dependencies
3. Runs `contractspec ci` with the specified options
4. Uploads SARIF to GitHub Code Scanning (optional)
5. Uploads results as artifacts

## Modifying the Action

When making changes:

1. Update `action.yml` for input/output changes
2. Update `README.md` for documentation
3. Test locally using `act` or by referencing the local action:

```yaml
- uses: ./packages/apps/action-validation
```

## Inputs/Outputs

All inputs and outputs are defined in `action.yml`. The action wraps the `contractspec ci` CLI command.

## Publishing

The action is published as part of the monorepo. Users reference it as:

```yaml
- uses: lssm/contractspec-action@v1
```

The action is versioned with tags on the repository.
