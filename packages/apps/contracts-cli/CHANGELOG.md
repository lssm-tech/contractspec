# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
Initial version

### Added
- Initial release of contracts-cli
- `contractspec create` command with interactive wizards
- AI-assisted spec creation using Vercel AI SDK
- Multi-provider support (Claude, OpenAI, Ollama, custom endpoints)
- `contractspec build` command for code generation
- `contractspec validate` command for spec validation
- TypeScript templates for operations, events, and presentations
- Handler and component generation
- Test generation
- Comprehensive documentation and examples
- Agent-driven build workflow with automatic fallback to deterministic templates
- AI-powered implementation validation with consistent agent orchestration

### Features
- Interactive CLI with Commander.js
- Beautiful terminal output with Chalk and Ora
- Configuration via `.contractsrc.json`
- Environment variable support
- BYOLLM (Bring Your Own LLM) support
- Validation with detailed error messages
- Type-safe code generation
- `contractspec validate` now prompts for spec-only vs implementation validation unless `--check-implementation` is provided
