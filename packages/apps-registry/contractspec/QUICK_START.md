# Quick Start Guide

Get started with contracts-cli in 5 minutes.

## Installation

```bash
cd packages/lssm/tools/contracts-cli
bun install
bun build
```

## First Spec

### 1. Create a spec interactively

```bash
contractspec create
```

Follow the prompts:
- Choose "Operation (Command/Query)"
- Select "Command"
- Name: `user.signup`
- Fill in description, goal, context
- Set auth to `anonymous`
- Add owners: `@team`

This creates: `src/interactions/commands/user-signup.contracts.ts`

### 2. Or use AI assistance

```bash
export ANTHROPIC_API_KEY=your-key-here
bun exec contractspec create --ai
```

Describe what you want:
> "Create a command for user signup that takes an email and sends a magic link"

Review and accept the AI-generated spec!

### 3. Generate handler

```bash
bun exec contractspec build src/interactions/commands/user-signup.contracts.ts
```

This generates:
- `src/handlers/user-signup.handler.ts` - Implementation stub
- `src/handlers/user-signup.handler.test.ts` - Tests

### 4. Validate

```bash
bun exec contractspec validate src/interactions/commands/user-signup.contracts.ts
# You'll be prompted to validate the spec only or the implementation as well.
```

## Using Local Models (Free!)

### Install Ollama

```bash
# macOS
brew install ollama

# Start Ollama
ollama serve

# Pull a model
ollama pull codellama
```

### Generate with Ollama

```bash
bun exec contractspec create --ai --provider ollama --model codellama
```

No API keys needed! Everything runs locally.

## Configuration

Create `.contractsrc.json` in your project root:

```json
{
  "aiProvider": "claude",
  "outputDir": "./src",
  "defaultOwners": ["@my-team"],
  "conventions": {
    "operations": "interactions/commands|queries",
    "events": "events"
  }
}
```

Now commands use these defaults:

```bash
# Uses Claude from config
bun exec contractspec create --ai

# Override with Ollama
bun exec contractspec create --ai --provider ollama
```

## Next Steps

1. **Complete the TODO items** in generated files
2. **Implement handler logic** with real business rules
3. **Run tests**: `bun test`
4. **Validate**: `bun exec contractspec validate src/**/*.contracts.ts`
5. **Register in registry** and mount REST/GraphQL adapters

## Common Workflows

### Create Event

```bash
bun exec contractspec create --type event
```

### Build Presentation Component

```bash
bun exec contractspec create --type presentation
bun exec contractspec build src/presentations/user-profile.presentation.ts
```

### Multi-Spec Workflow

```bash
# Create operation spec
bun exec contractspec create --type operation --ai

# Create related event spec
bun exec contractspec create --type event --ai

# Generate all implementations
bun exec contractspec build src/contracts/**/*.ts
```

## Tips

- Use `--ai` for faster spec creation
- Use Ollama for free local generation
- Use Claude/GPT-4 for production-quality code
- Always validate before committing
- Keep specs close to implementations

## Troubleshooting

**No AI provider?**
```bash
# Use interactive wizard instead
bun exec contractspec create
```

**Can't find contractspec?**
```bash
# Use bun exec
bun exec contractspec --help
```

**Import errors?**
```bash
# Install dependencies
bun add @contractspec/lib.contracts-spec @contractspec/lib.schema
```

Happy contract authoring! 🎉

