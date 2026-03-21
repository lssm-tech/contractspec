---
"@contractspec/module.workspace": minor
"@contractspec/bundle.workspace": minor
"@contractspec/app.cli-contractspec": minor
"vscode-contractspec": minor
---

Align workspace tooling with strict same-file DocBlock authoring.

- Add shared static authored-DocBlock analysis APIs to
  `@contractspec/module.workspace` for manifest building and validation without
  executing source modules.
- Update `@contractspec/bundle.workspace` to consume authored DocBlocks through
  static analysis, remove runtime DocBlock registration, and move impact docs
  into their owner modules.
- Update `@contractspec/app.cli-contractspec` to validate example packages with
  the shared authored-doc rules and reject standalone `*.docblock.ts` sources.
- Update `vscode-contractspec` to generate same-file DocBlocks in snippets and
  align extension-owned docs with the new authoring model.
