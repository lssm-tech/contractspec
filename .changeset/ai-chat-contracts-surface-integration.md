---
"@contractspec/module.ai-chat": patch
---

feat(ai-chat): contracts context, surface-runtime integration, adapter fixes

- Contracts-Spec context: contractsContext exposes agent, data-views, operations, forms, presentations; AgentToolConfig[] for agent tools
- Surface-runtime: surfacePlanConfig enables propose-patch tool; createAiSdkBundleAdapter for planner integration
- agent-tools-adapter: simplify schema handling, remove jsonSchemaToZodSafe dependency
- surface-planner-tools: fix imports, improve zod schema typing
- ChatInput: explicit onChange type for Textarea
