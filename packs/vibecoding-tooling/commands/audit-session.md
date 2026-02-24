---
description: 'Analyze a session to detect agentpacks governance gaps and improvement opportunities'
targets: ['*']
---

scope = $ARGUMENTS

Invoke the `session-analyst` subagent to perform a retrospective analysis of the current session and identify governance gaps in agentpacks:

1. **Gather session context**:
   - If `scope` provided (e.g., a git range like `HEAD~5..HEAD`): use that as the change window
   - If empty: use all unstaged/staged changes plus the last 10 commits on the current branch
   - Collect:
     - `git diff --stat` for files changed
     - `git log --oneline` for recent commits
     - Any hook warnings emitted during the session (grep for `[agentpacks-hook]` in terminal history if available)
     - Current lint output (`turbo lint` warnings/errors relevant to changed files)

2. **Catalog all agentpacks assets** for cross-reference:
   - Rules: list all `packs/**/rules/*.md`
   - Commands: list all `packs/vibecoding-tooling/commands/*.md`
   - Skills: list all `packs/vibecoding-tooling/skills/*/SKILL.md`
   - Subagents: list all `packs/vibecoding-tooling/agents/*.md`
   - Hooks: read `packs/vibecoding-tooling/hooks/hooks.json` and all hook scripts

3. **Delegate to session-analyst** with 6 analysis dimensions:

   ### Missing Rules
   - For each file type or domain touched in the session, check if a governing rule exists
   - Examples: "Prisma migrations edited but no `database-migrations.md` rule", "Email templates edited but no `email-templates.md` rule"
   - Check if existing rules cover the patterns actually used in the changed files

   ### Missing Hooks
   - Identify patterns the `post-edit-checks.sh` hook should have caught but didn't
   - Examples: "console.log in a `.ts` file wasn't flagged (hook only checks `.tsx`)", "New service file has no logger import but hook doesn't check this"
   - Identify file types or directories not covered by existing hook matchers

   ### Missing Commands
   - Identify manual analysis steps performed during the session that should be automated
   - Examples: "You manually searched for hardcoded strings — `/audit-i18n` should have been suggested", "You manually checked dependency flow — `/audit-health` covers this"
   - Detect patterns where a command exists but wasn't referenced or invoked

   ### Missing Skills
   - Identify scaffolding or boilerplate that was created by hand and could be templated
   - Examples: "You hand-wrote a new copy file — the `add-i18n-copy` skill does this", "You scaffolded a new API route from scratch — consider a `create-api-route` skill"

   ### Stale Cross-References
   - Check that every command mentioned in rules actually exists
   - Check that every skill mentioned in commands actually exists
   - Check that every subagent referenced in commands has a corresponding `.md` file
   - Check that `overview.md` and `AGENTS.md` list all commands

   ### Rule Drift
   - Compare what rules say against what the codebase actually does
   - Examples: "Rule says max 250 lines but 15 files exceed this", "Rule says no `any` but 8 files have `any`"
   - Flag rules that describe aspirational standards vs. actual enforcement

4. **Report format**:

```
## Session Governance Report

**Session scope**: [git range or description]
**Files changed**: [count]
**Rules active**: [count] / [total]

### Missing Rules
- **[domain/pattern]**: [description of gap] → Suggested rule: `[name].md`

### Missing Hooks
- **[pattern]**: [what was missed] → Suggested hook addition

### Missing Commands
- **[manual step]**: [what was done by hand] → Suggested command: `/[name]`

### Missing Skills
- **[scaffolding pattern]**: [what was hand-written] → Suggested skill: `[name]`

### Stale Cross-References
| Source file | References | Status |
|-------------|-----------|--------|
| ...         | ...       | STALE / OK |

### Rule Drift
| Rule | Says | Reality | Gap |
|------|------|---------|-----|
| ...  | ...  | ...     | ... |

### Summary
- **Governance gaps found**: [count]
- **Quick wins** (easy to add): [list]
- **Structural improvements** (larger effort): [list]

### Suggested Next Steps
1. [Most impactful improvement]
2. [Next]
3. ...
```

5. **Related commands**:
   - Run `/audit-health` for code-level health checks
   - Run `/audit-observability` for logging/analytics gaps
   - Run `/audit-i18n` for internationalization compliance
   - Run `/review-plan` to review a plan before building
