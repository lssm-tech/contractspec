# ContractSpec CI/CD Integration

This guide covers how to integrate ContractSpec validation into your CI/CD pipeline. ContractSpec provides a dedicated `ci` command designed for automated environments with support for multiple output formats.

## Quick Start

```bash
# Run all CI checks
contractspec ci

# Run with specific output format
contractspec ci --format json    # Machine-readable JSON
contractspec ci --format sarif   # GitHub Code Scanning compatible

# Write output to file
contractspec ci --format sarif --output results.sarif
```

## The `contractspec ci` Command

The `ci` command runs all validation checks and provides structured output suitable for CI/CD pipelines.

### Options

| Option | Description |
|--------|-------------|
| `--pattern <glob>` | Glob pattern for spec discovery |
| `--format <format>` | Output format: `text`, `json`, `sarif` (default: `text`) |
| `--output <file>` | Write results to file |
| `--fail-on-warnings` | Exit with code 2 on warnings |
| `--skip <checks>` | Skip specific checks (comma-separated) |
| `--checks <checks>` | Only run specific checks (comma-separated) |
| `--check-handlers` | Include handler implementation checks |
| `--check-tests` | Include test coverage checks |
| `--verbose` | Verbose output |

### Available Checks

| Check | Description | Default Severity |
|-------|-------------|-----------------|
| `structure` | Validate spec structure (meta, io, policy fields) | error |
| `integrity` | Find orphaned specs and broken references | error/warning |
| `deps` | Detect circular dependencies and missing refs | error |
| `doctor` | Check installation health (skip AI in CI) | error/warning |
| `handlers` | Verify handler implementations exist | warning |
| `tests` | Verify test files exist | warning |

### Exit Codes

| Code | Description |
|------|-------------|
| `0` | All checks passed |
| `1` | Errors found |
| `2` | Warnings found (with `--fail-on-warnings`) |

## GitHub Actions

### Using the Official Action

The easiest way to integrate with GitHub Actions is using the official action:

```yaml
name: ContractSpec CI

on: [push, pull_request]

jobs:
  contractspec:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write  # Required for SARIF upload
    steps:
      - uses: actions/checkout@v4

      - name: Run ContractSpec CI
        uses: lssm/contractspec-action@v1
        with:
          checks: 'all'
          upload-sarif: true
```

### Manual Setup (without the action)

```yaml
name: ContractSpec CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run ContractSpec CI
        run: |
          npx contractspec ci --format sarif --output results.sarif
          npx contractspec ci --format text

      - name: Upload SARIF to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif
          category: contractspec
```

### GitHub Code Scanning Integration

When you upload SARIF results, issues appear:
- Inline on pull requests
- In the Security tab under "Code scanning alerts"
- As annotations in the GitHub UI

## GitLab CI

```yaml
# .gitlab-ci.yml

stages:
  - validate

contractspec:
  stage: validate
  image: oven/bun:latest
  script:
    - bun install
    - npx contractspec ci --format json --output results.json
    - npx contractspec ci --format text
  artifacts:
    reports:
      # GitLab doesn't natively support SARIF, but you can store as artifact
      dotenv: results.json
    paths:
      - results.json
    when: always
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# For GitLab Ultimate with SAST, you can use the SARIF output
contractspec-sast:
  stage: validate
  image: oven/bun:latest
  script:
    - bun install
    - npx contractspec ci --format sarif --output gl-sast-report.json
  artifacts:
    reports:
      sast: gl-sast-report.json
    when: always
  allow_failure: true
```

## Jenkins

### Jenkinsfile (Declarative)

```groovy
pipeline {
    agent {
        docker {
            image 'oven/bun:latest'
        }
    }

    stages {
        stage('Install') {
            steps {
                sh 'bun install'
            }
        }

        stage('Validate Contracts') {
            steps {
                script {
                    def result = sh(
                        script: 'npx contractspec ci --format json --output results.json',
                        returnStatus: true
                    )

                    // Also generate human-readable output
                    sh 'npx contractspec ci --format text || true'

                    // Archive results
                    archiveArtifacts artifacts: 'results.json', allowEmptyArchive: true

                    // Fail build on errors
                    if (result != 0) {
                        error("ContractSpec validation failed")
                    }
                }
            }
        }
    }

    post {
        always {
            // Parse JSON results and add to build
            script {
                if (fileExists('results.json')) {
                    def results = readJSON file: 'results.json'
                    echo "Errors: ${results.summary?.totalErrors ?: results.errors ?: 0}"
                    echo "Warnings: ${results.summary?.totalWarnings ?: results.warnings ?: 0}"
                }
            }
        }
    }
}
```

### Jenkinsfile (Scripted)

```groovy
node {
    stage('Checkout') {
        checkout scm
    }

    docker.image('oven/bun:latest').inside {
        stage('Install') {
            sh 'bun install'
        }

        stage('Validate') {
            def exitCode = sh(
                script: 'npx contractspec ci --format json --output results.json',
                returnStatus: true
            )

            sh 'npx contractspec ci --format text || true'

            archiveArtifacts 'results.json'

            if (exitCode != 0) {
                currentBuild.result = 'FAILURE'
                error 'ContractSpec validation failed'
            }
        }
    }
}
```

## AWS CodeBuild

### buildspec.yml

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - curl -fsSL https://bun.sh/install | bash
      - export PATH="$HOME/.bun/bin:$PATH"
      - bun install

  build:
    commands:
      - npx contractspec ci --format json --output results.json
      - npx contractspec ci --format text

  post_build:
    commands:
      - |
        if [ -f results.json ]; then
          echo "ContractSpec Results:"
          cat results.json | jq '.summary // {errors: .errors, warnings: .warnings}'
        fi

