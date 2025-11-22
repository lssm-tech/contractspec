# CI/CD Publishing Guide for @lssm Packages

This guide explains how to configure CI/CD pipelines to publish packages to npm automatically.

## Overview

The `publish-packages.js` script automatically discovers and publishes all non-private packages in the monorepo. It:

- ✅ **Discovers packages automatically** - No manual package list maintenance
- ✅ **Respects privacy** - Skips packages marked with `"private": true`
- ✅ **Handles workspace dependencies** - Converts `workspace:*` to actual versions
- ✅ **Prevents duplicate publishes** - Checks npm registry before publishing
- ✅ **Supports dry-run mode** - Test without actually publishing

## Package Privacy Rules

### Automatically Published (Public Packages)

All packages **without** `"private": true` in their `package.json` will be published:

- `packages/libs/*` - Library packages (e.g., `@lssm/lib.contracts`, `@lssm/lib.schema`)
- `packages/apps/cli-*` - CLI applications (e.g., `@lssm/app.cli-contracts`)
- `packages/bundles/*` - Bundle packages (e.g., `@lssm/bundle.lifecycle-managed`)
- `packages/modules/*` - Module packages (e.g., `@lssm/module.lifecycle-core`)

### Automatically Skipped (Private Packages)

Packages marked with `"private": true` are never published:

- `packages/apps/web-*` - Next.js web applications
- `packages/apps/overlay-editor` - Internal tools
- `packages/libs/runtime-local` - Browser-only runtime (not for npm)
- `packages/libs/contracts-contractspec-studio` - Internal contracts
- `packages/tools/*` - Development tools

### Making a Package Private

To prevent a package from being published, add this to its `package.json`:

```json
{
  "name": "@lssm/your-package",
  "version": "1.0.0",
  "private": true  // ← This prevents publishing
}
```

## Local Testing

### Dry Run (Recommended First Step)

Test the script without actually publishing:

```bash
cd packages/contractspec
DRY_RUN=true node scripts/publish-packages.js
```

This will:
- Show which packages would be published
- Display their versions
- Show workspace dependency resolution
- **Not actually publish to npm**

### Publish to a Specific Tag

Test publishing to a test tag:

```bash
NPM_TAG=beta node scripts/publish-packages.js
```

## CI/CD Configuration

### Prerequisites

1. **npm Token**: Generate an npm automation token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. **Access Rights**: Ensure the npm token has publish access to the `@lssm` scope
3. **Build Step**: Ensure packages are built before publishing

### GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  push:
    branches:
      - main
    paths:
      - 'packages/**'
      - '.changeset/**'
  workflow_dispatch: # Manual trigger

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write # For changesets to create release PRs
      pull-requests: write # For changesets to create release PRs
      
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Required for changesets

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.0

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build packages
        run: bun run build

      - name: Setup npm authentication
        run: |
          echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc

      - name: Publish packages
        run: node scripts/publish-packages.js
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          # Optional: use a different tag for pre-releases
          # NPM_TAG: beta

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: node scripts/publish-packages.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
publish:
  stage: deploy
  image: oven/bun:1.3.0
  only:
    - main
  variables:
    NPM_TOKEN: $NPM_TOKEN
  before_script:
    - echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
    - bun install --frozen-lockfile
  script:
    - bun run build
    - cd packages/contractspec
    - node scripts/publish-packages.js
  only:
    refs:
      - main
    changes:
      - packages/**
      - .changeset/**

# Dry run for merge requests
publish:dry-run:
  stage: test
  image: oven/bun:1.3.0
  only:
    - merge_requests
  before_script:
    - bun install --frozen-lockfile
  script:
    - bun run build
    - cd packages/contractspec
    - DRY_RUN=true node scripts/publish-packages.js
```

### CircleCI

Create `.circleci/config.yml`:

```yaml
version: 2.1

executors:
  node-executor:
    docker:
      - image: oven/bun:1.3.0

jobs:
  publish:
    executor: node-executor
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "bun.lock" }}
      - run:
          name: Install dependencies
          command: bun install --frozen-lockfile
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "bun.lock" }}
      - run:
          name: Build packages
          command: bun run build
      - run:
          name: Setup npm authentication
          command: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
      - run:
          name: Publish packages
          command: |
            cd packages/contractspec
            node scripts/publish-packages.js

workflows:
  version: 2
  publish-workflow:
    jobs:
      - publish:
          filters:
            branches:
              only: main
          context: npm-publish # Create this context with NPM_TOKEN
```

### Environment Variables

All CI/CD systems need these environment variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NPM_TOKEN` | npm automation token | Yes | `npm_xxx...` |
| `DRY_RUN` | Set to `true` to test without publishing | No | `true` or `false` |
| `NPM_TAG` | npm dist-tag to publish under | No | `latest`, `beta`, `next` |

## Publishing Strategy

### Recommended: Changesets Workflow

Use [@changesets/cli](https://github.com/changesets/changesets) for version management:

1. **Development**: Create changesets when making changes
   ```bash
   npx changeset
   ```

2. **CI/CD**: Automatically publish when merged to main
   - Changesets creates a "Version Packages" PR
   - When merged, CI/CD runs and publishes updated packages

3. **Benefits**:
   - Automatic version bumping
   - Automatic changelog generation
   - Handles monorepo dependencies correctly

### Alternative: Manual Versioning

If not using changesets:

1. Update versions in `package.json` files manually
2. Commit and push to main
3. CI/CD detects changes and publishes

## Troubleshooting

### Package Already Published

If a package version is already published, the script will skip it:

```
[publish] Skipping @lssm/lib.contracts@1.7.4 (already published).
```

**Solution**: Bump the version in `package.json`

### Workspace Dependencies Not Resolved

If you see warnings like:

```
[publish] @lssm/tool.tsdown referenced via "workspace:*" but no local version is available
```

**Causes**:
- The referenced package is private (marked with `"private": true`)
- The referenced package doesn't exist in the workspace

**Solutions**:
1. If it should be public: Remove `"private": true` from its `package.json`
2. If it's a dev tool: Move it to `devDependencies`
3. If it's private but needed: Ensure it's built before publishing

### Permission Denied

```
npm ERR! code E403
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/@lssm/...
```

**Solutions**:
1. Verify npm token has publish permissions
2. Ensure you have access to the `@lssm` scope
3. Check the token is correctly set in `~/.npmrc`

## Security Best Practices

1. **Never commit npm tokens** to version control
2. **Use automation tokens** (not your personal token) for CI/CD
3. **Limit token scope** to only the packages that need publishing
4. **Rotate tokens regularly** (every 90 days recommended)
5. **Use separate tokens** for different environments (CI vs manual)

## Package Naming Convention

All packages use the `@lssm` scope:

- `@lssm/lib.*` - Library packages
- `@lssm/app.*` - Application packages
- `@lssm/bundle.*` - Bundle packages
- `@lssm/module.*` - Module packages

## Support

For issues with the publishing script, check:

1. Run with `DRY_RUN=true` to see what would happen
2. Verify package versions are bumped
3. Check npm registry for existing versions
4. Ensure all packages are built before publishing

## Example: Full Publication Flow

```bash
# 1. Ensure you're on main branch
git checkout main
git pull

# 2. Install dependencies
bun install

# 3. Build all packages
bun run build

# 4. Test publish (dry run)
cd packages/contractspec
DRY_RUN=true node scripts/publish-packages.js

# 5. Review output, then publish for real
node scripts/publish-packages.js

# 6. Verify packages on npm
open https://www.npmjs.com/org/lssm
```

## Notes

- The script automatically handles dependency ordering (it publishes in the order listed in `packagesByName`)
- Workspace dependencies (`workspace:*`) are automatically converted to actual version numbers
- The script preserves the original `package.json` after publishing (it reverts workspace reference changes)

