---
description: 'Help debug an issue with guided investigation'
targets: ["*"]
---

issue_description = $ARGUMENTS

Guide debugging process:

1. **Understand the issue**:
   - Parse the issue description or error message
   - Identify the type of issue:
     - Runtime error
     - Type error
     - Logic bug
     - Performance issue
     - Test failure

2. **Gather context**:
   - Find relevant files based on error stack trace
   - Check recent changes (`git diff HEAD~5`)
   - Look for related tests
   - Check for similar issues in codebase

3. **Investigation steps**:

   **For runtime errors**:
   - Parse stack trace
   - Identify the failing function
   - Check input validation
   - Look for null/undefined access

   **For type errors**:
   - Read the full TypeScript error
   - Check type definitions
   - Verify generic constraints
   - Look for type narrowing issues

   **For logic bugs**:
   - Understand expected behavior
   - Trace data flow
   - Check edge cases
   - Review recent changes to the area

   **For performance issues**:
   - Identify the slow operation
   - Check for N+1 queries
   - Look for unnecessary re-renders
   - Review loop complexity

4. **Provide diagnosis**:
   - Root cause explanation
   - Affected code locations
   - Suggested fix with code
   - Related tests to add

5. **Verification**:
   - Suggest how to verify the fix
   - Recommend tests to prevent regression

## Output format

```
## Debugging: "Cannot read property 'id' of undefined"

**Stack trace analysis**:
  - Error occurs in: src/services/userService.ts:89
  - Called from: src/api/routes/users.ts:34
  - Triggered by: GET /api/users/:id

**Root cause**:
  The `findUser()` function returns `undefined` when user not found,
  but the caller assumes it always returns a User object.

**Location**: src/services/userService.ts:89
```typescript
// Current (buggy)
const user = await findUser(id);
return { name: user.name }; // Crashes if user undefined

// Fixed
const user = await findUser(id);
if (!user) {
  throw new UserNotFoundError(id);
}
return { name: user.name };
```

**Tests to add**:
  - Test case for non-existent user ID
  - Test case for deleted user
```