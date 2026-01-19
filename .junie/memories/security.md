# Security & Secrets

Principles:

- Secrets live only in env/config stores; never in code, commits, or logs.
- Least privilege by default; minimize scopes/roles/keys.
- PII must be minimized, validated, and redacted in transit/logs/storage.

Requirements:

- Secrets/config: use env vars; rotate keys; avoid local hardcoding; commit no `.env`.
- Transport: HTTPS only; no mixed content; verify TLS; pin hosts when possible.
- Data handling: classify PII; hash/salt where feasible; encrypt at rest if supported.
- Logging: never log secrets/PII; use redaction; sample high-volume events.
- Access: ensure authz checks on every mutation/read path; default deny.

Reviews/checks:

- Add security notes to PRs when touching auth/crypto/data access.
- Run dependency audit; patch critical/high vulns before release.
- Document any new data collected (purpose, retention, access).
