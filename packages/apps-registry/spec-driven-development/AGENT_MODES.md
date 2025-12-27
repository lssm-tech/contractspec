# AI Agent Modes

The contracts-cli supports multiple AI agent modes for code generation and validation. Each mode offers different capabilities and trade-offs.

## Available Agent Modes

### 1. Simple Mode (Default)
- **Mode**: `simple`
- **Description**: Direct LLM API calls for code generation
- **Best For**: Quick prototyping, basic implementations
- **Requirements**: API key for your chosen provider (Claude, OpenAI, Ollama)
- **Speed**: Fast
- **Quality**: Good baseline quality

**Example:**
```bash
contractspec build spec.contracts.ts --agent-mode simple
```

### 2. Cursor Agent Mode
- **Mode**: `cursor`
- **Description**: Leverages Windsurf/Cursor's agentic capabilities
- **Best For**: Complex implementations, iterative development
- **Requirements**: Running in Windsurf/Cursor environment
- **Speed**: Moderate
- **Quality**: High quality with context awareness

**Example:**
```bash
contractspec build spec.contracts.ts --agent-mode cursor
```

**Note**: This mode requires Windsurf/Cursor CLI access. If not available, falls back to simple mode.

### 3. Claude Code Mode
- **Mode**: `claude-code`
- **Description**: Uses Anthropic's Claude with extended thinking for code generation
- **Best For**: Production-quality code, complex logic, thorough validation
- **Requirements**: `ANTHROPIC_API_KEY` environment variable
- **Speed**: Moderate to slow
- **Quality**: Very high quality, excellent for validation

**Features:**
- Extended context understanding
- Detailed code review capabilities
- Comprehensive validation reports
- Best for critical implementations

**Example:**
```bash
export ANTHROPIC_API_KEY=your_key
contractspec build spec.contracts.ts --agent-mode claude-code
```

### 4. OpenAI Codex Mode
- **Mode**: `openai-codex`
- **Description**: Uses OpenAI's GPT-4o and o1 models for code generation
- **Best For**: Complex algorithms, optimization tasks
- **Requirements**: `OPENAI_API_KEY` environment variable
- **Speed**: Fast (GPT-4o) to slow (o1 reasoning)
- **Quality**: High quality, excellent for algorithmic problems

**Features:**
- Automatically selects o1 for complex tasks
- Uses GPT-4o for standard generation
- Strong at optimization and algorithms

**Example:**
```bash
export OPENAI_API_KEY=your_key
contractspec build spec.contracts.ts --agent-mode openai-codex
```

## Configuring Agent Modes

### Via Configuration File

Add to `.contractsrc.json`:

```json
{
  "aiProvider": "claude",
  "agentMode": "claude-code",
  "aiModel": "claude-3-7-sonnet-20250219"
}
```

### Via Environment Variables

```bash
export CONTRACTSPEC_AGENT_MODE=claude-code
export CONTRACTSPEC_AI_PROVIDER=claude
export ANTHROPIC_API_KEY=your_key
```

### Via CLI Options

```bash
contractspec build spec.ts --agent-mode claude-code --provider claude
```

## Agent Mode Comparison

| Feature | Simple | Cursor | Claude Code | OpenAI Codex |
|---------|--------|--------|-------------|--------------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| Quality | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Validation | Basic | Good | Excellent | Good |
| Setup | Easy | Moderate | Easy | Easy |
| Cost | Low | N/A | Moderate | Low-Moderate |

## Fallback Behavior

The CLI automatically falls back to simpler modes if the primary mode fails:

1. **cursor** → **claude-code** → **openai-codex** → **simple**
2. **claude-code** → **openai-codex** → **simple**
3. **openai-codex** → **simple**
4. **simple** → Basic templates (no AI)

## Usage Examples

### Build with Agent Mode

```bash
# Use Claude Code for high-quality generation
contractspec build user.contracts.ts --agent-mode claude-code

# Use OpenAI for algorithmic code
contractspec build optimizer.contracts.ts --agent-mode openai-codex

# Disable AI entirely
contractspec build simple.contracts.ts --no-agent
```

### Validate with Agent Mode

```bash
# Validate implementation with AI
contractspec validate user.contracts.ts --check-implementation --agent-mode claude-code

# Interactive validation
contractspec validate user.contracts.ts -i --agent-mode claude-code

# Specify implementation path
contractspec validate user.contracts.ts \
  --check-implementation \
  --implementation-path ./handlers/user.handler.ts \
  --agent-mode claude-code
```

## Best Practices

### For Development
- Use **simple** mode for rapid iteration
- Use **cursor** mode if working in Windsurf/Cursor

### For Production
- Use **claude-code** for critical implementations
- Always validate with `--check-implementation`
- Review AI-generated code before committing

### For Complex Logic
- Use **openai-codex** for algorithmic problems
- Use **claude-code** for comprehensive validation

### For CI/CD
- Use **simple** mode for speed
- Configure via environment variables
- Set up validation in pre-commit hooks

## Troubleshooting

### Agent Mode Not Working

Check:
1. API keys are set correctly
2. Network connectivity to AI providers
3. Provider quotas and rate limits

### Fallback to Simple Mode

This happens when:
- API key is missing
- Provider is unavailable
- Agent cannot handle the task

The CLI will show warnings explaining why.

### Poor Quality Output

Try:
1. Using a more powerful agent mode
2. Adding more context to your spec
3. Reviewing and refining the spec structure

## Environment Variables Reference

```bash
# Provider selection
CONTRACTSPEC_AI_PROVIDER=claude|openai|ollama|custom

# Agent mode
CONTRACTSPEC_AGENT_MODE=simple|cursor|claude-code|openai-codex

# Model selection
CONTRACTSPEC_AI_MODEL=claude-3-7-sonnet-20250219

# API Keys
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# Custom endpoints
CONTRACTSPEC_LLM_ENDPOINT=https://your-custom-endpoint
CONTRACTSPEC_LLM_API_KEY=your_custom_key
```

## Advanced Configuration

### Custom Agent Priorities

You can configure fallback priorities in `.contractsrc.json`:

```json
{
  "agentMode": "claude-code",
  "aiProvider": "claude",
  "aiModel": "claude-3-7-sonnet-20250219",
  "outputDir": "./src",
  "defaultOwners": ["@team"],
  "defaultTags": ["auto-generated"]
}
```

### Multi-Model Strategy

Use different models for different tasks:

```bash
# Use Claude for generation
contractspec build spec.ts --agent-mode claude-code

# Use OpenAI for validation
contractspec validate spec.ts \
  --check-implementation \
  --agent-mode openai-codex
```
