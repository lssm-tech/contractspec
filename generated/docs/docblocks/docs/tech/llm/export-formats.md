# LLM Export Formats

ContractSpec provides three export formats optimized for different LLM use cases.

## Context Format

Best for: Understanding what a spec does, providing background to LLMs.

Includes:
- Spec name, version, type
- Goal and context
- Description
- Acceptance scenarios

Example:

```markdown
# users.createUser (v1)

> Create a new user account with email verification.

**Type:** command | **Stability:** stable

## Goal
Create a new user in the system and trigger email verification.

## Context
Part of the user onboarding flow. Called after signup form submission.

## Acceptance Criteria
### Happy path
**Given:** Valid email and password
**When:** User submits registration
**Then:** Account is created, verification email is sent
```

## Full Format

Best for: Complete documentation, implementation reference.

Includes everything:
- All metadata
- JSON schemas for I/O
- Error definitions
- Policy (auth, rate limits, PII)
- Events emitted
- Examples
- Transport configuration

## Prompt Format

Best for: Feeding directly to coding agents.

Includes:
- Task header with clear instructions
- Full spec context
- Implementation requirements
- Task-specific guidance (implement/test/refactor/review)
- Expected output format

The prompt format adapts based on task type:
- **implement**: Full implementation with tests
- **test**: Test generation for existing code
- **refactor**: Refactoring while maintaining behavior
- **review**: Code review against spec
