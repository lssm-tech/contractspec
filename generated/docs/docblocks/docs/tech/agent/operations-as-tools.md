# Operations as tools

**Preferred pattern:** Reference a ContractSpec operation in your agent via `operationRef`. The tool handler and input schema are derived automatically from the operation.

## Usage

1. Define an operation with `defineCommand` or `defineQuery`.
2. Register and bind a handler to `OperationSpecRegistry`.
3. In `AgentSpec.tools`, add `{ name: 'tool_name', operationRef: { key: 'domain.operation', version: '1.0.0' } }`.
4. Pass `operationRegistry` to `createAgentFactory` or `ContractSpecAgent.create`.

## Output rendering

When tool output should render via PresentationSpec, FormSpec, or DataViewSpec, add `outputPresentation`, `outputForm`, or `outputDataView` to `AgentToolConfig` (at most one per tool). The tool adapter wraps raw output for `ToolResultRenderer`. OperationSpec can also declare these refs; when the tool has no output refs, the operation's refs are used as fallback.

## Fallback (inline tools)

When the tool is not an operation (LLM subcalls, external APIs), use inline `AgentToolConfig` with `schema` and a manual handler in `toolHandlers`.

See `@contractspec/lib.ai-agent` README for full examples.
