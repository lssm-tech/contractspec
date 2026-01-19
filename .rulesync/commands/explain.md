---
description: 'Explain code, architecture, or concepts in the codebase'
targets: ["*"]
---

target = $ARGUMENTS

Explain the specified code, file, or concept:

1. **Identify target**:
   - If file path: explain that file's purpose and structure
   - If function/class name: locate and explain it
   - If concept (e.g., "contracts", "specs"): explain the architectural concept

2. **For code files**, provide:
   - **Purpose**: What this file/module does
   - **Key exports**: Main functions, types, classes
   - **Dependencies**: What it imports and why
   - **Consumers**: What uses this code
   - **Data flow**: How data moves through
   - **Side effects**: External interactions (DB, API, etc.)

3. **For functions/classes**, provide:
   - **Signature**: Input types and return type
   - **Purpose**: What it accomplishes
   - **Algorithm**: Step-by-step logic (if complex)
   - **Edge cases**: Handled scenarios
   - **Usage example**: How to call it correctly

4. **For architectural concepts**, provide:
   - **Definition**: What it is
   - **Location**: Where it lives in the codebase
   - **Relationships**: How it connects to other concepts
   - **Rules**: Constraints and conventions
   - **Examples**: Concrete implementations

5. **Format**:
   - Use code blocks for examples
   - Include file:line references
   - Link to related concepts/files
   - Keep explanations concise but complete

## Example output for a file

```
## src/libs/contracts/src/defineCommand.ts

**Purpose**: Factory function for creating type-safe command specifications.

**Key exports**:
- `defineCommand<TInput, TOutput>()` - Creates a command spec
- `CommandSpec<T>` - Type for command specifications

**How it works**:
1. Takes input/output Zod schemas
2. Creates a spec object with validation
3. Registers in the OperationSpecRegistry
4. Returns typed spec for runtime use

**Usage**:
```typescript
const createUser = defineCommand({
  name: "createUser",
  input: z.object({ email: z.string() }),
  output: z.object({ id: z.string() }),
});
```

**Related**:
- `defineQuery.ts` - Similar for queries
- `OperationSpecRegistry.ts` - Where specs are registered
```