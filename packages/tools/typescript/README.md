# @contractspec/tool.typescript

Website: https://contractspec.io/

**Shared TypeScript configuration presets** for the ContractSpec monorepo.

## Installation

```bash
bun add -D @contractspec/tool.typescript
```

## Available Configs

| Config | File | Use Case |
| --- | --- | --- |
| Base | `base.json` | Default strict config for all packages |
| Next.js | `nextjs.json` | Next.js apps with App Router |
| React Library | `react-library.json` | React component libraries |

## Usage

Extend from your `tsconfig.json`:

```json
{
  "extends": "@contractspec/tool.typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### Next.js App

```json
{
  "extends": "@contractspec/tool.typescript/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### React Library

```json
{
  "extends": "@contractspec/tool.typescript/react-library.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

## Key Settings (base)

- `strict: true` -- all strict checks enabled
- `module: "Preserve"` -- bundler-compatible module resolution
- `noUncheckedIndexedAccess: true` -- safer array/object access
- `verbatimModuleSyntax: true` -- explicit import/export types
- `target: "esnext"` -- latest ECMAScript features
