# Publishing Setup Summary

This document summarizes the automated package publishing setup for the @lssm monorepo.

## What Was Done

### 1. ✅ Automated Package Discovery

Updated `scripts/publish-packages.js` to automatically discover all publishable packages instead of maintaining a hardcoded list.

**Before**: Only 20 packages were listed manually
**After**: Automatically discovers **42 publishable packages** from the monorepo

### 2. ✅ Respects Private Packages

The script now properly skips packages marked with `"private": true`:

#### Private Packages (NOT published to npm):
- `@lssm/apps.web-contractspec-landing` - Next.js landing site
- `@lssm/app.overlay-editor` - Internal development tool
- `@lssm/lib.runtime-local` - Browser-only runtime
- `@lssm/lib.contracts-contractspec-studio` - Internal contracts
- `@lssm/tool.tsdown` - Build tooling
- `@lssm/tool.typescript` - TypeScript configuration

#### Public Packages (published to npm):

**CLI Applications (3)**
- @lssm/app.cli-contracts - Contract specification CLI
- @lssm/app.cli-database - Database management CLI
- @lssm/app.cli-databases - Multi-database CLI

**Bundles (2)**
- @lssm/bundle.contractspec-studio - ContractSpec Studio bundle
- @lssm/bundle.lifecycle-managed - Lifecycle management bundle

**Core Libraries (35)**
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

### 3. ✅ Documentation Created

Created comprehensive documentation:

- **`scripts/README.md`** - Quick start guide for publishing
- **`scripts/CICD_PUBLISHING_GUIDE.md`** - Complete CI/CD setup guide with examples for:
  - GitHub Actions
  - GitLab CI
  - CircleCI
  - General best practices

### 4. ✅ Key Features

The updated publishing system includes:

- **Automatic Discovery**: No need to manually maintain package lists
- **Privacy Respect**: Automatically skips private packages
- **Dry Run Mode**: Test before publishing with `DRY_RUN=true`
- **Workspace Resolution**: Converts `workspace:*` to actual versions
- **Duplicate Prevention**: Checks npm registry before publishing
- **Flexible Tagging**: Support for different npm tags (latest, beta, next)

## Quick Start

### Local Testing (Dry Run)

```bash
cd packages/contractspec
DRY_RUN=true node scripts/publish-packages.js
```

Output shows:
- Which packages would be published
- Their current versions
- Any workspace dependency warnings
- **Does NOT actually publish**

### Manual Publishing

```bash
# 1. Ensure you're authenticated
npm login

# 2. Build all packages
bun run build

# 3. Navigate to contractspec
cd packages/contractspec

# 4. Publish
node scripts/publish-packages.js
```

### CI/CD Publishing

See `scripts/CICD_PUBLISHING_GUIDE.md` for complete CI/CD setup instructions.

#### Minimal GitHub Actions Example:

```yaml
name: Publish Packages
on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - run: |
          echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc
          cd packages/contractspec
          node scripts/publish-packages.js
```

## Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DRY_RUN` | Test without publishing | `false` | `true`, `1` |
| `NPM_TAG` | npm dist-tag to use | `latest` | `beta`, `next`, `canary` |

### Making a Package Private

To prevent publishing, add to `package.json`:

```json
{
  "name": "@lssm/your-package",
  "version": "1.0.0",
  "private": true
}
```

## Security Considerations

✅ **Implemented:**
- Script respects package privacy settings
- No hardcoded credentials
- Supports npm automation tokens

⚠️ **Required for CI/CD:**
- Set `NPM_TOKEN` as a secret in your CI/CD system
- Use npm automation tokens (not your personal token)
- Limit token scope to `@lssm` organization
- Rotate tokens every 90 days

## Scope Note

All packages use the `@lssm` scope, **NOT** `@contractspec`. The name "contractspec" refers to the product/project, but the npm organization is `@lssm`.

**Correct**: `@lssm/lib.contracts`
**Incorrect**: `@contractspec/lib.contracts`

## Package Versioning

The script publishes whatever version is in each `package.json`. Version management strategies:

### Option 1: Changesets (Recommended)

Use [@changesets/cli](https://github.com/changesets/changesets):

```bash
# Create a changeset
npx changeset

# Version packages (updates package.json files)
npx changeset version

# Publish (done by CI/CD)
node scripts/publish-packages.js
```

### Option 2: Manual Versioning

Update versions manually in `package.json` files before publishing.

## Troubleshooting

### Already Published Error

If a version is already published, the script skips it:

```
[publish] Skipping @lssm/lib.contracts@1.7.4 (already published).
```

**Solution**: Bump the version in `package.json`

### Workspace Dependencies Warning

```
[publish] @lssm/tool.tsdown referenced via "workspace:*" but no local version is available
```

**Cause**: The referenced package is private or doesn't exist.

**Solution**:
- If it's a dev tool, move to `devDependencies`
- If it should be public, remove `"private": true`
- If it's private but needed, ensure it's built first

### Permission Denied

```
npm ERR! code E403
npm ERR! 403 Forbidden
```

**Solution**:
- Verify npm token has publish access
- Check you have access to `@lssm` scope
- For local: run `npm login`
- For CI/CD: verify `NPM_TOKEN` secret is set

## Next Steps

1. **Test the script**: Run with `DRY_RUN=true` to verify package discovery
2. **Set up CI/CD**: Follow the guide in `scripts/CICD_PUBLISHING_GUIDE.md`
3. **Configure npm tokens**: Generate automation tokens for CI/CD
4. **Implement versioning**: Choose between changesets or manual versioning
5. **Review package privacy**: Ensure all packages have correct privacy settings

## Additional Resources

- [npm @lssm Organization](https://www.npmjs.com/org/lssm)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions npm Publishing](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)

## Support

For issues or questions:

1. Check the dry run output: `DRY_RUN=true node scripts/publish-packages.js`
2. Review the CI/CD guide: `scripts/CICD_PUBLISHING_GUIDE.md`
3. Verify package privacy settings
4. Check npm registry status: https://status.npmjs.org

---

**Last Updated**: November 22, 2025
**Script Version**: Automatic discovery with privacy respect
**Total Publishable Packages**: 42












