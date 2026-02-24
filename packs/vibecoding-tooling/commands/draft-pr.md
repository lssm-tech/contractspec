---
description: Open a draft PR with auto-generated title and description from changes
targets: ['*']
---

args = $ARGUMENTS

Open a draft pull request for the current branch:

1. **Parse arguments**:
   - Extract optional flags: `--title="custom title"` and `--base=main`
   - Defaults: `base` = `main`, `title` = auto-generated

2. **Gather change context**:
   - Run `git diff <base>...HEAD --stat` for a file change summary
   - Run `git log <base>..HEAD --oneline` for commit history
   - Detect contract changes by searching diffs for `defineCommand`, `defineQuery`, `defineEvent` modifications
   - If contracts changed, run a lightweight impact analysis (same as `/impact`)

3. **Generate PR title** (if not provided):
   - Derive from the most significant commit or the overall theme
   - Use conventional commit style: `<type>(<scope>): <description>`

4. **Generate PR description**:
   - Use the following template:

     ```markdown
     ## Summary

     <1-3 bullet points describing the changes>

     ## Changes

     <grouped list of modified files by category>

     ## Contract Changes

     <table of SpecDeltas if any contracts were modified, otherwise "None">

     ## Impact

     <brief impact analysis: surfaces affected, consumers, risk level>

     ## Testing

     - [ ] Types pass (`turbo build:types`)
     - [ ] Lint passes (`turbo lint`)
     - [ ] Tests pass (`turbo test`)

     ## Code Health

     - [ ] `/audit-health` passes (file sizes, layer compliance, reusability)
     - [ ] `/audit-observability` passes (logging, analytics coverage)
     - [ ] `/review-plan` was run before building (if implementing a plan)

     ## Notes

     <any additional context, migration steps, or reviewer guidance>
     ```

5. **Create the draft PR**:
   - Ensure changes are pushed to remote: `git push -u origin <branch>`
   - Use `cursorpm.createPullRequest` MCP tool with `draft: true`
   - If MCP is unavailable, fall back to `gh pr create --draft`
   - Include `--base <base>` and `--title <title>` and `--body <description>`

6. **Report result**:
   - Show the PR URL
   - Show a summary of what was included

## Example output

```
Draft PR created: #789
Title: feat(contracts): add role field to createUser command
Base: main <- feature/user-roles
URL: https://github.com/org/repo/pull/789

Summary:
  - 3 contracts modified (createUser, getUser, userCreated)
  - 5 files changed (+142, -38)
  - Impact: LOW risk, additive changes only
  - Status: draft
```
