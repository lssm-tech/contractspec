---
description: 'Execute an implementation plan with structured tracking'
targets: ['*']
---

plan_path = $ARGUMENTS

Execute the implementation plan with full traceability:

0. **Pre-check** (recommended):
   - If `/review-plan` has not been run on this plan, suggest running it first
   - Briefly note: "For best results, run `/review-plan <plan_path>` before executing to catch gaps from 6 expert perspectives"

1. **Locate the plan**:
   - If `plan_path` provided: use that file
   - If empty: default to `IMPLEMENTATION_PLAN.md`
   - If not found: search for `*IMPLEMENTATION_PLAN*.md` or ask the user

2. **Parse the plan**:
   - Capture goals, constraints, deliverables, and quality checks
   - Preserve the plan's order and dependencies
   - Highlight any unclear or missing requirements before coding

3. **State applicable rules**:
   - Identify relevant rule files for the work (AI governance, architecture, quality)
   - Note conflict resolution priority: Security > Compliance > Safety/Privacy > Stability/Quality > UX > Performance > Convenience
   - Record the rules applied in your response for traceability

4. **Build the todo list** (use `TodoWrite`):
   - Create 1 task per plan deliverable/step
   - Add explicit tasks for tests, lint, docs, changeset, and commit
   - Mark only one task `in_progress` at a time
   - Update status after each task is completed

5. **Implement tasks in order**:
   - Read relevant files and follow existing patterns
   - Keep changes minimal and reversible
   - Remove placeholder comments in changed files (implement or delete them)
   - If a step is ambiguous or blocked, stop and ask one targeted question

6. **Quality gates**:
   - Run checks required by the plan
   - Default checks when unspecified:
     - `turbo build:types`
     - `turbo lint`
     - `turbo test`
   - If the repo mandates validation, run `bunx contractspec ci`
   - Run build verification last: `turbo run build`
   - Run `/audit-health` to verify file organization, layer compliance, and observability coverage
   - Run `/audit-observability` if new services or handlers were added
   - Report failures with file:line references and suggested fixes

7. **Changeset handling**:
   - If changes affect published packages, add a `.changeset/*.md` file
   - Prefer a simple manual template when interactive commands are unsuitable:

     ```md
     ---
     '@contractspec/<package>': patch
     ---

     <short summary of why the change matters>
     ```

   - Ensure the changeset is tracked as a todo item and included in commits

8. **Commit handling**:
   - Only commit when the user explicitly requests it
   - Use conventional commits and include the changeset file
   - Follow `/commit` guidance for message format and safety checks

9. **Finalize**:
   - Summarize completed tasks, remaining work, and checks run
   - Run `/ai-audit` and report results

## Output format

```
Plan: <path>
Todos: X total, Y complete, 1 in progress
Rules: <list of applied rules>
Checks: types/lint/test/ci status
Changeset: added | not needed | pending
Commit: pending | done
```
