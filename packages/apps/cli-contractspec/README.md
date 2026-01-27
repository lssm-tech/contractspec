# @contractspec/app.cli-contractspec

Website: https://contractspec.io/

**Stabilize your AI-generated code** — Define contracts once, generate consistent code across API, DB, UI, and events. Safe regeneration. No lock-in.

CLI tool for creating, building, and validating contract specifications.

## Installation

```bash
bun add -D @contractspec/app.cli-contractspec
```

## Quick Start

```bash
# Create a new contract spec interactively
contractspec create

# Create with AI assistance
contractspec create --ai

# Build implementation from spec
contractspec build src/contracts/mySpec.ts

# Validate a spec
contractspec validate src/contracts/mySpec.ts
```

## Commands

### `contractspec list`

List all contract specifications in the project with filtering options.

**Options:**

- `--pattern <pattern>` - File pattern to search (glob)
- `--deep` - Load spec modules to extract richer metadata (executes spec modules)
- `--type <type>` - Filter by spec type (operation, event, presentation, etc.)
- `--owner <owner>` - Filter by owner
- `--tag <tag>` - Filter by tag
- `--stability <level>` - Filter by stability (experimental, beta, stable, deprecated)
- `--json` - Output as JSON for scripting

**Examples:**

```bash
# List all specs
contractspec list

# Filter by type and stability
contractspec list --type operation --stability stable

# Find specs by owner
contractspec list --owner @team-platform

# JSON output for scripting
contractspec list --json
```

### `contractspec watch`

Watch contract specifications and auto-regenerate on changes.

**Options:**

- `--pattern <pattern>` - File pattern to watch (default: `**/*.contracts.ts`)
- `--build` - Auto-run build command on changes
- `--validate` - Auto-run validate command on changes
- `--on-start <mode>` - Run action on startup: none|validate|build|both (default: none)
- `--continue-on-error` - Do not exit on build/validate errors
- `--debounce <ms>` - Debounce delay in milliseconds (default: 500)

**Examples:**

```bash
# Watch for changes and auto-build
contractspec watch --build

# Watch and auto-validate
contractspec watch --validate

# Custom pattern and debounce
contractspec watch --pattern 'src/**/*.ts' --debounce 1000
```

### `contractspec sync`

Sync contracts by building all discovered specs.

**Options:**

- `--pattern <pattern>` - File pattern to search (glob)
- `--buckets <buckets>` - Optional output buckets (comma-separated). Builds repeat into `./generated/<bucket>/`
- `--surfaces <surfaces>` - (deprecated) Alias for `--buckets`
- `--validate` - Validate each spec before building (spec-only)
- `--dry-run` - Show what would be synced without making changes

**Examples:**

```bash
# Sync all surfaces
contractspec sync

# Sync specific surfaces
contractspec sync --surfaces api,ui

# Preview changes
contractspec sync --dry-run
```

### `contractspec clean`

Clean generated files and build artifacts.

**Options:**

- `--dry-run` - Show what would be deleted without deleting
- `--generated-only` - Only clean generated directories (generated/, dist/, .turbo/, outputDir artifacts)
- `--older-than <days>` - Only clean files older than specified days
- `--force` - Skip confirmation prompts
- `--git-clean` - Use `git clean -fdx` for comprehensive cleanup (requires confirmation or `--force`)

**Examples:**

```bash
# Clean all generated files
contractspec clean

# Preview cleanup
contractspec clean --dry-run

# Clean only old files
contractspec clean --older-than 30

# Use git clean
contractspec clean --git-clean
```

### `contractspec deps`

Analyze contract dependencies and relationships.

**Options:**

- `--pattern <pattern>` - File pattern to search (glob)
- `--entry <name>` - Focus on a specific contract name
- `--format <format>` - text|json|dot (default: text)
- `--graph` - (deprecated) Same as `--format dot`
- `--circular` - Find circular dependencies
- `--missing` - Find missing dependencies
- `--json` - (deprecated) Same as `--format json`

**Examples:**

```bash
# Show dependency overview
contractspec deps

# Analyze specific contract
contractspec deps --entry user.signup

# Find circular dependencies
contractspec deps --circular

# Generate graphviz graph
contractspec deps --format dot > deps.dot
```

### `contractspec diff`

Compare contract specifications and show differences.

**Arguments:**

- `<spec1> <spec2>` - Two spec files to compare

**Options:**

- `--breaking` - Only show breaking changes
- `--semantic` - Show semantic differences (not just text)
- `--json` - Output as JSON for scripting
- `--baseline <ref>` - Compare with git reference (branch/commit)

