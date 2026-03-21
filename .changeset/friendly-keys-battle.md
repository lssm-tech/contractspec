---
"@contractspec/lib.contracts-spec": major
"@contractspec/lib.ai-agent": major
"@contractspec/lib.support-bot": patch
"@contractspec/bundle.lifecycle-managed": patch
"@contractspec/module.ai-chat": patch
"@contractspec/app.cli-contractspec": patch
"vscode-contractspec": patch
"@contractspec/bundle.workspace": patch
"@contractspec/bundle.library": patch
---

Split agent definition contracts out of `@contractspec/lib.ai-agent` and make
`@contractspec/lib.contracts-spec` the source of truth for agent declaration APIs.

Major changes:

- Move `AgentSpec`, `AgentToolConfig`, `AgentPolicy`, `AgentRegistry`,
  `createAgentRegistry`, `defineAgent`, and related definition-only types into
  `@contractspec/lib.contracts-spec/agent`.
- Add `@contractspec/lib.contracts-spec/agent/spec` and
  `@contractspec/lib.contracts-spec/agent/registry` export subpaths.
- Remove `@contractspec/lib.ai-agent/spec`,
  `@contractspec/lib.ai-agent/spec/spec`, and
  `@contractspec/lib.ai-agent/spec/registry`.
- Remove the spec layer from the `@contractspec/lib.ai-agent` root barrel so it
  is runtime-focused.

Workspace consumers were migrated to import agent-definition contracts from
`@contractspec/lib.contracts-spec/agent`, and packages that only needed the
contract layer dropped their direct dependency on `@contractspec/lib.ai-agent`.