reports:
  contractspec-reports:
    files:
      - results.json
    file-format: 'GENERICJSON'

artifacts:
  files:
    - results.json
    - results.sarif
  discard-paths: yes
```

## CircleCI

```yaml
# .circleci/config.yml

version: 2.1

orbs:
  bun: oven/bun@1

jobs:
  validate-contracts:
    executor: bun/default
    steps:
      - checkout
      - bun/install
      - run:
          name: Run ContractSpec CI
          command: |
            npx contractspec ci --format json --output results.json
            npx contractspec ci --format text
      - store_artifacts:
          path: results.json
          destination: contractspec-results
      - run:
          name: Check results
          command: |
            ERRORS=$(jq -r '.summary.totalErrors // .errors // 0' results.json)
            if [ "$ERRORS" -gt 0 ]; then
              echo "ContractSpec found $ERRORS error(s)"
              exit 1
            fi

workflows:
  validate:
    jobs:
      - validate-contracts
```

## Azure DevOps

```yaml
# azure-pipelines.yml

trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: UseNode@1
    inputs:
      version: '20.x'

  - script: |
      curl -fsSL https://bun.sh/install | bash
      export PATH="$HOME/.bun/bin:$PATH"
      bun install
    displayName: 'Install dependencies'

  - script: |
      npx contractspec ci --format json --output $(Build.ArtifactStagingDirectory)/results.json
      npx contractspec ci --format text
    displayName: 'Run ContractSpec CI'
    continueOnError: true

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: '$(Build.ArtifactStagingDirectory)/results.json'
      artifactName: 'contractspec-results'
    condition: always()

  - script: |
      ERRORS=$(jq -r '.summary.totalErrors // .errors // 0' $(Build.ArtifactStagingDirectory)/results.json)
      if [ "$ERRORS" -gt 0 ]; then
        echo "##vso[task.logissue type=error]ContractSpec found $ERRORS error(s)"
        exit 1
      fi
    displayName: 'Check results'
```

## Bitbucket Pipelines

```yaml
# bitbucket-pipelines.yml

image: oven/bun:latest

pipelines:
  default:
    - step:
        name: Validate Contracts
        script:
          - bun install
          - npx contractspec ci --format json --output results.json
          - npx contractspec ci --format text
        artifacts:
          - results.json

  pull-requests:
    '**':
      - step:
          name: Validate Contracts
          script:
            - bun install
            - npx contractspec ci --format json --output results.json
            - npx contractspec ci --format text
          artifacts:
            - results.json
```

## Output Formats

### Text Output

Human-readable output with colors and formatting:

```
📋 ContractSpec CI Check Results

Git: branch: main, commit: abc1234

Check Results:
  ✓ Spec Structure Validation: passed (45ms)
  ✗ Contract Integrity Analysis: 2 error(s), 1 warning(s) (120ms)
  ✓ Dependency Analysis: passed (30ms)
  ✓ Installation Health: passed (15ms)

Issues:

  Errors:
    ✗ Event user.created.v1 not found (src/features/auth.feature.ts)
    ✗ Circular dependency detected: a → b → c → a

  Warnings:
    ⚠ operation user.signup.v1 is not linked to any feature

──────────────────────────────────────────────────
Found: 2 error(s), 1 warning(s)
Duration: 210ms

❌ CI checks failed
```

### JSON Output

Machine-readable JSON for scripting:

```json
{
  "success": false,
  "summary": {
    "totalErrors": 2,
    "totalWarnings": 1,
    "totalNotes": 0,
    "durationMs": 210,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "commitSha": "abc1234",
    "branch": "main"
  },
  "categories": [
    {
      "category": "structure",
      "label": "Spec Structure Validation",
      "passed": true,
      "errors": 0,
      "warnings": 0,
      "notes": 0,
      "durationMs": 45
    }
  ],
  "issues": [
    {
      "ruleId": "integrity-unresolved-ref",
      "severity": "error",
      "message": "Event user.created.v1 not found",
      "category": "integrity",
      "file": "src/features/auth.feature.ts"
    }
  ]
}
```

### SARIF Output

Static Analysis Results Interchange Format for GitHub Code Scanning:

```json
{
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "version": "2.1.0",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "ContractSpec",
          "version": "1.0.0",
          "rules": [...]
        }
      },
      "results": [...]
    }
  ]
}
```

## Best Practices

### 1. Run on Pull Requests

Always validate contracts on pull requests to catch issues before merge:

```yaml
on:
  pull_request:
    branches: [main, develop]
```

### 2. Skip AI Checks in CI

The `doctor` check automatically skips AI provider validation in CI environments.

### 3. Use SARIF for GitHub

Upload SARIF to get inline annotations on PRs:

```yaml
- uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif
```

### 4. Cache Dependencies

Speed up CI by caching node_modules:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
```

### 5. Parallel Checks for Monorepos

Run checks in parallel for each package:

```yaml
strategy:
  matrix:
    package: [api, web, shared]
steps:
  - uses: lssm/contractspec-action@v1
    with:
      working-directory: packages/${{ matrix.package }}
```

## Troubleshooting

### Exit Code 1 but No Visible Errors

Check the JSON output for full details:

```bash
contractspec ci --format json
```

### SARIF Upload Fails

Ensure you have the `security-events: write` permission:

```yaml
permissions:
  security-events: write
```

### Timeout in Large Monorepos

Use a specific pattern to limit scope:

```bash
contractspec ci --pattern 'packages/my-app/**/*.contracts.ts'
```

### Missing Dependencies

Ensure all workspace dependencies are installed:

```bash
bun install
# or for npm workspaces
npm ci --workspaces
```