**Examples:**

```bash
# Compare two specs
contractspec diff spec1.ts spec2.ts

# Compare with git branch
contractspec diff spec.ts spec.ts --baseline main

# Show only breaking changes
contractspec diff spec1.ts spec2.ts --breaking

# Semantic comparison
contractspec diff spec1.ts spec2.ts --semantic
```

### `contractspec openapi`

Import/Export OpenAPI specifications.

#### `contractspec openapi import`

Import an OpenAPI specification and generate ContractSpec models or other schema formats.

**Options:**

- `--file <path>` - Path to OpenAPI file (json/yaml) or URL
- `--output <dir>` - Output directory
- `--schema-format <format>` - Output schema format: `contractspec` (default), `zod`, `json-schema`, `graphql`
- `--prefix <prefix>` - Prefix for generated models

**Examples:**

```bash
# Import as ContractSpec (default)
contractspec openapi import --file api.json --output ./models

# Import as Zod schemas
contractspec openapi import --file api.json --output ./zod --schema-format zod

# Import as GraphQL types
contractspec openapi import --file api.json --output ./gql --schema-format graphql
```

### `contractspec vibe`

Guided workflows for "Vibe Coding" with safeguards and discipline.

**Subcommands:**

- `init` - Initialize Vibe directories and config
- `run <workflow>` - Run a managed workflow
- `pack install <path>` - Install a local workflow pack
- `context export` - Export safe context for AI agents

**Examples:**

```bash
# Initialize
contractspec vibe init

# Run OpenAPI import workflow
contractspec vibe run brownfield.openapi-import

# Run with stricter tracking
contractspec vibe run change.feature --track regulated

# Export context for AI
contractspec vibe context export
```

### `contractspec create`

Interactive wizard to create contract specifications.

**Options:**

- `--type <type>` - Spec type: operation, event, presentation, form, feature
- `--ai` - Use AI to generate spec from description
- `--provider <provider>` - AI provider: claude, openai, ollama, custom
- `--model <model>` - AI model to use

**Examples:**

```bash
# Interactive wizard
contractspec create

# Create operation spec with AI
contractspec create --type operation --ai

# Use local Ollama model
contractspec create --ai --provider ollama --model codellama
```

### `contractspec build`

Generate implementation code from contract specs using AI agents with automatic fallbacks.

**Options:**

- `--output-dir <dir>` - Output directory (default: ./generated)
- `--provider <provider>` - AI provider: claude, openai, ollama, custom
- `--model <model>` - AI model to use
- `--agent-mode <mode>` - Agent mode: simple, cursor, claude-code, openai-codex, opencode
- `--no-tests` - Skip test generation
- `--no-agent` - Disable AI (use basic templates)

> ℹ️ The build command automatically orchestrates between the selected agent and lightweight templates. If an agent becomes unavailable (missing API key, Cursor not running, etc.) the CLI falls back to deterministic templates so the build never blocks.

**Examples:**

```bash
# Generate handler from operation spec (default: simple agent)
contractspec build src/contracts/signup.contracts.ts

# Use Claude Code agent for high-quality production code
contractspec build src/contracts/signup.contracts.ts --agent-mode claude-code

# Use OpenAI Codex for algorithmic implementations
contractspec build src/contracts/optimizer.contracts.ts --agent-mode openai-codex

# Generate without AI (basic templates only)
contractspec build src/contracts/simple.contracts.ts --no-agent
```

### `contractspec validate`

Validate contract specifications and optionally verify implementations against specs using AI.

**Options:**

- `--check-implementation` - Validate implementation against spec using AI
- `--implementation-path <path>` - Path to implementation (auto-detected if not specified)
- `--agent-mode <mode>` - Agent mode for validation: simple, claude-code, openai-codex, opencode
- `--check-handlers` - Verify handler implementations exist
- `--check-tests` - Verify test coverage
- `-i, --interactive` - Interactive mode - prompt for what to validate

> ℹ️ When no validation scope is provided, the CLI prompts you to choose between spec-only validation or full spec + implementation validation. In non-interactive environments it defaults to spec-only. Use `--check-implementation` to skip the prompt.

**Examples:**

```bash
# Validate spec structure only
contractspec validate src/contracts/signup.contracts.ts

# Validate implementation against spec with AI
contractspec validate src/contracts/signup.contracts.ts --check-implementation

# Interactive validation with Claude Code agent
contractspec validate src/contracts/signup.contracts.ts -i --agent-mode claude-code

# Validate specific implementation file
contractspec validate src/contracts/signup.contracts.ts \
  --check-implementation \
  --implementation-path src/handlers/signup.handler.ts \
  --agent-mode claude-code
```

