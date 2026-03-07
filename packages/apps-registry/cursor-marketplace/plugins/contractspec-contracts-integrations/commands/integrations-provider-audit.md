---
name: integrations-provider-audit
description: Audit integration providers for contract alignment, secrets handling, and runtime safety
---

Run a provider safety audit:

1. Verify provider registry entries align with declared contracts.
2. Verify credentials are pulled via secret providers, not literals.
3. Verify health checks, retries, and timeout handling are explicit.
4. Summarize gaps by provider name and remediation priority.
