# CRM Pipeline

Website: https://contractspec.io/


A complete CRM (Customer Relationship Management) application demonstrating ContractSpec principles.

## What's Included

This example showcases a CRM system with:

- **Contacts**: Individual people with contact information
- **Companies**: Organizations/accounts that contacts belong to
- **Deals**: Sales opportunities with pipeline stages
- **Pipelines**: Customizable sales pipelines with stages
- **Tasks**: Follow-up activities tied to contacts/deals

## Architecture

```
crm-pipeline/
├── entities/           # Entity specs (generates Prisma schema)
│   ├── contact.ts
│   ├── company.ts
│   ├── deal.ts
│   ├── pipeline.ts
│   └── task.ts
├── contracts/          # API contracts
│   ├── contact.ts
│   ├── deal.ts
│   └── task.ts
├── events/             # Domain events
│   └── index.ts
└── README.md
```

## Entities

### Contact

```typescript
const ContactEntity = defineEntity({
  name: 'Contact',
  fields: {
    id: field.id(),
    firstName: field.string(),
    lastName: field.string(),
    email: field.email({ isOptional: true }),
    phone: field.string({ isOptional: true }),
    companyId: field.foreignKey({ isOptional: true }),
    ownerId: field.foreignKey(),
    // ...
  },
});
```

### Company

```typescript
const CompanyEntity = defineEntity({
  name: 'Company',
  fields: {
    id: field.id(),
    name: field.string(),
    domain: field.string({ isOptional: true }),
    industry: field.string({ isOptional: true }),
    size: field.enum('CompanySize'),
    // ...
  },
});
```

### Deal

```typescript
const DealEntity = defineEntity({
  name: 'Deal',
  fields: {
    id: field.id(),
    name: field.string(),
    value: field.decimal(),
    currency: field.string(),
    stageId: field.foreignKey(),
    contactId: field.foreignKey({ isOptional: true }),
    companyId: field.foreignKey({ isOptional: true }),
    // ...
  },
});
```

### Pipeline & Stage

```typescript
const PipelineEntity = defineEntity({
  name: 'Pipeline',
  fields: {
    id: field.id(),
    name: field.string(),
    isDefault: field.boolean(),
    // ...
  },
});

const StageEntity = defineEntity({
  name: 'Stage',
  fields: {
    id: field.id(),
    name: field.string(),
    pipelineId: field.foreignKey(),
    position: field.int(),
    probability: field.int(), // Win probability %
    // ...
  },
});
```

## Events

| Event | Description |
|-------|-------------|
| contact.created | New contact added |
| deal.created | New deal created |
| deal.moved | Deal moved to new stage |
| deal.won | Deal marked as won |
| deal.lost | Deal marked as lost |
| task.completed | Task marked complete |

## Usage

### Load as Studio Template

This example is registered as `crm-pipeline` in the ContractSpec Studio.

### Clone via Git

```bash
npx degit lssm/contractspec/packages/examples/crm-pipeline my-crm-app
```

