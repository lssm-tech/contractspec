---
description: Create a GitHub issue with auto-formatted context
targets: ['*']
---

args = $ARGUMENTS

Create a GitHub issue with structured context:

1. **Parse arguments**:
   - Extract `title` as the first unquoted or quoted string from `args`
   - Extract optional flags: `--labels=bug,contracts` and `--assignee=username`
   - If no title provided, ask the user for one

2. **Determine issue context**:
   - If invoked after `/impact`: include the relevant SpecDelta and affected surfaces
   - If invoked after `/contracts`: reference the contract in question
   - If invoked after `/analyze-codebase`: include the coverage gap or drift details
   - Otherwise: ask the user for a description or use the recent conversation context

3. **Format the issue body**:
   - Use the following template:

     ```markdown
     ## Summary

     <concise description of the issue>

     ## Context

     - **Source**: <how this issue was identified>
     - **Contracts affected**: <list of operation keys, if any>
     - **Surfaces impacted**: <API, UI, DB, Events>

     ## Details

     <expanded description, steps to reproduce, or analysis output>

     ## Acceptance Criteria

     - [ ] <criterion derived from the context>

     ## References

     - <links to related PRs, specs, or files>
     ```

4. **Create the issue**:
   - Use `cursorpm.createIssue` MCP tool with:
     - `title`: the parsed title
     - `body`: the formatted body
     - `labels`: parsed labels or sensible defaults based on context
     - `assignees`: parsed assignee if provided
   - If MCP is unavailable, fall back to `gh issue create`

5. **Report result**:
   - Show the issue URL
   - Show the issue number
   - Confirm labels and assignee

## Example output

```
Issue created: #234
Title: createUser contract missing validation for email format
URL: https://github.com/org/repo/issues/234
Labels: contracts, bug
Assignee: @alice
```
