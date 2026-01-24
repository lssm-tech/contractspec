---
"@contractspec/lib.contracts": minor
---

feat(capabilities): robustify capabilities with bidirectional linking and runtime enforcement

- Add optional `capability` field to OperationSpec, EventSpec, and PresentationSpec for bidirectional linking
- Add `extends` field to CapabilitySpec for capability inheritance
- Add registry query methods: getOperationsFor, getEventsFor, getPresentationsFor, getCapabilitiesForOperation/Event/Presentation
- Add inheritance methods: getAncestors, getEffectiveRequirements, getEffectiveSurfaces
- Create validation.ts with validateCapabilityConsistency() for bidirectional validation
- Create context.ts with CapabilityContext for opt-in runtime capability checks
- Create guards.ts with assertCapabilityForOperation/Event/Presentation guards
- Add comprehensive tests (50 new tests)
- Update capabilities docblock with full documentation
