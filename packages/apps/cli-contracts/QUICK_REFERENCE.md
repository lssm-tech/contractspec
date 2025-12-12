# Quick Reference Guide

## New Commands Overview

```bash
# Discovery & Management
contractspec list                           # List all contracts
contractspec list --type operation         # Filter contracts
contractspec list --pattern 'src/**/*.ts'  # Custom discovery pattern
contractspec list --deep                   # Load spec modules (richer metadata)
contractspec deps                          # Analyze dependencies
contractspec deps --circular               # Find circular deps
contractspec deps --format dot > deps.dot  # GraphViz dot output

# Development Workflow
contractspec watch --build                # Auto-build on changes
contractspec watch --validate             # Auto-validate on changes
contractspec watch --on-start both         # Run on startup too
contractspec watch --continue-on-error     # Keep watching even on failures

# Maintenance & Comparison
contractspec clean                        # Clean generated files
contractspec clean --dry-run              # Preview cleanup
contractspec diff spec1.ts spec2.ts       # Compare specs
contractspec diff spec.ts spec.ts --baseline main  # Compare with git baseline
contractspec sync                         # Build all discovered specs
contractspec sync --buckets api,ui        # Repeat builds into ./generated/<bucket>/

# Validation & Testing
contractspec validate '**/*.ts'           # Validate all specs
contractspec validate spec.ts --check-implementation
```

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
# (Falls back to templates automatically if the requested agent is unavailable)

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

# Default prompt (no flags): choose spec-only vs spec+implementation
contractspec validate user.contracts.ts

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

# Validate implementations (skip prompt)
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
