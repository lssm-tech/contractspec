/**
 * AI prompts for spec creation.
 * Extracted from cli-contracts/src/ai/prompts/spec-creation.ts
 */

import type { OpKind, PresentationKind } from '../types/spec-types';

/**
 * Build prompt for creating operation spec from description.
 */
export function buildOperationSpecPrompt(
  description: string,
  kind: OpKind
): string {
  return `You are a senior software architect creating a contract specification for an operation.

The operation is a ${kind} (${kind === 'command' ? 'changes state, has side effects' : 'read-only, idempotent'}).

User description: ${description}

Create a complete contract specification following these guidelines:

1. **Name**: Use dot notation like "domain.operationName" (e.g., "user.signup", "payment.charge")
2. **Version**: Start at 1
3. **Description**: Clear, concise summary (1-2 sentences)
4. **Goal**: Business purpose - why this operation exists
5. **Context**: Background, constraints, scope (what it does and doesn't do)
6. **Input/Output**: Describe the shape (we'll create schemas separately)
7. **Auth**: Who can call this - anonymous, user, or admin
8. **Feature Flags**: Any flags that gate this operation
9. **Side Effects**: What events might be emitted, analytics to track

Respond with a structured spec.`;
}

/**
 * Build prompt for creating event spec from description.
 */
export function buildEventSpecPrompt(description: string): string {
  return `You are a senior software architect creating an event specification.

User description: ${description}

Create a complete event specification following these guidelines:

1. **Name**: Use dot notation like "domain.event_name" (e.g., "user.signup_completed", "payment.charged")
2. **Version**: Start at 1
3. **Description**: Clear description of when this event is emitted
4. **Payload**: Describe what data the event carries
5. **PII Fields**: List any personally identifiable information fields (e.g., ["email", "name"])

Events represent things that have already happened and should use past tense.

Respond with a structured spec.`;
}

/**
 * Build prompt for creating presentation spec from description.
 */
export function buildPresentationSpecPrompt(
  description: string,
  kind: PresentationKind
): string {
  const kindDescriptions = {
    web_component: 'a React component with props schema',
    markdown: 'markdown/MDX documentation or guide',
    data: 'structured data export (JSON/XML)',
  };

  return `You are a senior software architect creating a presentation specification.

This is a ${kind} presentation - ${kindDescriptions[kind]}.

User description: ${description}

Create a complete presentation specification following these guidelines:

1. **Name**: Use dot notation like "domain.presentation_name" (e.g., "user.profile_card", "docs.api_guide")
2. **Version**: Start at 1
3. **Description**: What this presentation shows/provides
4. **Kind-specific details**:
   ${
     kind === 'web_component'
       ? '- Component key (symbolic, resolved by host app)\n   - Props structure\n   - Analytics events to track'
       : kind === 'markdown'
         ? '- Content or resource URI\n   - Target audience'
         : '- MIME type (e.g., application/json)\n   - Data structure description'
   }

Respond with a structured spec.`;
}

/**
 * Build system prompt for all spec generation.
 */
export function getSystemPrompt(): string {
  return `You are an expert software architect specializing in API design and contract-driven development.

You create clear, well-documented specifications that serve as the single source of truth for operations, events, and presentations.

Your specs are:
- Precise and unambiguous
- Following TypeScript conventions
- Business-oriented (capturing the "why" not just "what")
- Designed for both humans and AI agents to understand

Always use proper dot notation for names and ensure all metadata is meaningful and accurate.`;
}

/**
 * Create example-based prompt for better results.
 */
export function addExampleContext(
  basePrompt: string,
  examples: string[]
): string {
  if (examples.length === 0) return basePrompt;

  return `${basePrompt}

Here are some good examples for reference:

${examples.join('\n\n')}

Follow this structure and quality level.`;
}



