---
"@contractspec/app.web-landing": patch
---

feat(web-landing): implement Agent-Friendly Documentation Spec recommendations

- Add llms-txt-directive blockquote on docs pages pointing to /llms.txt
- Add /docs/llms.txt rewrite for docs subpath discovery
- Add llms-full truncation note in llms.txt; recommend /llms/[slug] for agent fetches
- Add explicit AI crawler rules to robots.ts (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Add /llms, /llms.txt, /llms-full.txt, /docs/llms.txt to sitemap
- Update AGENTS.md with new entry points and standards compliance
