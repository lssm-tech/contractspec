# @contractspec/tool.create-contractspec-plugin

Website: https://contractspec.io/

**Scaffold ContractSpec plugins from templates** -- interactive CLI that generates plugin projects with proper structure, types, and tests.

## Installation

```bash
bun add -g @contractspec/tool.create-contractspec-plugin
```

## Quick Start

```bash
# Interactive plugin creation
create-contractspec-plugin create

# Create with options
create-contractspec-plugin create --name my-plugin --type generator

# Dry run to preview
create-contractspec-plugin create --name my-plugin --dry-run

# List available templates
create-contractspec-plugin list-templates
```

## Commands

### `create`

Scaffold a new plugin project.

| Option | Description | Default |
| --- | --- | --- |
| `-n, --name <name>` | Plugin name (kebab-case) | interactive |
| `-t, --type <type>` | Plugin type | `generator` |
| `-d, --description <desc>` | Plugin description | interactive |
| `-a, --author <author>` | Author name | git config |
| `--template <template>` | Template to use | `example-generator` |
| `--dry-run` | Preview without creating files | `false` |

**Plugin types**: `generator`, `transformer`, `validator`, `event`

### `list-templates`

Show available scaffold templates.

## Exports

- `.` -- CLI entry point and `PluginConfig` types
- `./templates/example-generator` -- Example generator template definition
- `./utils` -- Template rendering utilities (`renderTemplate`)

## Generated Structure

```
my-plugin/
  src/
    types/
    utils/
    templates/
  tests/
  docs/
  .github/workflows/
  package.json
```
