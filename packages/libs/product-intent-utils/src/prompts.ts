// Import EvidenceChunk from the product-intent types. We avoid relying on
// TypeScript path aliases here by using a relative path to the
// contracts package. This ensures the utils library can be consumed
// directly without custom module resolution.
import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';

/**
 * Prompt construction helpers for the product intent workflow.
 *
 * Each function returns a string to be used as the system/user
 * messages in a language model call. All prompts enforce JSON-only
 * output and, where appropriate, strict citation requirements.
 */

/**
 * Format evidence chunks as a JSON string suitable for embedding in
 * prompts. Long texts are truncated to a configurable maximum number
 * of characters. Metadata is included to aid the model in
 * reasoning about segment, persona and other attributes.
 */
export function formatEvidenceForModel(
  chunks: EvidenceChunk[],
  maxChars = 900
): string {
  const safe = chunks.map((c) => ({
    chunk_id: c.chunkId,
    text: c.text.length > maxChars ? `${c.text.slice(0, maxChars)}…` : c.text,
    meta: c.meta ?? {},
  }));
  return JSON.stringify({ evidence_chunks: safe }, null, 2);
}

/**
 * Rules that instruct the model to output only JSON. Used across
 * multiple prompts to ensure consistent output format.
 */
export const JSON_ONLY_RULES = `
You MUST output valid JSON ONLY.
- Do not wrap in markdown fences.
- Do not include any commentary.
- Do not include trailing commas.
- Use double quotes for all keys and string values.
`;

/**
 * Citation rules used in prompts that require citations. Remind the
 * model that it may only cite from provided evidence chunks and must
 * provide exact quotes.
 */
export const CITATION_RULES = `
CITATION RULES (strict):
- You may ONLY cite from the provided evidence_chunks.
- Each citation must include:
  - "chunk_id": exactly one of the provided chunk_id values
  - "quote": an exact substring copied from that chunk's text
- Do NOT invent quotes.
- Keep quotes short (<= 240 chars).
- If you cannot support a claim with evidence, do not make the claim.
`;

/**
 * Construct a prompt for extracting atomic, evidence‑grounded insights
 * from a set of retrieved evidence chunks.
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
      "insight_id": "ins_001",
      "claim": "...",
      "tags": ["..."],
      "segment": "...",
      "confidence": 0.0-1.0,
      "citations": [{ "chunk_id": "...", "quote": "..." }]
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
 * Construct a prompt for synthesising an opportunity brief from
 * extracted insights. Requires the model to reference allowed
 * chunk IDs for citations.
 */
export function promptSynthesizeBrief(params: {
  question: string;
  insightsJSON: string;
  allowedChunkIds: string[];
}): string {
  const allowed = JSON.stringify(
    { allowed_chunk_ids: params.allowedChunkIds },
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
  "opportunity_id": "opp_001",
  "title": "short title",
  "problem": { "text": "...", "citations": [ { "chunk_id": "...", "quote": "..." } ] },
  "who": { "text": "...", "citations": [ ... ] },
  "proposed_change": { "text": "...", "citations": [ ... ] },
  "expected_impact": { "metric": "activation_rate", "direction": "up", "magnitude_hint": "...", "timeframe_hint": "..." },
  "confidence": "low|medium|high",
  "risks": [ { "text": "...", "citations": [ ... ] } ],
  "contract_patch_intent": {
    "feature_key": "snake_case_key",
    "changes": [
      { "type": "add_event|update_form|update_operation|add_field|...", "target": "string", "detail": "string" }
    ],
    "acceptance_criteria": ["..."]
  }
}

Rules:
- The fields problem/who/proposed_change MUST each have >=1 citation.
- All citations must use allowed_chunk_ids and include exact quotes.
- Contract changes must be minimal and coherent (no “rewrite the whole app” nonsense).
- Acceptance criteria must be testable/verifiable.
${CITATION_RULES}
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt for a sceptic pass. The model should audit a brief and return
 * any unsupported claims or misuse of citations.
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
      "path": "problem|who|proposed_change|risks[i]|contract_patch_intent.changes[j]|...",
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
 * Prompt to generate a PatchIntent from an OpportunityBrief. The
 * model must output JSON matching the PatchIntent interface defined
 * in the product-intent types.
 */
export function promptGeneratePatchIntent(params: {
  briefJSON: string;
}): string {
  return `
You are generating a PatchIntent from an OpportunityBrief.

OpportunityBrief:
${params.briefJSON}

Return JSON:
{
  "patch_id": "patch_001",
  "based_on_opportunity_id": "opp_001",
  "summary": "1 sentence",
  "changes": [
    { "type": "add_event|update_form|add_field|...", "target": "...", "spec_path_hint": "...", "payload": { } }
  ],
  "telemetry": {
    "events": [ { "name": "...", "props": ["..."] } ],
    "success_metric": { "name": "...", "definition": "..." }
  }
}

Rules:
- Keep changes <= 12.
- payload should be minimal and explicit.
- Include telemetry events if useful for measuring success.
${JSON_ONLY_RULES}
`.trim();
}

/**
 * Prompt to generate a generic spec overlay from a PatchIntent and
 * base spec snippet. This overlay representation is independent of
 * ContractSpec's internal format and can later be translated into
 * a proper patch.
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
 * optional compiler output. The model should output JSON matching
 * ImpactReport.
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
  "report_id": "impact_001",
  "patch_id": "patch_001",
  "summary": "...",
  "breaks": ["..."],
  "must_change": ["..."],
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
 * Prompt to generate an agent‑ready task pack. The model must list
 * 6–12 discrete tasks with acceptance criteria and agent prompts.
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
  "pack_id": "tasks_001",
  "patch_id": "patch_001",
  "overview": "...",
  "tasks": [
    {
      "id": "t1",
      "title": "...",
      "surface": ["api","db","ui","tests"],
      "why": "...",
      "acceptance": ["..."],
      "agent_prompt": "...",
      "depends_on": []
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
 * Prompt for generating a wireframe image using a generative API. The
 * model should output a concise description instructing the image
 * generator to create a grayscale wireframe. This function returns
 * plain text (not JSON) because image generation APIs often take
 * freeform prompts.
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
 * unavailable. The model must output JSON describing a list of
 * elements with types and labels. See UiWireframeLayoutSchema for the
 * expected shape.
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
 * demonstration. Returns JSON with a list of interview items. Each
 * transcript includes speaker labels and at least six quotable lines.
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
