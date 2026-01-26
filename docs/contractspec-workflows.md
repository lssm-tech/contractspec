# ContractSpec Automation: Current -> Future Mapping

## Current Workflows and Actions

### .github/workflows/contract-pr.yml (current)

- Triggers: pull_request
- Steps:
  - Checkout (fetch-depth 0)
  - Setup Bun, install dependencies, build
  - contractspec view (product + eng) against base branch
  - Post PR comment with product view summary (comment duplicated)
- Outputs: PR comment only
- Failure conditions: none (only script errors)
- Permissions: pull-requests: write

### .github/workflows/contract-drift.yml (current)

- Triggers: push to main, pull_request to main
- Steps:
  - Checkout
  - Setup Bun, install dependencies, build
  - contractspec validate
  - contractspec generate
  - Fail if generated/ has git changes
- Outputs: job logs only
- Failure conditions: validation failure, drift detected
- Permissions: default (contents: read)

### packages/apps/action-validation (current)

- Triggers: composite action (workflow-defined)
- Steps:
  - Setup Bun, install dependencies
  - Optional local CLI build
  - contractspec ci (JSON + SARIF)
  - Optional impact detection (contractspec impact)
  - Optional PR comments (validation failure + impact summary)
- Outputs: validation status, counts, SARIF/JSON paths, impact status
- Failure conditions: validation errors or breaking changes (if configured)
- Permissions: contents: read, security-events: write (SARIF), pull-requests: write (comments)

### packages/apps/action-version (current)

- Triggers: composite action (workflow-defined)
- Steps:
  - Setup Bun, install dependencies
  - Optional local CLI build
  - Version analyze or bump
  - Optional PR creation
- Outputs: has-changes, specs-bumped
- Failure conditions: CLI failures, git errors
- Permissions: contents: write (push), pull-requests: write (PR), GH token required

## Future Actions + Workflows (target state)

### packages/apps/action-pr (new)

- Trigger: composite action (workflow-defined)
- Responsibilities: view + validation + optional drift
- Inputs: package manager, working directory, report mode, drift toggle, fail-on, commands
- Outputs: drift-detected, breaking-change-detected, validation-failed
- Report: always write summary; optional PR comment
- Permissions: contents: read; pull-requests: write required for comments

### packages/apps/action-drift (new)

- Trigger: composite action (workflow-defined)
- Responsibilities: detect drift on main/nightly + report + optional issue/PR
- Inputs: package manager, working directory, generate-command, on-drift, allowlist
- Outputs: drift-detected
- Report: always write summary; optional issue/PR
- Permissions: contents: read; contents: write + pull-requests: write required for PR creation

### .github/workflows/contractspec-pr.yml (wrapper)

- Trigger: pull_request
- Calls: packages/apps/action-pr
- Permissions: contents: read; pull-requests: write

### .github/workflows/contractspec-drift.yml (wrapper)

- Trigger: push to main
- Calls: packages/apps/action-drift
- Permissions: contents: read

## Current -> Future Mapping

| Concern           | Current Location                       | Future Location                                        |
| ----------------- | -------------------------------------- | ------------------------------------------------------ |
| PR contract view  | contract-pr.yml                        | packages/apps/action-pr (report generator)             |
| PR comment        | contract-pr.yml                        | packages/apps/action-pr (report-mode=comment/both)     |
| Validation checks | contract-drift.yml + action-validation | packages/apps/action-pr (validate-command)             |
| Drift check       | contract-drift.yml                     | packages/apps/action-pr + packages/apps/action-drift   |
| Impact detection  | action-validation                      | packages/apps/action-pr (contractspec impact)          |
| Drift reporting   | job logs                               | report generator + summary/issue/PR (via action-drift) |
