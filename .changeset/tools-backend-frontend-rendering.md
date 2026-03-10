---
"@contractspec/lib.ai-agent": minor
"@contractspec/lib.contracts-spec": minor
"@contractspec/module.ai-chat": minor
---

feat(tools): backend operations + frontend rendering support

- **AgentToolConfig**: Add `outputPresentation`, `outputForm`, `outputDataView` for declarative tool output rendering (at most one per tool)
- **Tool adapter**: Wrap raw tool output as `{ presentationKey, data }`, `{ formKey, defaultValues }`, or `{ dataViewKey, items }` for ToolResultRenderer
- **OperationSpec**: Optional `outputPresentation`, `outputForm`, `outputDataView`; tool adapter falls back to operation refs when AgentToolConfig has none
- **ToolResultRenderer**: Add DataViewSpec support via `dataViewRenderer` prop, `DataViewToolResult`, `isDataViewToolResult`
- **Chat components**: Thread `dataViewRenderer` through ChatMessage, ChatWithExport, ChatWithSidebar
