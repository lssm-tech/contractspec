import { CITATION_RULES, JSON_ONLY_RULES } from './prompts';

export function promptExtractEvidenceFindings(params: {
  question: string;
  evidenceJSON: string;
}): string {
  return `
You are extracting evidence findings grounded in transcript excerpts.

Question:
${params.question}

Evidence:
${params.evidenceJSON}

Return JSON:
{
  "findings": [
    {
      "findingId": "find_001",
      "summary": "...",
      "tags": ["..."],
      "citations": [{ "chunkId": "...", "quote": "..." }]
    }
  ]
}

Rules:
- Produce 8 to 18 findings.
- Each finding must include at least 1 citation.
- Summaries must be specific and short.
- Quotes must be copied character-for-character from the chunk text (no paraphrasing, no ellipses).
- Preserve punctuation, smart quotes, and special hyphens exactly as shown in the chunk text.
${CITATION_RULES}
${JSON_ONLY_RULES}
  `.trim();
}

export function promptGroupProblems(params: {
  question: string;
  findingsJSON: string;
  findingIds: string[];
}): string {
  const allowed = JSON.stringify({ findingIds: params.findingIds }, null, 2);
  return `
You are grouping evidence findings into problem statements.

Question:
${params.question}

Findings:
${params.findingsJSON}

Allowed finding IDs:
${allowed}

Return JSON:
{
  "problems": [
    {
      "problemId": "prob_001",
      "statement": "...",
      "evidenceIds": ["find_001"],
      "tags": ["..."],
      "severity": "low|medium|high"
    }
  ]
}

Rules:
- Each problem must reference 1 to 6 evidenceIds.
- evidenceIds must be drawn from the allowed finding IDs.
- Keep statements short and actionable.
${JSON_ONLY_RULES}
  `.trim();
}

export function promptGenerateTickets(params: {
  question: string;
  problemsJSON: string;
  findingsJSON: string;
}): string {
  return `
You are generating implementation tickets grounded in evidence.

Question:
${params.question}

Problems:
${params.problemsJSON}

Evidence findings:
${params.findingsJSON}

Return JSON:
{
  "tickets": [
    {
      "ticketId": "t_001",
      "title": "...",
      "summary": "...",
      "evidenceIds": ["find_001"],
      "acceptanceCriteria": ["..."]
    }
  ]
}

Rules:
- 1 to 2 tickets per problem.
- Every ticket must include evidenceIds and acceptanceCriteria.
- Acceptance criteria must be testable.
- Each acceptanceCriteria item must be <= 160 characters.
${JSON_ONLY_RULES}
  `.trim();
}

export function promptSuggestPatchIntent(params: {
  ticketJSON: string;
}): string {
  return `
You are generating a ContractPatchIntent from an evidence-backed ticket.

Ticket:
${params.ticketJSON}

Return JSON:
{
  "featureKey": "feature_slug",
  "changes": [
    { "type": "add_field|remove_field|rename_field|add_event|update_event|add_operation|update_operation|update_form|update_policy|add_enum_value|remove_enum_value|other", "target": "string", "detail": "string" }
  ],
  "acceptanceCriteria": ["..."]
}

Rules:
- Keep changes <= 8.
- Each change must be concrete and scoped.
- Acceptance criteria must be testable and derived from the ticket.
- Each acceptanceCriteria item must be <= 140 characters.
${JSON_ONLY_RULES}
  `.trim();
}