### `contractspec ci`

Run all validation checks for CI/CD pipelines with machine-readable output formats.

**Options:**

- `--pattern <glob>` - Glob pattern for spec discovery
- `--format <format>` - Output format: text, json, sarif (default: text)
- `--output <file>` - Write results to file
- `--fail-on-warnings` - Exit with code 2 on warnings
- `--skip <checks>` - Skip specific checks (comma-separated)
- `--checks <checks>` - Only run specific checks (comma-separated)
- `--check-handlers` - Include handler implementation checks
- `--check-tests` - Include test coverage checks
- `--verbose` - Verbose output

**Available Checks:**

- `structure` - Spec structure validation (meta, io, policy)
- `integrity` - Contract integrity (orphaned specs, broken refs)
- `deps` - Dependency analysis (circular deps, missing refs)
- `doctor` - Installation health (skips AI in CI)
- `handlers` - Handler implementation existence
- `tests` - Test file existence

**Exit Codes:**

- `0` - All checks passed
- `1` - Errors found
- `2` - Warnings found (with `--fail-on-warnings`)

**Examples:**

```bash
# Run all CI checks
contractspec ci

# Output as JSON for parsing
contractspec ci --format json

# Output SARIF for GitHub Code Scanning
contractspec ci --format sarif --output results.sarif

# Skip doctor checks
contractspec ci

# Run only structure and integrity checks
contractspec ci --checks structure,integrity

# Fail on warnings
contractspec ci --fail-on-warnings
```

For comprehensive CI/CD integration guides (GitHub Actions, GitLab CI, Jenkins, AWS CodeBuild, etc.), see [docs/ci-cd.md](./docs/ci-cd.md).

## Configuration

Create a `.contractsrc.json` file in your project root:

```json
{
  "aiProvider": "claude",
  "aiModel": "claude-3-7-sonnet-20250219",
  "agentMode": "claude-code",
  "outputDir": "./src",
  "conventions": {
    "operations": "interactions/commands|queries",
    "events": "events",
    "presentations": "presentations",
    "forms": "forms"
  },
  "defaultOwners": ["@team"],
  "defaultTags": ["auto-generated"]
}
```

### Agent Modes

The CLI supports multiple AI agent modes for different use cases:

- **simple** (default) - Direct LLM API calls, fast and straightforward
- **cursor** - Leverages Windsurf/Cursor agentic capabilities (requires Cursor environment)
- **claude-code** - Uses Claude with extended thinking, best for production code and validation
- **openai-codex** - Uses GPT-4o/o1 models, excellent for algorithms and optimization
- **opencode** (alias for opencode-sdk) - Uses OpenCode SDK for self-hosted backends (requires `@opencode-ai/sdk`)

See [AGENT_MODES.md](./AGENT_MODES.md) for detailed comparison and usage guide.

### AI Providers

#### Claude (Anthropic)

```bash
export ANTHROPIC_API_KEY=your-key-here
contractspec create --ai --provider claude
```

#### OpenAI

```bash
export OPENAI_API_KEY=your-key-here
contractspec create --ai --provider openai --model gpt-4o
```

#### Ollama (Local)

Install Ollama and pull a model:

```bash
ollama pull codellama
contractspec create --ai --provider ollama --model codellama
```

#### Custom OpenAI-Compatible Endpoint

```bash
contractspec create --ai --provider custom \
  --endpoint https://your-llm.com/v1 \
  --model your-model-name
```

Set via environment:

```bash
export CONTRACTSPEC_LLM_ENDPOINT=https://your-llm.com/v1
export CONTRACTSPEC_LLM_API_KEY=your-key
export CONTRACTSPEC_LLM_MODEL=your-model
```

### Supported Local Models (Ollama)

- `codellama` - Code generation (recommended)
- `llama3.1` - General purpose
- `mistral` - Fast, good quality
- `deepseek-coder` - Specialized for code

## Examples

### Create a Command Spec

```bash
contractspec create --type operation
# Follow prompts:
# - Name: user.signup
# - Kind: command
# - Description: Start user signup flow
# etc.
```

### Build Handler from Spec

Given a spec file `src/contracts/signup.contracts.ts`:

```bash
contractspec build src/contracts/signup.contracts.ts
# Generates:
# - src/handlers/signup.handler.ts
# - src/handlers/signup.handler.test.ts
```

