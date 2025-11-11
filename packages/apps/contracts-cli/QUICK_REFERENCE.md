# Quick Reference Guide

## Agent Modes at a Glance

```bash
# Simple (default) - Fast, basic quality
contractspec build spec.ts

# Claude Code - Best quality, production-ready
contractspec build spec.ts --agent-mode claude-code

# OpenAI Codex - Best for algorithms
contractspec build spec.ts --agent-mode openai-codex

# Cursor - IDE-integrated (Windsurf/Cursor)
contractspec build spec.ts --agent-mode cursor

# No AI - Templates only
contractspec build spec.ts --no-agent
```

## Build Examples

```bash
# Basic build
contractspec build user.contracts.ts

# Production build with tests
contractspec build user.contracts.ts --agent-mode claude-code

# Fast build without tests
contractspec build user.contracts.ts --no-tests

# Custom output directory
contractspec build user.contracts.ts -o ./src/handlers
```

## Validation Examples

```bash
# Validate spec only
contractspec validate user.contracts.ts

# Validate implementation with AI
contractspec validate user.contracts.ts --check-implementation

# Interactive validation
contractspec validate user.contracts.ts -i

# Validate with specific implementation
contractspec validate user.contracts.ts \
  --check-implementation \
  --implementation-path ./handlers/user.handler.ts \
  --agent-mode claude-code
```

## Configuration

### Minimal .contractsrc.json
```json
{
  "aiProvider": "claude",
  "agentMode": "claude-code",
  "outputDir": "./src"
}
```

### Environment Variables
```bash
# Required for Claude
export ANTHROPIC_API_KEY=sk-ant-...

# Required for OpenAI
export OPENAI_API_KEY=sk-...

# Agent mode (optional)
export CONTRACTSPEC_AGENT_MODE=claude-code
```

## Common Workflows

### Development Flow
```bash
# 1. Create spec
contractspec create --type operation --ai

# 2. Generate implementation
contractspec build spec.contracts.ts --agent-mode claude-code

# 3. Validate
contractspec validate spec.contracts.ts --check-implementation
```

### CI/CD Flow
```bash
# Fast validation in CI
contractspec validate '**/*.contracts.ts' --agent-mode simple

# Validate implementations
contractspec validate '**/*.contracts.ts' --check-implementation
```

### Multi-Provider Strategy
```bash
# Draft with local model (free)
contractspec create --ai --provider ollama

# Build with Claude (quality)
contractspec build spec.ts --agent-mode claude-code

# Validate with OpenAI (cost-effective)
contractspec validate spec.ts --check-implementation --agent-mode openai-codex
```

## Troubleshooting

### AI Not Working
```bash
# Check API key
echo $ANTHROPIC_API_KEY

# Use simple mode as fallback
contractspec build spec.ts --agent-mode simple

# Disable AI completely
contractspec build spec.ts --no-agent
```

### Wrong Implementation Path
```bash
# Specify path explicitly
contractspec validate spec.contracts.ts \
  --check-implementation \
  --implementation-path ./custom/path/handler.ts
```

### Slow Generation
```bash
# Use faster agent mode
contractspec build spec.ts --agent-mode simple

# Skip tests
contractspec build spec.ts --no-tests
```

## Best Practices

✅ **DO:**
- Use `claude-code` for production implementations
- Validate with `--check-implementation` before committing
- Set agent mode in `.contractsrc.json` for consistency
- Use environment variables for API keys

❌ **DON'T:**
- Commit AI-generated code without review
- Use expensive agents in CI/CD unnecessarily
- Store API keys in `.contractsrc.json`
- Skip validation for critical code

## Performance Tips

| Task | Recommended Agent | Speed | Quality |
|------|------------------|-------|---------|
| Prototyping | simple | ⚡⚡⚡ | ⭐⭐⭐ |
| Production | claude-code | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| Algorithms | openai-codex | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| CI/CD | simple | ⚡⚡⚡ | ⭐⭐⭐ |
| Validation | claude-code | ⚡⚡ | ⭐⭐⭐⭐⭐ |

## More Information

- Full documentation: [README.md](./README.md)
- Agent modes guide: [AGENT_MODES.md](./AGENT_MODES.md)
- Quick start: [QUICK_START.md](./QUICK_START.md)
