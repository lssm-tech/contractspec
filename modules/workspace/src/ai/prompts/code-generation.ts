/**
 * Build prompt for generating handler implementation
 */
export function buildHandlerPrompt(specCode: string): string {
  return `You are a senior TypeScript developer implementing a handler for a contract specification.

Here is the contract spec:

\`\`\`typescript
${specCode}
\`\`\`

Generate a complete handler implementation that:

1. **Matches the spec signature**: Input/output types from the spec
2. **Handles errors**: Implement error cases defined in spec.io.errors
3. **Emits events**: Use the events declared in spec.sideEffects.emits
4. **Validates input**: Use zod validation from the schema
5. **Follows best practices**: Clean, type-safe TypeScript
6. **Includes comments**: Explain business logic

The handler should be production-ready with proper error handling, logging points, and clear structure.

Return only the TypeScript code for the handler function.`;
}

/**
 * Build prompt for generating React component from presentation spec
 */
export function buildComponentPrompt(specCode: string): string {
  return `You are a senior React developer creating a component for a presentation specification.

Here is the presentation spec:

\`\`\`typescript
${specCode}
\`\`\`

Generate a complete React component that:

1. **Props interface**: Typed props from the spec
2. **Accessibility**: Proper ARIA labels, roles, keyboard navigation
3. **Mobile-first**: Optimized for small screens and touch
4. **Clean UI**: Simple, intuitive interface
5. **Type-safe**: Full TypeScript with no 'any' types
6. **Best practices**: React hooks, proper state management

The component should follow Atomic Design principles and be reusable.

Return only the TypeScript/TSX code for the component.`;
}

/**
 * Build prompt for generating form component
 */
export function buildFormPrompt(specCode: string): string {
  return `You are a senior React developer creating a form component from a form specification.

Here is the form spec:

\`\`\`typescript
${specCode}
\`\`\`

Generate a complete form component using react-hook-form that:

1. **Form validation**: Use zod schema for validation
2. **Field types**: Proper inputs for each field type
3. **Conditional logic**: Support visibleWhen, enabledWhen, requiredWhen predicates
4. **Error handling**: Clear, user-friendly error messages
5. **Accessibility**: Labels, hints, ARIA attributes
6. **Mobile-optimized**: Touch-friendly, appropriate input types
7. **Type-safe**: Full TypeScript

The form should provide excellent UX with real-time validation and helpful feedback.

Return only the TypeScript/TSX code for the form component.`;
}

/**
 * Build prompt for generating tests
 */
export function buildTestPrompt(
  specCode: string,
  implementationCode: string,
  testType: 'handler' | 'component'
): string {
  const testFocus =
    testType === 'handler'
      ? `
  - Test all acceptance scenarios from the spec
  - Test error cases defined in spec.io.errors
  - Verify events are emitted correctly
  - Test input validation
  - Test happy path and edge cases`
      : `
  - Test rendering with various props
  - Test user interactions
  - Test accessibility (a11y)
  - Test responsive behavior
  - Test error states`;

  return `You are a senior developer writing comprehensive tests.

Spec:
\`\`\`typescript
${specCode}
\`\`\`

Implementation:
\`\`\`typescript
${implementationCode}
\`\`\`

Generate complete test suite using Vitest that:
${testFocus}

Use clear test descriptions and follow AAA pattern (Arrange, Act, Assert).

Return only the TypeScript test code.`;
}

/**
 * System prompt for code generation
 */
export function getCodeGenSystemPrompt(): string {
  return `You are an expert TypeScript developer with deep knowledge of:
- Type-safe API design
- React and modern hooks
- Test-driven development
- Accessibility best practices
- Clean code principles

Generate production-ready code that is:
- Fully typed (no 'any' or type assertions unless absolutely necessary)
- Well-documented with TSDoc comments
- Following project conventions
- Defensive and error-safe
- Easy to maintain and extend

Always prioritize code quality, safety, and user experience.`;
}
