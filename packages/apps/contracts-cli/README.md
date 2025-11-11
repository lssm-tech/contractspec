# @lssm/tool.contracts-cli

CLI tool for creating, building, and validating contract specifications with AI assistance.

## Installation

```bash
pnpm add -D @lssm/tool.contracts-cli
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

Generate implementation code from contract specs using AI agents.

**Options:**
- `--output-dir <dir>` - Output directory (default: ./generated)
- `--provider <provider>` - AI provider: claude, openai, ollama, custom
- `--model <model>` - AI model to use
- `--agent-mode <mode>` - Agent mode: simple, cursor, claude-code, openai-codex
- `--no-tests` - Skip test generation
- `--no-agent` - Disable AI (use basic templates)

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
- `--agent-mode <mode>` - Agent mode for validation: simple, claude-code, openai-codex
- `--check-handlers` - Verify handler implementations exist
- `--check-tests` - Verify test coverage
- `-i, --interactive` - Interactive mode - prompt for what to validate

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
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: pnpm install
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

Make sure `@lssm/lib.contracts` and `@lssm/lib.schema` are installed:
```bash
pnpm add @lssm/lib.contracts @lssm/lib.schema
```

## Contributing

Contributions welcome! Please:

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass: `pnpm test`

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
- [x] Multiple agent modes (simple, cursor, claude-code, openai-codex)
- [x] AI-powered implementation validation
- [ ] Form spec generation
- [ ] Feature spec bundling
- [ ] Handler signature checking in validation
- [ ] Test coverage validation
- [ ] Interactive spec editing
- [ ] Spec diffing and versioning
- [ ] GraphQL schema generation
- [ ] OpenAPI/Swagger export

## License

MIT

