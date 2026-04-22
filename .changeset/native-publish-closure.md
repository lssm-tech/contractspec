---
"@contractspec/tool.bun": patch
"@contractspec/lib.design-system": patch
"@contractspec/module.ai-chat": patch
---

Harden published cross-platform UI packages around precise public subpath imports.

Native Bun builds now emit generic shared source entries into `dist/native` whenever a package has native-family entries, so native public exports can resolve their shared helper dependency closure after publish. The AI chat presentation package now imports design-system controls through precise public component subpaths and keeps its presentation exports browser-only rather than native-compatible.
