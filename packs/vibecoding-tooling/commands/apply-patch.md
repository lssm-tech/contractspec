---
description: Apply a ContractSpec action item by ID, generating code changes and a draft PR
targets: ['*']
---

actionItemId = $ARGUMENTS

Apply a ContractSpec action item end-to-end:

1. **Validate input**:
   - If `actionItemId` is not provided, ask the user for the action item ID
   - Verify the action item ID format is valid

2. **Fetch the action item**:
   - Use the `contractspec-cli` MCP tool `contractspec.getActionItem` to retrieve the action item definition
   - Display action item summary: affected operations, change type (addField, renameField, deprecate, etc.), and target version

3. **Generate spec variants**:
   - Leverage `@contractspec/lib.evolution` to produce the updated spec from the action item
   - Run `SpecVariantGenerator` with the action item delta to create the new contract version
   - Validate the generated spec against existing invariants

4. **Apply code changes**:
   - Invoke the `apply-patch` skill to scaffold implementation changes
   - Update affected files: contracts, handlers, tests, types
   - Ensure backward compatibility layers are generated for breaking changes

5. **Run quality checks**:
   - `turbo build:types` - verify type safety
   - `turbo lint` - check lint rules
   - `turbo test` - run affected tests
   - Report failures with file:line references

6. **Create a draft PR**:
   - Create a new branch: `action-item/<actionItemId>`
   - Stage all changes and commit with: `feat(contracts): apply action item <actionItemId>`
   - Open a draft PR via `gh pr create --draft` with:
     - Title: `Apply action item: <actionItemId>`
     - Body: action item summary, affected contracts, breaking changes (if any)

7. **Report results**:
   - Show the PR URL
   - List all modified files
   - Flag any manual review items

## Example output

```
Action Item: action-item-2024-0042
Type: addField
Affected: createUser (command), userCreated (event)
Branch: action-item/action-item-2024-0042

Changes applied:
  - packages/libs/contracts-contractspec-studio/src/onboarding/createUser.ts (modified)
  - packages/libs/contracts-contractspec-studio/src/onboarding/userCreated.ts (modified)
  - packages/apps/api/src/handlers/createUser.handler.ts (modified)
  - packages/apps/api/src/handlers/__tests__/createUser.test.ts (modified)

Checks: types yes | lint yes | test yes
PR: https://github.com/org/repo/pull/456 (draft)
```
