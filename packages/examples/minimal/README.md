# contractspec-example-minimal

Website: https://contractspec.io/

**Bare-minimum ContractSpec example** -- a single user contract showing the simplest possible setup.

## What This Demonstrates

- Minimal contract definition with `@contractspec/lib.contracts-spec`
- Build and validate commands with the ContractSpec CLI

## Quick Start

```bash
# Build implementation from spec
bun run build

# Validate the spec
bun run validate
```

## Structure

```
src/
  contracts/
    user.ts    -- single user contract definition
```
