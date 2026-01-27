Here’s a concise prompt you can give to your coding agent to implement OpenCode support in the ContractSpec CLI:

---

**Goal:** Enable first‑class support for OpenCode as an AI backend in ContractSpec, alongside existing agent modes like Cursor and Claude, to broaden our market reach and demonstrate vendor neutrality.

**Background:**
The underlying library already implements an `opencode-sdk` backend and registers it with the agent orchestrator. However, the CLI’s `--agent-mode` flag currently only lists `simple`, `cursor`, `claude‑code` and `openai‑codex`, so users can’t select the OpenCode agent. The validate command also omits it.

**Deliverables:**

1. **Expose the OpenCode mode in the CLI:**

  * Update the `--agent-mode` options for both the `build` and `validate` commands to include `opencode` (or `opencode-sdk` if you prefer).  This will allow users to specify the OpenCode agent via the CLI.
  * If using `opencode` as a user-facing alias, map it to the internal `'opencode-sdk'` string when setting `config.agentMode`.

2. **Adjust type definitions and registration:**

  * Ensure that `AgentMode` in `types.ts` includes the new alias if necessary (it already includes `'opencode-sdk'`).
  * Verify that `AgentOrchestrator` registers the opencode agent.  It currently does this with `UnifiedAgentAdapter('opencode-sdk', { backend: 'opencode-sdk' })`; add an alias if you change the name.

3. **Update documentation and help text:**

  * Amend the CLI help strings and README to describe the new `opencode` mode, including any dependencies (the provider dynamically imports `@opencode-ai/sdk`).
  * Highlight that OpenCode is suitable for teams requiring a self‑hosted, open AI backend.

4. **Quality checks:**

  * Write or update unit tests for the `build` and `validate` commands to ensure that specifying `--agent-mode opencode` routes the request to the correct backend and that the fallback chain still works.
  * Add a simple example in the `examples` directory that uses the OpenCode agent.

**Rationale:**
Adding OpenCode support expands our audience to users who prefer open, self‑hosted AI solutions and aligns with our mission to provide a flexible, vendor‑neutral development platform.  It also future‑proofs our agent architecture by embracing an emerging ecosystem.
