# Validating Your Specs

Validation ensures your specs are well-formed, complete, and consistent with ContractSpec's requirements.

## Automatic Validation

The extension automatically validates specs when you:

- **Open** a spec file (if enabled in settings)
- **Save** a spec file (if enabled in settings)

Validation errors appear as:
- Red squiggly underlines in the editor
- Problems panel entries
- Status bar indicators

## Manual Validation

### Validate Current Spec

Open a spec file and run:
- Command Palette → `ContractSpec: Validate Current Spec`
- Or click the **✓** icon in the editor title bar
- Or right-click and select `ContractSpec: Validate Current Spec`

Results appear in the Output panel.

### Validate All Specs

To validate your entire workspace:
- Command Palette → `ContractSpec: Validate All Specs in Workspace`

This scans all spec files and provides a summary.

## Common Validation Issues

### Missing Required Fields

```typescript
// ❌ Invalid: missing description
export const MySpec = defineCommand({
  meta: {
    name: 'user.action',
    version: 1,
    // description is required!
  },
  // ...
});

// ✅ Valid: all required fields present
export const MySpec = defineCommand({
  meta: {
    name: 'user.action',
    version: 1,
    description: 'Perform user action',
    owners: ['@team'],
  },
  // ...
});
```

### Invalid Schema Definitions

```typescript
// ❌ Invalid: field type not specified
const Input = defineSchemaModel({
  name: 'Input',
  fields: {
    email: { isOptional: false }, // missing type!
  },
});

// ✅ Valid: field type specified
const Input = defineSchemaModel({
  name: 'Input',
  fields: {
    email: { 
      type: ScalarTypeEnum.String_unsecure(), 
      isOptional: false 
    },
  },
});
```

### Inconsistent Naming

```typescript
// ❌ Invalid: name doesn't match pattern
export const MySpec = defineCommand({
  meta: {
    name: 'UserAction', // should be lowercase with dots
    // ...
  },
});

// ✅ Valid: proper naming convention
export const MySpec = defineCommand({
  meta: {
    name: 'user.action', // domain.operation
    // ...
  },
});
```

## Validation Settings

Configure validation behavior in VS Code settings:

- `contractspec.validation.onSave` — Validate when saving (default: true)
- `contractspec.validation.onOpen` — Validate when opening (default: true)

## Next Steps

Once your specs are validated:
- 🔨 **Build from them** to generate implementation code
- 📊 **Analyze dependencies** to understand relationships
- 🔄 **Sync all specs** to regenerate your codebase

Ready to build? →

