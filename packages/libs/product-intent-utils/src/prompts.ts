import type { EvidenceChunk } from '@contractspec/lib.contracts-spec/product-intent/types';

/**
 * Prompt construction helpers for the product intent workflow.
 */

/**
 * Format evidence chunks as JSON suitable for embedding in prompts.
 * Long texts are truncated to a configurable maximum number of characters.
 */
export function formatEvidenceForModel(
  chunks: EvidenceChunk[],
  maxChars = 900
): string {
  const safe = chunks.map((chunk) => ({
    chunkId: chunk.chunkId,
    text:
      chunk.text.length > maxChars
        ? `${chunk.text.slice(0, maxChars)}...`
        : chunk.text,
    meta: chunk.meta ?? {},
  }));
  return JSON.stringify({ evidenceChunks: safe }, null, 2);
}

/**
 * Rules that instruct the model to output only JSON.
 */
export const JSON_ONLY_RULES = `
You MUST output valid JSON ONLY.
- Do not wrap in markdown fences.
- Do not include any commentary.
- Do not include trailing commas.
- Use double quotes for all keys and string values.
`;

/**
 * Citation rules used in prompts that require citations.
 */
export const CITATION_RULES = `
CITATION RULES (strict):
- You may ONLY cite from the provided evidenceChunks.
- Each citation must include:
  - "chunkId": exactly one of the provided chunkId values
  - "quote": an exact substring copied from that chunk's text
- Do NOT invent quotes.
- Keep quotes short (<= 240 chars).
- If you cannot support a claim with evidence, do not make the claim.
`;

/**
 * Prompt for extracting atomic, evidence-grounded insights.
 */
