# Implementation Verification

ContractSpec provides tiered verification to check if implementations comply with specs.

## Verification Tiers

### Tier 1: Structure (Fast)

Checks TypeScript structure against spec requirements:

| Check | What it validates |
|-------|------------------|
| Handler export | Function is properly exported |
| Contracts import | Imports from @contractspec/lib.contracts |
| Schema import | Imports from @contractspec/lib.schema |
| No `any` type | TypeScript strict compliance |
| Error handling | Error codes are referenced |
| Event emission | Event patterns exist |
| Input validation | Validation patterns used |
| Async patterns | Async/await for commands |

### Tier 2: Behavior (Comprehensive)

Checks implementation coverage of spec behaviors:

| Check | What it validates |
|-------|------------------|
| Scenario coverage | Acceptance scenarios implemented |
| Example coverage | Example I/O values referenced |
| Error cases | All error conditions handled |
| Event conditions | Events emitted correctly |
| Idempotency | Idempotent patterns (if required) |

### Tier 3: AI Review (Deep)

Uses LLM for semantic analysis:

- Does the implementation fulfill the spec's intent?
- Are edge cases properly handled?
- Is the code quality acceptable?
- Are there any subtle violations?

Requires AI API key configuration.

## Running Verification

```typescript
const verifyService = createVerifyService({
  aiApiKey: process.env.ANTHROPIC_API_KEY, // Optional, for Tier 3
  aiProvider: 'anthropic',
});

const result = await verifyService.verify(spec, implementationCode, {
  tiers: ['structure', 'behavior'],
  failFast: false,
  includeSuggestions: true,
});

console.log(result.passed);  // true/false
console.log(result.score);   // 0-100
console.log(result.summary); // Human-readable summary
```

## Verification Report

The report includes:

- **passed**: Overall compliance
- **score**: 0-100 score
- **issues**: Array of problems found
- **suggestions**: Recommended fixes
- **coverage**: Metrics on scenario/error/field coverage

Each issue has:
- **severity**: error, warning, or info
- **category**: type, export, import, scenario, error_handling, semantic
- **message**: Description of the issue
- **suggestion**: How to fix it
