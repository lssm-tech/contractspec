# Changelog

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.contracts-transformers@1.45.3
  - @contractspec/bundle.workspace@1.45.3
  - @contractspec/lib.ai-providers@1.45.3
  - @contractspec/module.workspace@1.45.3
  - @contractspec/module.examples@1.45.3
  - @contractspec/module.ai-chat@1.45.3
  - @contractspec/lib.contracts@1.45.3
  - @contractspec/lib.testing@1.45.3
  - @contractspec/lib.schema@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.contracts-transformers@1.45.2
  - @contractspec/bundle.workspace@1.45.2
  - @contractspec/lib.ai-providers@1.45.2
  - @contractspec/module.workspace@1.45.2
  - @contractspec/module.examples@1.45.2
  - @contractspec/module.ai-chat@1.45.2
  - @contractspec/lib.contracts@1.45.2
  - @contractspec/lib.testing@1.45.2
  - @contractspec/lib.schema@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.45.1
  - @contractspec/bundle.workspace@1.45.1
  - @contractspec/lib.ai-providers@1.45.1
  - @contractspec/module.workspace@1.45.1
  - @contractspec/module.examples@1.45.1
  - @contractspec/module.ai-chat@1.45.1
  - @contractspec/lib.contracts@1.45.1
  - @contractspec/lib.testing@1.45.1
  - @contractspec/lib.schema@1.45.1

## 1.45.0

### Minor Changes

- e73ca1d: feat: improve app config and examples contracts
  feat: Contract layers support (features, examples, app-configs)

  ### New CLI Commands
  - `contractspec list layers` - List all contract layers with filtering

  ### Enhanced Commands
  - `contractspec ci` - New `layers` check category validates features/examples/config
  - `contractspec doctor` - New `layers` health checks
  - `contractspec integrity` - Now shows layer statistics

  ### New APIs
  - `discoverLayers()` - Scan workspace for all layer files
  - `scanExampleSource()` - Parse ExampleSpec from source code
  - `isExampleFile()` - Check if file is an example spec

### Patch Changes

- Updated dependencies [e73ca1d]
  - @contractspec/lib.contracts-transformers@1.45.0
  - @contractspec/bundle.workspace@1.45.0
  - @contractspec/lib.ai-providers@1.45.0
  - @contractspec/module.workspace@1.45.0
  - @contractspec/module.examples@1.45.0
  - @contractspec/module.ai-chat@1.45.0
  - @contractspec/lib.contracts@1.45.0
  - @contractspec/lib.testing@1.45.0
  - @contractspec/lib.schema@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.contracts-transformers@1.44.1
  - @contractspec/bundle.workspace@1.44.1
  - @contractspec/lib.ai-providers@1.44.1
  - @contractspec/module.examples@1.44.1
  - @contractspec/module.ai-chat@1.44.1
  - @contractspec/lib.contracts@1.44.1
  - @contractspec/lib.testing@1.44.1
  - @contractspec/lib.schema@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.contracts-transformers@1.44.0
  - @contractspec/bundle.workspace@1.44.0
  - @contractspec/lib.ai-providers@1.44.0
  - @contractspec/module.examples@1.44.0
  - @contractspec/module.ai-chat@1.44.0
  - @contractspec/lib.contracts@1.44.0
  - @contractspec/lib.testing@1.44.0
  - @contractspec/lib.schema@1.44.0

## 1.43.4

### Patch Changes

- 9216062: fix: cross-platform compatibility
- Updated dependencies [9216062]
  - @contractspec/bundle.workspace@1.43.4
  - @contractspec/module.examples@1.43.4
  - @contractspec/lib.contracts-transformers@1.43.4
  - @contractspec/lib.ai-providers@1.43.3
  - @contractspec/module.ai-chat@1.43.4
  - @contractspec/lib.contracts@1.43.4
  - @contractspec/lib.testing@1.43.4
  - @contractspec/lib.schema@1.43.3

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/bundle.workspace@1.43.3
  - @contractspec/module.examples@1.43.3
  - @contractspec/lib.contracts-transformers@1.43.3
  - @contractspec/lib.ai-providers@1.43.2
  - @contractspec/module.ai-chat@1.43.3
  - @contractspec/lib.contracts@1.43.3
  - @contractspec/lib.testing@1.43.3
  - @contractspec/lib.schema@1.43.2

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/bundle.workspace@1.43.2
  - @contractspec/module.examples@1.43.2
  - @contractspec/lib.contracts-transformers@1.43.2
  - @contractspec/module.ai-chat@1.43.2
  - @contractspec/lib.contracts@1.43.2
  - @contractspec/lib.testing@1.43.2
  - @contractspec/lib.ai-providers@1.43.1
  - @contractspec/lib.schema@1.43.1

