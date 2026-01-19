# Contracts First: Spec-First Development

"Every operation, event, and feature must be defined as a ContractSpec contract BEFORE implementation. Contracts are the single source of truth. Implementation follows specification."

## Core Principle

**Spec → Implementation, never the reverse.**

When adding new functionality:
1. Define the contract in `@contractspec/lib.contracts`
2. Register it in the appropriate registry
3. Then implement handlers, UI, and tests

## When to Use Contracts

| Scenario | Contract Type | Location |
|----------|--------------|----------|
| API endpoint (mutation) | `defineCommand` | `packages/libs/contracts/src/operations/` |
| API endpoint (read) | `defineQuery` | `packages/libs/contracts/src/operations/` |
| Domain event | `defineEvent` | `packages/libs/contracts/src/events/` |
| UI feature/capability | `defineCapability` | `packages/libs/contracts/src/capabilities/` |
| UI presentation | `definePresentation` | `packages/libs/contracts/src/presentations/` |
| Feature flag | `defineFeature` | `packages/libs/contracts/src/features/` |
| Form definition | `defineForm` | `packages/libs/contracts/src/forms/` |
| Data view | `defineDataView` | `packages/libs/contracts/src/data-views/` |
| Integration | `defineIntegration` | `packages/libs/contracts/src/integrations/` |

## Contract Structure

### Operations (Commands & Queries)

```typescript
import { defineCommand, defineQuery } from '@contractspec/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

// Command (state-changing operation)
export const CreateProjectCommand = defineCommand({
  meta: {
    name: 'project.create',
    version: '1.0.0',
    description: 'Creates a new project',
    goal: 'Allow users to start new projects',
    context: 'Part of the project management domain',
    owners: ['team-platform'],
    tags: ['projects', 'core'],
  },
  io: {
    input: new SchemaModel({
      name: 'CreateProjectInput',
      fields: {
        name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
        description: { type: ScalarTypeEnum.String(), isOptional: true },
      },
    }),
    output: new SchemaModel({
      name: 'CreateProjectOutput',
      fields: {
        id: { type: ScalarTypeEnum.UUID(), isOptional: false },
        name: { type: ScalarTypeEnum.String(), isOptional: false },
      },
    }),
    errors: {
      NAME_EXISTS: {
        description: 'A project with this name already exists',
        http: 409,
        when: 'Project name is already taken',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

// Query (read-only operation)
export const GetProjectQuery = defineQuery({
  meta: {
    name: 'project.get',
    version: '1.0.0',
    description: 'Retrieves a project by ID',
    goal: 'Allow users to view project details',
    context: 'Part of the project management domain',
    owners: ['team-platform'],
    tags: ['projects', 'core'],
  },
  io: {
    input: new SchemaModel({
      name: 'GetProjectInput',
      fields: {
        id: { type: ScalarTypeEnum.UUID(), isOptional: false },
      },
    }),
    output: new SchemaModel({
      name: 'GetProjectOutput',
      fields: {
        id: { type: ScalarTypeEnum.UUID(), isOptional: false },
        name: { type: ScalarTypeEnum.String(), isOptional: false },
        description: { type: ScalarTypeEnum.String(), isOptional: true },
        createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'user',
  },
});
```

### Events

```typescript
import { defineEvent } from '@contractspec/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

export const ProjectCreatedEvent = defineEvent({
  meta: {
    key: 'project.created',
    version: '1.0.0',
    description: 'Emitted when a new project is created',
    owners: ['team-platform'],
    tags: ['projects'],
  },
  payload: new SchemaModel({
    name: 'ProjectCreatedPayload',
    fields: {
      projectId: { type: ScalarTypeEnum.UUID(), isOptional: false },
      name: { type: ScalarTypeEnum.String(), isOptional: false },
      createdBy: { type: ScalarTypeEnum.UUID(), isOptional: false },
      createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    },
  }),
});
```

## Required Contract Fields

Every contract MUST include:

### Meta (for Operations)
- `name`: Unique identifier (format: `domain.action`)
- `version`: Semantic version
- `description`: Brief description
- `goal`: Business purpose (why this exists)
- `context`: Background, constraints, scope
- `owners`: Responsible team(s)
- `tags`: Categorization tags

### IO (for Operations)
- `input`: SchemaModel for input payload
- `output`: SchemaModel for output payload
- `errors`: Named error cases with descriptions

### Policy (for Operations)
- `auth`: Required auth level (`anonymous`, `user`, `admin`)

## Registration

Contracts must be registered in the appropriate registry:

```typescript
// packages/libs/contracts/src/operations/registry.ts
import { CreateProjectCommand, GetProjectQuery } from './project';

export const operationRegistry = {
  'project.create': CreateProjectCommand,
  'project.get': GetProjectQuery,
  // ...
};
```

## Implementation Pattern

After defining a contract, implement:

1. **Handler** (backend):
   ```typescript
   // packages/bundles/studio/src/modules/projects/handlers/createProject.ts
   import { CreateProjectCommand } from '@contractspec/lib.contracts';

   export const createProjectHandler = async (
     input: typeof CreateProjectCommand.io.input.infer
   ): Promise<typeof CreateProjectCommand.io.output.infer> => {
     // Implementation
   };
   ```

2. **API Route** (if REST):
   ```typescript
   // Generated or manually wired
   app.post('/api/projects', createProjectHandler);
   ```

3. **Tests**:
   ```typescript
   import { CreateProjectCommand } from '@contractspec/lib.contracts';

   describe('createProject', () => {
     it('should create a project', async () => {
       // Use contract for type-safe testing
     });
   });
   ```

## Anti-Patterns (Forbidden)

### 1. Implementation without contract
```typescript
// ❌ BAD: Direct implementation without spec
app.post('/api/projects', async (req, res) => {
  const { name } = req.body;
  // No contract, no type safety, no documentation
});
```

### 2. Inline schema definitions
```typescript
// ❌ BAD: Schemas defined inline in handlers
const handler = async (input: { name: string }) => {
  // Schema not reusable, not documented
};
```

### 3. Missing contract fields
```typescript
// ❌ BAD: Incomplete contract
export const BadCommand = defineCommand({
  meta: {
    name: 'bad.command',
    version: '1.0.0',
    // Missing: description, goal, context, owners, tags
  },
  // ...
});
```

## Dev Heuristics

✅ Does every new API endpoint have a contract?
✅ Are contracts defined BEFORE implementation?
✅ Do contracts include all required fields?
✅ Are contracts registered in the appropriate registry?
✅ Do handlers reference contract types?
✅ Are events defined for significant state changes?
✅ Is the contract in the correct location?
❌ Am I adding an endpoint without a contract? → Define contract first
❌ Am I defining schemas inline? → Use SchemaModel in contracts
❌ Am I skipping documentation fields? → Add goal, context, description

## References

- `@contractspec/lib.contracts` - Core contract definitions
- `@contractspec/lib.schema` - SchemaModel and ScalarTypeEnum
- `packages/libs/contracts/src/operations/operation.ts` - OperationSpec interface
- `packages/libs/contracts/src/events.ts` - EventSpec interface
- See `package-architecture.md` for where contracts live
