---
description: 'Create a draft PR with lifecycle-aware summary and validation checklist'
targets: ['*']
---

args = $ARGUMENTS

Open a draft pull request for the current branch:

1. **Context**:
   - Determine base branch (`main` by default or from args).
   - Collect commit log and `git diff <base>...HEAD --stat`.

2. **Generate title/body**:
   - Title style: `<type>(<scope>): <description>`.
   - Include summary of behavior changes and risk level.
   - Include validation checklist (types/lint/test/build).
   - Include lifecycle checklist (plan review, observability, docs).

3. **Create draft PR**:
   - Push branch if needed.
   - Use `gh pr create --draft --base <base> --title <title> --body <body>`.

4. **Report**:
   - Return PR URL.
   - Return open checklist items for reviewers.