## 1.43.1

### Patch Changes

- f28fdad: fix
- Updated dependencies [f28fdad]
  - @contractspec/lib.contracts@1.43.1
  - @contractspec/bundle.workspace@1.43.1
  - @contractspec/lib.contracts-transformers@1.43.1
  - @contractspec/lib.testing@1.43.1
  - @contractspec/module.ai-chat@1.43.1
  - @contractspec/module.examples@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/bundle.workspace@1.43.0
  - @contractspec/module.examples@1.43.0
  - @contractspec/lib.contracts-transformers@1.43.0
  - @contractspec/lib.ai-providers@1.43.0
  - @contractspec/module.ai-chat@1.43.0
  - @contractspec/lib.contracts@1.43.0
  - @contractspec/lib.testing@1.43.0
  - @contractspec/lib.schema@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/bundle.workspace@1.42.10
  - @contractspec/module.examples@1.42.10
  - @contractspec/lib.contracts-transformers@1.42.10
  - @contractspec/lib.ai-providers@1.42.10
  - @contractspec/module.ai-chat@1.42.10
  - @contractspec/lib.contracts@1.42.10
  - @contractspec/lib.testing@1.42.10
  - @contractspec/lib.schema@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/bundle.workspace@1.42.9
  - @contractspec/module.examples@1.42.9
  - @contractspec/lib.contracts-transformers@1.42.9
  - @contractspec/lib.ai-providers@1.42.9
  - @contractspec/module.ai-chat@1.42.9
  - @contractspec/lib.contracts@1.42.9
  - @contractspec/lib.testing@1.42.9
  - @contractspec/lib.schema@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/bundle.workspace@1.42.8
  - @contractspec/module.examples@1.42.8
  - @contractspec/lib.contracts-transformers@1.42.8
  - @contractspec/lib.ai-providers@1.42.8
  - @contractspec/module.ai-chat@1.42.8
  - @contractspec/lib.contracts@1.42.8
  - @contractspec/lib.testing@1.42.8
  - @contractspec/lib.schema@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/bundle.workspace@1.42.7
  - @contractspec/module.examples@1.42.7
  - @contractspec/lib.contracts-transformers@1.42.7
  - @contractspec/lib.ai-providers@1.42.7
  - @contractspec/module.ai-chat@1.42.7
  - @contractspec/lib.contracts@1.42.7
  - @contractspec/lib.testing@1.42.7
  - @contractspec/lib.schema@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/bundle.workspace@1.42.6
  - @contractspec/module.examples@1.42.6
  - @contractspec/lib.contracts-transformers@1.42.6
  - @contractspec/lib.ai-providers@1.42.6
  - @contractspec/module.ai-chat@1.42.6
  - @contractspec/lib.contracts@1.42.6
  - @contractspec/lib.testing@1.42.6
  - @contractspec/lib.schema@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/bundle.workspace@1.42.5
  - @contractspec/module.examples@1.42.5
  - @contractspec/lib.contracts-transformers@1.42.5
  - @contractspec/lib.ai-providers@1.42.5
  - @contractspec/module.ai-chat@1.42.5
  - @contractspec/lib.contracts@1.42.5
  - @contractspec/lib.testing@1.42.5
  - @contractspec/lib.schema@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/bundle.workspace@1.42.4
  - @contractspec/module.examples@1.42.4
  - @contractspec/lib.contracts-transformers@1.42.4
  - @contractspec/lib.ai-providers@1.42.4
  - @contractspec/module.ai-chat@1.42.4
  - @contractspec/lib.contracts@1.42.4
  - @contractspec/lib.testing@1.42.4
  - @contractspec/lib.schema@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.contracts-transformers@1.42.3
  - @contractspec/bundle.workspace@1.42.3
  - @contractspec/lib.ai-providers@1.42.3
  - @contractspec/lib.contracts@1.42.3
  - @contractspec/lib.schema@1.42.3
  - @contractspec/lib.testing@1.42.3
  - @contractspec/module.ai-chat@1.42.3
  - @contractspec/module.examples@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/bundle.workspace@1.42.2
  - @contractspec/lib.ai-providers@1.42.2
  - @contractspec/lib.contracts@1.42.2
  - @contractspec/lib.contracts-transformers@1.42.2
  - @contractspec/lib.schema@1.42.2
  - @contractspec/lib.testing@1.42.2
  - @contractspec/module.ai-chat@1.42.2
  - @contractspec/module.examples@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/bundle.workspace@1.42.1
  - @contractspec/module.examples@1.42.1
  - @contractspec/lib.contracts-transformers@1.42.1
  - @contractspec/lib.ai-providers@1.42.1
  - @contractspec/module.ai-chat@1.42.1
  - @contractspec/lib.contracts@1.42.1
  - @contractspec/lib.testing@1.42.1
  - @contractspec/lib.schema@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/bundle.workspace@1.42.0
  - @contractspec/lib.ai-providers@1.42.0
  - @contractspec/lib.contracts@1.42.0
  - @contractspec/lib.contracts-transformers@1.42.0
  - @contractspec/lib.schema@1.42.0
  - @contractspec/lib.testing@1.42.0
  - @contractspec/module.ai-chat@1.42.0
  - @contractspec/module.examples@1.42.0

