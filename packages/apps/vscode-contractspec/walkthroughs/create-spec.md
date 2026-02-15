# Creating Your First Spec

ContractSpec provides multiple ways to create specifications:

## Method 1: Use the Create Wizard

The easiest way to get started is with the interactive wizard:

1. Open the Command Palette (`Cmd/Ctrl + Shift + P`)
2. Type `ContractSpec: Create New Spec`
3. Follow the wizard prompts to:
   - Select spec type (Operation, Event, Presentation, etc.)
   - Provide required metadata
   - Choose output location

The wizard generates a properly structured spec file ready for customization.

## Method 2: Use Snippets

For quick creation, use IntelliSense snippets:

1. Create a new file with the appropriate extension:
   - `*.contracts.ts` for operations (commands/queries)
   - `*.event.ts` for domain events
   - `*.presentation.ts` for UI components
   - `*.workflow.ts` for multi-step processes

2. Type one of these snippet prefixes:
   - `contractspec-command` for write operations
   - `contractspec-query` for read operations
   - `contractspec-event` for events
   - `contractspec-presentation` for UI components

3. Press `Tab` to expand the snippet and fill in placeholders

## Method 3: Copy from Examples

Browse example specs:

1. Run `ContractSpec: Browse Examples`
2. Select an example that matches your use case
3. Initialize it in your workspace
4. Customize as needed

## Example: Creating a User Signup Command

```typescript
import { defineCommand } from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const UserSignupInput = defineSchemaModel({
  name: 'UserSignupInput',
  fields: {
    email: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    password: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const UserSignupOutput = defineSchemaModel({
  name: 'UserSignupOutput',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ok: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const UserSignupSpec = defineCommand({
  meta: {
    name: 'user.signup',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@team'],
    tags: ['user', 'authentication'],
    description: 'Register a new user account',
    goal: 'Allow new users to create accounts',
    context: 'First step in user onboarding flow',
  },

  io: {
    input: UserSignupInput,
    output: UserSignupOutput,
    errors: {
      EmailAlreadyExists: 'Email is already registered',
    },
  },

  policy: {
    auth: 'anonymous',
  },

  transport: {
    rest: { method: 'POST' },
  },
});
```

## Next Steps

Once you've created a spec:

- ✅ **Validate it** to ensure correctness
- 🔨 **Build from it** to generate handler code
- 👀 **Explore it** in the Specs Explorer sidebar

Ready to validate your spec? →

