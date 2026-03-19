# Security Policy

ContractSpec takes security seriously. We appreciate responsible disclosure and will work quickly to address issues.

## Supported Versions

Security updates are provided for the latest stable release.

For the OSS CLI path, "supported" currently means:

- Latest stable `contractspec` npm release
- Bun 1.3.x
- Linux and macOS for CLI onboarding and validation flows

The following are not currently supported security targets for the CLI onboarding path:

- Windows
- `npm` and `pnpm` as the primary package manager for `contractspec` onboarding flows
- Older ContractSpec releases that are no longer current on npm

If you are using an older release, upgrade before reporting a vulnerability.

## Release Verification

ContractSpec publishes npm packages from provenance-enabled GitHub Actions workflows.

You can verify a public release with:

- `npm view contractspec dist-tags --json`
- `npm view contractspec@<version> dist.tarball dist.integrity --json`

Each release workflow also uploads a release manifest artifact containing package names, versions, dist-tags, tarball filenames, and SHA256 values.

## Reporting a Vulnerability

Please report security issues privately.

- Email: security@contractspec.io
- Include: clear reproduction steps, affected versions, and impact assessment.

We will respond within 5 business days with next steps and a timeline for fixes.

## Security Expectations

- Do not open public issues for active vulnerabilities.
- Avoid sharing sensitive customer data when reporting issues.
- If you are unsure, email us first.

## Acknowledgements

We credit researchers who help improve ContractSpec security (with permission).
