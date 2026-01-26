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

## Future Reusable Workflows (target state)

### .github/workflows/contractspec-pr.yml (new)

- Trigger: workflow_call
- Responsibilities: view + validation + optional drift
- Inputs: package manager, working directory, report mode, drift toggle, fail_on, commands
- Outputs: drift_detected, breaking_change_detected, validation_failed
- Report: always write summary; optional PR comment
- Permissions: contents: read; pull-requests: write required for comments

### .github/workflows/contractspec-drift.yml (new)

- Trigger: workflow_call
- Responsibilities: detect drift on main/nightly + report + optional issue/PR
- Inputs: package manager, working directory, generate_command, on_drift, allowlist
- Outputs: drift_detected
- Report: always write summary; optional issue/PR
- Permissions: contents: read; contents: write + pull-requests: write required for PR creation

## Current -> Future Mapping

| Concern           | Current Location                       | Future Location                                             |
| ----------------- | -------------------------------------- | ----------------------------------------------------------- |
| PR contract view  | contract-pr.yml                        | contractspec-pr.yml (report generator)                      |
| PR comment        | contract-pr.yml                        | contractspec-pr.yml (report_mode=comment/both)              |
| Validation checks | contract-drift.yml + action-validation | contractspec-pr.yml (validate_command)                      |
| Drift check       | contract-drift.yml                     | contractspec-pr.yml (enable_drift) + contractspec-drift.yml |
| Impact detection  | action-validation                      | contractspec-pr.yml (contractspec impact)                   |
| Drift reporting   | job logs                               | report generator + summary/issue/PR                         |