## 0.12.0

### Minor Changes

- Refactor to be compatible with ai-sdk v6

### Patch Changes

- Updated dependencies
  - @contractspec/app.cli-database@1.12.0
  - @contractspec/lib.contracts@1.12.0
  - @contractspec/lib.schema@1.12.0
  - @contractspec/lib.testing@0.5.0

## 0.11.1

### Patch Changes

- Fix dependencies
- Updated dependencies
  - @contractspec/app.cli-database@1.11.1
  - @contractspec/lib.contracts@1.11.1
  - @contractspec/lib.schema@1.11.1
  - @contractspec/lib.testing@0.4.1

## 0.11.0

### Minor Changes

- b7621d3: Fix version

### Patch Changes

- Updated dependencies [b7621d3]
  - @contractspec/app.cli-database@1.11.0
  - @contractspec/lib.contracts@1.11.0
  - @contractspec/lib.schema@1.11.0
  - @contractspec/lib.testing@0.4.0

## 0.10.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/app.cli-database@1.10.0
  - @contractspec/lib.contracts@1.10.0
  - @contractspec/lib.schema@1.10.0
  - @contractspec/lib.testing@0.3.0

## 0.9.2

### Patch Changes

- fix dependencies
- Updated dependencies
  - @contractspec/lib.testing@0.2.2
  - @contractspec/app.cli-database@1.9.2
  - @contractspec/lib.contracts@1.9.2
  - @contractspec/lib.schema@1.9.2

## 0.9.1

### Patch Changes

- fix
- Updated dependencies
  - @contractspec/app.cli-database@1.9.1
  - @contractspec/lib.contracts@1.9.1
  - @contractspec/lib.testing@0.2.1
  - @contractspec/lib.schema@1.9.1

## 0.9.0

### Minor Changes

- b1d0876: Managed platform

### Patch Changes

- Updated dependencies [b1d0876]
  - @contractspec/app.cli-database@1.9.0
  - @contractspec/lib.contracts@1.9.0
  - @contractspec/lib.testing@0.2.0
  - @contractspec/lib.schema@1.9.0

## 0.8.0

### Minor Changes

- f1f4ddd: Foundation Hardening

### Patch Changes

- Updated dependencies [f1f4ddd]
  - @contractspec/lib.contracts@1.8.0
  - @contractspec/lib.schema@1.8.0

## 0.7.4

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.contracts@1.7.4
  - @contractspec/lib.schema@1.7.4

## 0.7.3

### Patch Changes

- add right-sidebar
- Updated dependencies
  - @contractspec/lib.contracts@1.7.3
  - @contractspec/lib.schema@1.7.3

## 0.7.2

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.contracts@1.7.2
  - @contractspec/lib.schema@1.7.2

## 0.7.1

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.contracts@1.7.1
  - @contractspec/lib.schema@1.7.1

## 0.7.0

### Minor Changes

- fixii

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts@1.7.0
  - @contractspec/lib.schema@1.7.0

## 0.6.0

### Minor Changes

- fix versionnnn

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts@1.6.0
  - @contractspec/lib.schema@1.6.0

## 0.5.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts@1.5.0
  - @contractspec/lib.schema@1.5.0

## 0.4.0

### Minor Changes

- fix exports

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts@1.4.0
  - @contractspec/lib.schema@1.4.0

## 0.3.0

### Minor Changes

- fix it

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts@1.3.0
  - @contractspec/lib.schema@1.3.0

## 0.2.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts@1.2.0
  - @contractspec/lib.schema@1.2.0

## 0.1.0

### Minor Changes

- fix
- 748b3a2: fix publish

### Patch Changes

- Updated dependencies
- Updated dependencies [748b3a2]
  - @contractspec/lib.contracts@1.1.0
  - @contractspec/lib.schema@1.1.0

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