export function promptExtractInsights(params: {
  question: string;
  evidenceJSON: string;
}): string {
  return `
You are extracting ATOMIC, EVIDENCE-GROUNDED insights to answer a product discovery question.

Question:
${params.question}

Evidence:
${params.evidenceJSON}

Task:
Return JSON with:
{
  "insights": [
    {
      "insightId": "ins_001",
      "claim": "...",
      "tags": ["..."],
      "segment": "...",
      "confidence": 0.0,
      "citations": [{ "chunkId": "...", "quote": "..." }]
    }
  ]
}

Guidelines:
- Produce 8 to 16 insights.
- Each insight must be supported by 1 to 3 citations.
- Prefer user pain, blockers, confusions, workarounds, requests, and measurable outcomes.
- If evidence conflicts, include both sides as separate insights.
${CITATION_RULES}
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt for synthesizing an opportunity brief from extracted insights.
 */
export function promptSynthesizeBrief(params: {
  question: string;
  insightsJSON: string;
  allowedChunkIds: string[];
}): string {
  const allowed = JSON.stringify(
    { allowedChunkIds: params.allowedChunkIds },
    null,
    2
  );
  return `
You are synthesizing a product opportunity brief that is STRICTLY grounded in evidence.

Question:
${params.question}

Extracted insights (already grounded):
${params.insightsJSON}

Allowed citations:
${allowed}

Return JSON with exactly this shape:
{
  "opportunityId": "opp_001",
  "title": "short title",
  "problem": { "text": "...", "citations": [ { "chunkId": "...", "quote": "..." } ] },
  "who": { "text": "...", "citations": [ ... ] },
  "proposedChange": { "text": "...", "citations": [ ... ] },
  "expectedImpact": { "metric": "activation_rate", "direction": "up", "magnitudeHint": "...", "timeframeHint": "..." },
  "confidence": "low|medium|high",
  "risks": [ { "text": "...", "citations": [ ... ] } ]
}

Rules:
- The fields problem/who/proposedChange MUST each have >=1 citation.
- All citations must use allowedChunkIds and include exact quotes.
- Keep the brief concise and specific.
${CITATION_RULES}
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt for a skeptic pass. The model should audit a brief and return
 * unsupported claims or citation misuse.
 */
export function promptSkepticCheck(params: {
  briefJSON: string;
  evidenceJSON: string;
}): string {
  return `
You are auditing a brief for unsupported claims and citation misuse.

Brief:
${params.briefJSON}

Evidence:
${params.evidenceJSON}

Return JSON:
{
  "issues": [
    {
      "path": "problem|who|proposedChange|risks[i]|...",
      "reason": "unsupported|quote_not_exact|wrong_chunk|too_vague|overreach",
      "fix": "what to change"
    }
  ]
}

Rules:
- If everything is supported, return {"issues": []}.
- Be strict. If a statement is not clearly supported by citations, flag it.
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt to generate a ContractPatchIntent from an OpportunityBrief.
 */
export function promptGeneratePatchIntent(params: {
  briefJSON: string;
}): string {
  return `
You are generating a ContractPatchIntent from an OpportunityBrief.

OpportunityBrief:
${params.briefJSON}

Return JSON:
{
  "featureKey": "activation_onboarding",
  "changes": [
    { "type": "add_event|update_form|update_operation|add_field|...", "target": "string", "detail": "string" }
  ],
  "acceptanceCriteria": ["..."]
}

Rules:
- Keep changes <= 12.
- Detail should be minimal and explicit.
- Acceptance criteria must be testable and verifiable.
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt to generate a generic spec overlay from a patch intent and
 * base spec snippet.
 */
export function promptGenerateGenericSpecOverlay(params: {
  baseSpecSnippet: string;
  patchIntentJSON: string;
}): string {
  return `
You are generating a GENERIC spec overlay patch based on PatchIntent.
You must respect the base spec snippet.

Base spec snippet (context):
${params.baseSpecSnippet}

PatchIntent:
${params.patchIntentJSON}

Return JSON:
{
  "overlay": {
    "adds": [ { "path": "dot.path", "value": {} } ],
    "updates": [ { "path": "dot.path", "value": {} } ],
    "removes": [ { "path": "dot.path" } ]
  }
}

Rules:
- Only reference paths that plausibly exist in the base spec snippet or add new ones under reasonable roots.
- Keep values small. Avoid massive blobs.
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt to generate an impact report given a patch intent, overlay and
 * optional compiler output.
 */
export function promptGenerateImpactReport(params: {
  patchIntentJSON: string;
  overlayJSON: string;
  compilerOutputText?: string;
}): string {
  return `
You are generating an Impact Report for a spec patch.

PatchIntent:
${params.patchIntentJSON}

Overlay:
${params.overlayJSON}

Compiler output (if present):
${params.compilerOutputText ?? '(none)'}

Return JSON:
{
  "reportId": "impact_001",
  "patchId": "patch_001",
  "summary": "...",
  "breaks": ["..."],
  "mustChange": ["..."],
  "risky": ["..."],
  "surfaces": {
    "api": ["..."],
    "db": ["..."],
    "ui": ["..."],
    "workflows": ["..."],
    "policy": ["..."],
    "docs": ["..."],
    "tests": ["..."]
  }
}

Rules:
- Be concrete: name what changes and why.
- If unsure, put it under "risky" not "breaks".
- Keep each item short.
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt to generate an agent-ready task pack.
 */
export function promptGenerateTaskPack(params: {
  briefJSON: string;
  patchIntentJSON: string;
  impactJSON: string;
  repoContext?: string;
}): string {
  return `
You are generating an agent-ready Task Pack to implement a product change safely.

Repo context:
${params.repoContext ?? '(none)'}

OpportunityBrief:
${params.briefJSON}

PatchIntent:
${params.patchIntentJSON}

Impact report:
${params.impactJSON}

Return JSON:
{
  "packId": "tasks_001",
  "patchId": "patch_001",
  "overview": "...",
  "tasks": [
    {
      "id": "t1",
      "title": "...",
      "surface": ["api", "db", "ui", "tests"],
      "why": "...",
      "acceptance": ["..."],
      "agentPrompt": "...",
      "dependsOn": []
    }
  ]
}

Rules:
- 6 to 12 tasks.
- Each task must have testable acceptance criteria.
- Agent prompts must be copy-paste friendly and mention expected files/surfaces.
- Include at least one tests task.
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt for generating a wireframe image using a generative API.
 */
export function promptWireframeImage(params: {
  screenName: string;
  device: 'mobile' | 'desktop';
  currentScreenSummary: string;
  proposedChanges: string[];
}): string {
  return `
Create a minimal grayscale wireframe (${params.device}) for screen: "${params.screenName}".

Style rules:
- Wireframe only, grayscale, no brand colors, no gradients
- Simple boxes, labels, and spacing
- High readability, minimal detail, like a product spec wireframe
- No decorative illustrations

Current screen summary:
${params.currentScreenSummary}

Proposed changes (must be reflected in the wireframe):
- ${params.proposedChanges.join('\n- ')}

Output: a single wireframe image that clearly shows the updated layout.
`.trim();
}

/**
 * Prompt for generating a fallback UI layout when image generation is
 * unavailable.
 */
export function promptWireframeLayoutJSON(params: {
  screenName: string;
  device: 'mobile' | 'desktop';
  proposedChanges: string[];
}): string {
  return `
You are generating a simple UI wireframe layout JSON (NOT an image).
Screen: "${params.screenName}" (${params.device})

Proposed changes:
- ${params.proposedChanges.join('\n- ')}

Return JSON:
{
  "layout": [
    { "type": "header", "label": "..." },
    { "type": "text", "label": "..." },
    { "type": "input", "label": "..." },
    { "type": "button", "label": "..." }
  ]
}

Rules:
- 8 to 18 elements.
- Must reflect proposed changes.
- Labels should be clear and specific.
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt to generate synthetic interview transcripts for testing or
 * demonstration.
 */
export function promptGenerateSyntheticInterviews(params: {
  productContext: string;
  personas: string[];
  count: number;
}): string {
  return `
Generate ${params.count} synthetic customer interview transcripts for this product context:
${params.productContext}

Personas to cover:
- ${params.personas.join('\n- ')}

Requirements:
- Each transcript 400-900 words
- Include realistic friction, objections, and competing priorities
- Include at least 6 quotable lines per transcript (short, direct)
- Include at least one conflicting opinion across the set
- Format as plain text with speaker labels (INTERVIEWER:, CUSTOMER:)

Return JSON:
{
  "items": [
    { "title": "...", "persona": "...", "segment": "...", "transcript": "..." }
  ]
}

${JSON_ONLY_RULES}
`.trim();
}
