# Publishing Scripts

This directory contains scripts for publishing packages to npm.

## Files

- **`publish-packages.js`** - Main publishing script that automatically discovers and publishes packages
- **`changeset-publish.mjs`** - Integration with changesets for automated versioning

## Quick Start

### Test Publishing (Dry Run)

```bash
cd packages/contractspec
DRY_RUN=true node scripts/publish-packages.js
```

### Publish to npm

```bash
# Ensure you're authenticated
npm login

# Build all packages first
bun run build

# Publish
node scripts/publish-packages.js
```

## How It Works

### Automatic Package Discovery

The script automatically discovers all publishable packages by:

1. **Scanning** all `packages/*/package.json` files
2. **Filtering** out packages with `"private": true`
3. **Excluding** tool packages (`packages/tools/*`)
4. **Building** a map of all publishable packages

### Privacy Model

#### ✅ Published to npm (Public Packages)

- `@lssm/lib.*` - All library packages (42 packages total)
- `@lssm/app.cli-*` - CLI applications
- `@lssm/bundle.*` - Bundle packages
- `@lssm/module.*` - Module packages

#### ❌ Not Published (Private Packages)

- `@lssm/apps.web-*` - Next.js web applications
- `@lssm/app.overlay-editor` - Internal development tools
- `@lssm/lib.runtime-local` - Browser-only runtime
- `@lssm/lib.contracts-contractspec-studio` - Internal contracts
- `@lssm/tool.*` - Development tooling

### Current Publishable Packages (42 total)

As of the last scan, these packages will be published:

**Apps (3)**
- @lssm/app.cli-contractspec
- @lssm/app.cli-database
- @lssm/app.cli-databases

**Bundles (2)**
- @lssm/bundle.contractspec-studio
- @lssm/bundle.lifecycle-managed

**Libraries (35)**
- @lssm/lib.accessibility
- @lssm/lib.ai-agent
- @lssm/lib.analytics
- @lssm/lib.bus
- @lssm/lib.content-gen
- @lssm/lib.contracts
- @lssm/lib.cost-tracking
- @lssm/lib.database-contractspec-studio
- @lssm/lib.design-system
- @lssm/lib.error
- @lssm/lib.evolution
- @lssm/lib.exporter
- @lssm/lib.graphql-core
- @lssm/lib.graphql-federation
- @lssm/lib.graphql-prisma
- @lssm/lib.growth
- @lssm/lib.lifecycle
- @lssm/lib.logger
- @lssm/lib.multi-tenancy
- @lssm/lib.observability
- @lssm/lib.overlay-engine
- @lssm/lib.personalization
- @lssm/lib.presentation-runtime-core
- @lssm/lib.presentation-runtime-react
- @lssm/lib.presentation-runtime-react-native
- @lssm/lib.progressive-delivery
- @lssm/lib.resilience
- @lssm/lib.schema
- @lssm/lib.slo
- @lssm/lib.support-bot
- @lssm/lib.testing
- @lssm/lib.ui-kit
- @lssm/lib.ui-kit-web
- @lssm/lib.utils-typescript
- @lssm/lib.workflow-composer

**Modules (2)**
- @lssm/module.lifecycle-advisor
- @lssm/module.lifecycle-core

## Marking a Package as Private

To prevent a package from being published, add `"private": true` to its `package.json`:

```json
{
  "name": "@lssm/your-package",
  "version": "1.0.0",
  "private": true,
  "description": "Internal package not published to npm"
}
```

## Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DRY_RUN` | Test without publishing | `false` | `true` |
| `NPM_TAG` | npm dist-tag | `latest` | `beta`, `next` |

## Examples

### Publish to Beta Tag

```bash
NPM_TAG=beta node scripts/publish-packages.js
```

### Test Specific Package

```bash
# The script will automatically discover and publish only non-private packages
node scripts/publish-packages.js
```

### CI/CD Integration

See `CICD_PUBLISHING_GUIDE.md` for complete CI/CD setup instructions for:
- GitHub Actions
- GitLab CI
- CircleCI
- Other CI/CD platforms

## Troubleshooting

### Package Already Published

The script checks npm before publishing. If a version is already published, it will be skipped.

**Solution**: Bump the version in `package.json` before publishing.

### Workspace Dependencies

The script automatically resolves `workspace:*` dependencies to actual version numbers during publish.

If you see warnings about missing workspace dependencies, ensure:
1. The referenced package exists
2. It has a valid version in its `package.json`
3. It's been built (has a `dist` folder)

### Permission Errors

Ensure you have:
1. npm account with publish access to `@lssm` scope
2. Valid npm token (for CI/CD)
3. Logged in locally (`npm login` for manual publishing)

## Best Practices

1. **Always test first** - Run with `DRY_RUN=true` before actual publish
2. **Build before publish** - Run `bun run build` to ensure all packages are built
3. **Version management** - Use changesets or bump versions manually
4. **Review output** - Check the console output for warnings
5. **Verify on npm** - After publishing, check https://www.npmjs.com/org/lssm

## Links

- [npm @lssm Organization](https://www.npmjs.com/org/lssm)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)


























