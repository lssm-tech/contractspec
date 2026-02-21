---
'agentpacks': minor
---

Phase 3 — Community features for agentpacks registry:

- **Reviews & Ratings**: `reviews` table, GET/POST/DELETE endpoints, one review per user per pack (upsert), cached average_rating + review_count, self-review prevention
- **Organizations**: `organizations` + `org_members` tables, CRUD + member management routes, role hierarchy (owner > admin > member), `@org/pack-name` scoped name parsing
- **Quality Scoring**: Automated 0-100 score (README, versions, license, targets, features, tags, repo, homepage, conflicts), GET /packs/:name/quality endpoint with breakdown, badge classification
- **Website**: Star ratings + quality badges on pack cards, reviews section + quality breakdown on pack detail page, API client extended
- **DB Migration**: `0002_community.sql` — 3 new tables, 3 new columns on packs
- **Tests**: 54 new tests (133 total registry-packs, 511 total project)