### Multi-Provider Workflow

```bash
# Draft with free local model
contractspec create --ai --provider ollama

# Refine with Claude for production
contractspec build src/contracts/draft.ts --provider claude
```

## Advanced Usage

### Multi-Provider and Multi-Agent Workflows

Combine different providers and agents for optimal results:

```bash
# Draft specs with free local model
contractspec create --ai --provider ollama --model codellama

# Generate production code with Claude Code agent
contractspec build src/contracts/user-signup.contracts.ts \
  --agent-mode claude-code

# Validate implementation with AI
contractspec validate src/contracts/user-signup.contracts.ts \
  --check-implementation \
  --agent-mode claude-code

# Use OpenAI for algorithmic code
contractspec build src/contracts/search-algorithm.contracts.ts \
  --agent-mode openai-codex
```

### Environment Variables

```bash
# API Keys
export ANTHROPIC_API_KEY=your-key-here
export OPENAI_API_KEY=your-key-here

# Agent configuration
export CONTRACTSPEC_AGENT_MODE=claude-code
export CONTRACTSPEC_AI_PROVIDER=claude
export CONTRACTSPEC_AI_MODEL=claude-3-7-sonnet-20250219

# Custom provider
export CONTRACTSPEC_LLM_ENDPOINT=https://your-llm.com/v1
export CONTRACTSPEC_LLM_API_KEY=your-api-key
```

### CI/CD Integration

```yaml
# .github/workflows/contracts.yml
name: Validate Contracts

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: contractspec validate 'src/contracts/**/*.ts'
```

### Project Structure

Recommended organization:

```
src/
├── contracts/           # Contract specs
│   ├── events/
│   │   └── user-created.event.ts
│   ├── interactions/
│   │   ├── commands/
│   │   │   └── user-signup.contracts.ts
│   │   └── queries/
│   │       └── user-get-profile.contracts.ts
│   └── presentations/
│       └── user-profile-card.presentation.ts
├── handlers/            # Generated handlers
├── components/          # Generated components
└── forms/              # Generated forms
```

## Troubleshooting

### "Provider not available" error

**Claude:**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

**OpenAI:**

```bash
export OPENAI_API_KEY=sk-...
```

**Ollama:**

```bash
# Install Ollama from https://ollama.ai
ollama serve
ollama pull codellama
```

### Slow generation

For faster local generation, use smaller models:

```bash
contractspec create --ai --provider ollama --model codellama:7b
```

For cloud, use faster models:

```bash
contractspec build spec.ts --provider openai --model gpt-3.5-turbo
```

### Import errors in generated code

Make sure `@contractspec/lib.contracts` and `@contractspec/lib.schema` are installed:

```bash
bunadd @contractspec/lib.contracts @contractspec/lib.schema
```

## Contributing

Contributions welcome! Please:

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass: `buntest`

## Agent Modes Deep Dive

### When to Use Each Mode

**Simple Mode** - Default, good for:

- Rapid prototyping
- Basic implementations
- Quick iterations
- CI/CD pipelines (fast)

**Cursor Mode** - Best for:

- Working in Windsurf/Cursor IDE
- Complex, iterative development
- Context-aware code generation

**Claude Code Mode** - Best for:

- Production-quality implementations
- Critical business logic
- Comprehensive code validation
- Detailed code reviews

**OpenAI Codex Mode** - Best for:

- Algorithmic problems
- Performance optimization
- Mathematical computations
- Complex data transformations

For more details, see [AGENT_MODES.md](./AGENT_MODES.md).

## Roadmap

- [x] AI-powered code generation
- [x] Multiple agent modes (simple, cursor, claude-code, openai-codex, opencode)
- [x] AI-powered implementation validation
- [x] Contract listing and discovery (`contractspec list`)
- [x] Watch mode for auto-regeneration (`contractspec watch`)
- [x] Multi-surface synchronization (`contractspec sync`)
- [x] Cleanup utilities (`contractspec clean`)
- [x] Dependency analysis (`contractspec deps`)
- [x] Contract diffing and comparison (`contractspec diff`)
- [x] CI/CD integration (`contractspec ci`) with SARIF/JSON output
- [x] GitHub Action for CI/CD
- [ ] Form spec generation
- [ ] Feature spec bundling
- [ ] Handler signature checking in validation
- [ ] Test coverage validation
- [ ] Interactive spec editing
- [ ] GraphQL schema generation
- [ ] OpenAPI/Swagger export

## License

MIT
