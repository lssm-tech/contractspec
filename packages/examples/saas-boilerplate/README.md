# SaaS Boilerplate

Website: https://contractspec.io/


A complete SaaS starter application demonstrating ContractSpec principles.

## What's Included

This example showcases a full SaaS application with:

- **User Management**: User profiles, authentication, preferences
- **Organizations**: Multi-tenant workspaces with members and roles
- **Projects**: Team-scoped projects with CRUD operations
- **Billing**: Usage tracking and subscription management
- **Settings**: Application and user settings

## Architecture

```
saas-boilerplate/
├── entities/           # Entity specs (generates Prisma schema)
│   ├── project.ts
│   ├── settings.ts
│   └── billing.ts
├── contracts/          # API contracts (generates GraphQL/REST)
│   ├── project.ts
│   └── billing.ts
├── events/             # Domain events
│   └── index.ts
├── schema.config.ts    # Schema composition config
└── README.md
```

## Cross-Cutting Modules Used

| Module | Purpose |
|--------|---------|
| @contractspec/lib.identity-rbac | User, Org, Member, Role entities |
| @contractspec/module.audit-trail | Activity logging |
| @contractspec/module.notifications | User notifications |
| @contractspec/lib.jobs | Background tasks |

## Entities

### Project

Projects belong to organizations and track team work.

```typescript
const ProjectEntity = defineEntity({
  name: 'Project',
  fields: {
    id: field.id(),
    name: field.string(),
    description: field.string({ isOptional: true }),
    organizationId: field.foreignKey(),
    createdBy: field.foreignKey(),
    status: field.enum('ProjectStatus'),
    // ...
  },
});
```

### Settings

Application and organization settings.

```typescript
const SettingsEntity = defineEntity({
  name: 'Settings',
  fields: {
    id: field.id(),
    key: field.string(),
    value: field.json(),
    scope: field.enum('SettingsScope'), // 'app', 'org', 'user'
    // ...
  },
});
```

### BillingUsage

Track feature usage for billing.

```typescript
const BillingUsageEntity = defineEntity({
  name: 'BillingUsage',
  fields: {
    id: field.id(),
    organizationId: field.foreignKey(),
    feature: field.string(),
    quantity: field.int(),
    billingPeriod: field.string(),
    // ...
  },
});
```

## Contracts

### Project CRUD

- `project.create` - Create a new project
- `project.get` - Get project by ID
- `project.update` - Update project
- `project.delete` - Delete project
- `project.list` - List org projects

### Billing

- `billing.usage.record` - Record feature usage
- `billing.usage.get` - Get usage summary
- `billing.subscription.get` - Get subscription status

## Events

| Event | Description |
|-------|-------------|
| project.created | New project created |
| project.updated | Project modified |
| project.deleted | Project removed |
| billing.usage.recorded | Usage tracked |
| billing.limit.reached | Usage limit hit |

## Usage

### Generate Schema

```bash
cd packages/examples/saas-boilerplate
```

### Load as Studio Template

This example is registered in the ContractSpec Studio template registry as `saas-boilerplate`.

From the Studio UI:
1. Click "New Project"
2. Select "SaaS Boilerplate" template
3. Customize entities and contracts as needed

### Clone via Git

```bash
npx degit lssm/contractspec/packages/examples/saas-boilerplate my-saas-app
```

## Customization Points

1. **Add Custom Entities**: Extend with your domain models
2. **Modify Billing**: Adapt to your pricing model
3. **Extend Settings**: Add app-specific configuration
4. **Add Workflows**: Integrate with @contractspec/lib.jobs for background tasks

