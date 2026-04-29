---
"@contractspec/lib.data-exchange-core": minor
"@contractspec/lib.data-exchange-client": minor
"@contractspec/lib.data-exchange-server": minor
---

Add template-aware import mapping for flexible CSV, JSON, and XML ingestion.

Developers can now publish reusable data-exchange templates with recommended target columns, aliases, and value formatting rules while end users upload partner-specific files with different headers or localized values. Core planning resolves exact, alias, normalized, and schema-fallback mappings; client controllers expose template review/remap state; and server dry-run/execution paths thread templates, format profiles, codec options, and mapping-source audit evidence.
