# Publishing ContractSpec Libraries

This guide describes how we release the ContractSpec libraries to npm. We use a dual-track release system: **Stable** (manual) and **Canary** (automatic).

## Release Tracks

| Track | Branch | npm Tag | Frequency | Versioning | Use Case |
|-------|--------|---------|-----------|------------|----------|
| **Stable** | `release` | `latest` | Manual | SemVer (e.g., `1.7.4`) | Production, external users |
| **Canary** | `main` | `canary` | Every Push | Snapshot (e.g., `1.7.4-canary...`) | Dev, internal testing |

## Prerequisites

- ✅ `NPM_TOKEN` secret is configured in GitHub (owner or automation token with _publish_ scope).
- ✅ `GITHUB_TOKEN` (built-in) has permissions to create PRs (enabled by default in new repos).
- ✅ For stable releases: `release` branch exists and is protected.

## Canary Workflow (Automatic)

Every commit pushed to `main` triggers the `.github/workflows/publish-canary.yml` workflow.

1. **Trigger**: Push to `main`.
2. **Versioning**: Runs `changeset version --snapshot canary` to generate a temporary snapshot version.
3. **Publish**: Packages are published to npm with the `canary` tag using `changeset publish --tag canary`.

### Consuming Canary Builds

To install the latest bleeding-edge version:

```bash
npm install @lssm/lib.contracts@canary
# or
bun add @lssm/lib.contracts@canary
```

## Stable Release Workflow (Manual)

Stable releases are managed via the `release` branch using the standard [Changesets Action](https://github.com/changesets/action).

1. **Develop on `main`**: Create features and fixes.
2. **Add Changesets**: Run `bun changeset` to document changes and impact (major/minor/patch).
3. **Merge to `release`**: When ready to ship, open a PR from `main` to `release` or merge manually.
4. **"Version Packages" PR**:
   - The GitHub Action detects new changesets and automatically creates a Pull Request titled **"Version Packages"**.
   - This PR contains the version bumps and updated `CHANGELOG.md` files.
5. **Merge & Publish**:
   - Review and merge the "Version Packages" PR.
   - The Action runs again, detects the versions have been bumped, builds the libraries, and publishes them to npm with the `latest` tag.

### Publishing Steps

1. Ensure all changesets are present on `main`.
2. Merge `main` into `release`:
   ```bash
   git checkout release
   git pull origin release
   git merge main
   git push origin release
   ```
3. Go to GitHub Pull Requests. You will see a **"Version Packages"** PR created by the bot.
4. Merge that PR.
5. The release is now live on npm!

## Manual Verification (Optional)

Before publishing a new version you can run:

```bash
bun run build:not-apps
npx npm-packlist --json packages/libs/contracts
```

## Rollback

If a publish fails mid-way, re-run the workflow once the issue is fixed. Already published packages are skipped automatically. Use `npm deprecate <package>@<version>` if we need to warn consumers about a broken release.
