---
"@contractspec/lib.contracts": minor
---

feat(contracts): robustify policy, workflow, and translations modules

Phase 2 of the contracts library robustification:

**Policy Module (Phase 2.1):**
- Add `PolicyContext` for runtime RBAC/ABAC enforcement with role/permission checks
- Add `PolicyViolationError` with detailed violation types
- Add policy guards: `checkPolicyForOperation`, `assertPolicyForOperation`, `filterOperationsByPolicy`
- Add role/permission guards: `checkRole`, `assertRole`, `checkPermission`, `assertPermission`
- Add rate limiting support with sliding window algorithm
- Add audit trail integration
- Add `validatePolicySpec` and `validatePolicyConsistency` for policy validation
- 128 new tests

**Workflow Module (Phase 2.2):**
- Add `WorkflowContext` interface for state management, transitions, and SLA tracking
- Add `WorkflowContextError` with typed error categories
- Add compensation/rollback support hints
- Add helper utilities: `calculateWorkflowProgress`, `getWorkflowDuration`, `getAverageStepDuration`
- Enhance validation with cross-registry consistency checks
- Add `validateWorkflowConsistency` for operations/events integration
- Add `validateSlaConfig`, `validateCompensation`, `validateRetryConfig`
- 64 new tests

**Translations Module (Phase 2.3):**
- Add full `TranslationSpec` with placeholders, plural rules, and message variants
- Add `TranslationRegistry` with locale-aware lookup and fallback chains
- Add `defineTranslation` factory function
- Add ICU message format validation with `validateICUFormat`
- Add missing translation detection with `findMissingTranslations`, `findAllMissingTranslations`
- Add `validateTranslationSpec` and `validateTranslationRegistry`
- Add `TranslationValidationError` for assertion helpers
- 77 new tests

Total: 890 tests across 93 files, all passing.
