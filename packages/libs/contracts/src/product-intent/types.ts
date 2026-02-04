import { z } from "zod";

/**
 * Types for the Product Intent layer
 *
 * This file defines the TypeScript interfaces and type aliases used to
 * represent the various data structures that power the "Cursor for
 * Product Managers" workflow. These definitions are intentionally kept
 * generic and free of any implementation details. Consumers of this
 * module can import these interfaces to strongly type their code
 * without pulling in runtime dependencies.
 */

/**
 * A citation ties a claim back to a specific evidence chunk. The
 * `chunkId` corresponds to a unique identifier in the evidence store
 * and `quote` must be an exact substring of the original chunk.
 */
export interface Citation {
  /**
   * Unique identifier of the evidence chunk. This identifier should
   * follow the format `${itemId}#c_${index}` where `itemId` is the
   * evidence document ID and `index` is the zero‑based chunk index.
   */
  chunkId: string;
  /**
   * Exact text quoted from the evidence chunk. The quote should not
   * exceed 240 characters to avoid copying entire paragraphs.
   */
  quote: string;
}

/**
 * An atomic insight extracted from raw evidence. Insights are the
 * building blocks used to synthesise higher‑level opportunity briefs.
 */
export interface Insight {
  /** Unique identifier for this insight. */
  insightId: string;
  /** The core claim or statement expressed by this insight. */
  claim: string;
  /** Optional tags describing the nature of the claim (e.g. "pain", "request"). */
  tags?: string[];
  /** The user or customer segment this insight pertains to. */
  segment?: string;
  /** Model‑estimated confidence score between 0 and 1. */
  confidence?: number;
  /** Citations supporting the claim. Must contain at least one citation. */
  citations: Citation[];
}

/**
 * A collection of extracted insights. This container type is useful
 * when validating extraction output from the language model.
 */
export interface InsightExtraction {
  insights: Insight[];
}

/**
 * A block of text within an opportunity brief that must be backed by
 * at least one citation. Used for the problem statement, the target
 * persona/segment description and the proposed change description.
 */
export interface CitedTextBlock {
  text: string;
  citations: Citation[];
}

/**
 * A risk entry describing a potential downside of the proposed change.
 * Citations are optional here – some risks may come from domain
 * expertise rather than direct evidence.
 */
export interface Risk {
  text: string;
  citations?: Citation[];
}

/**
 * Expected impact of a proposed change. The `metric` should map to
 * something defined in your telemetry layer. `direction` indicates
 * whether the metric should increase or decrease. Optional hints can
 * describe magnitude and timeframe expectations.
 */
export interface ExpectedImpact {
  metric: string;
  direction: "up" | "down";
  magnitudeHint?: string;
  timeframeHint?: string;
}

/**
 * Intent to modify the underlying ContractSpec. Each change entry
 * describes an operation that should be applied to the spec tree.
 */
export interface PatchChange {
  /**
   * High level type of change. See PatchChangeType for possible values.
   */
  type:
    | "add_field"
    | "remove_field"
    | "rename_field"
    | "add_event"
    | "update_event"
    | "add_operation"
    | "update_operation"
    | "update_form"
    | "update_policy"
    | "add_enum_value"
    | "remove_enum_value"
    | "other";
  /** The dotted path to the spec element being modified or created. */
  target: string;
  /**
   * Freeform detail about the change. For example, if adding a field
   * this might contain the field type and default value.
   */
  detail: string;
}

/**
 * Intent to modify ContractSpec for a given opportunity. This
 * intermediate representation is easier for language models to
 * generate than a full ContractSpec patch file. The runtime should
 * translate it into a proper patch/overlay.
 */
export interface ContractPatchIntent {
  featureKey: string;
  changes: PatchChange[];
  acceptanceCriteria: string[];
}

/**
 * The opportunity brief synthesises insights into a human‑readable
 * explanation of what should be built next and why. All key
 * statements must be supported by citations.
 */
export interface OpportunityBrief {
  opportunityId: string;
  title: string;
  problem: CitedTextBlock;
  who: CitedTextBlock;
  proposedChange: CitedTextBlock;
  expectedImpact: ExpectedImpact;
  confidence: "low" | "medium" | "high";
  risks?: Risk[];
  contractPatchIntent: ContractPatchIntent;
}

/**
 * The final patch object derived from a ContractPatchIntent. The
 * runtime should translate this into a format understood by
 * ContractSpec's compiler. This interface is intentionally open
 * ended – consumers can decide how to represent patches (e.g. JSON
 * Patch, overlay objects, etc.).
 */
export interface ContractSpecPatch {
  overlay: {
    adds?: { path: string; value: unknown }[];
    updates?: { path: string; value: unknown }[];
    removes?: { path: string }[];
  };
}

/**
 * Impact report details the consequences of applying a patch. It lists
 * what will break, what must change and what might be risky. It also
 * groups affected surfaces (API, DB, UI, workflows, policy, docs,
 * tests) for easy consumption by engineering teams.
 */
export interface ImpactReport {
  reportId: string;
  patchId: string;
  summary: string;
  breaks?: string[];
  mustChange?: string[];
  risky?: string[];
  surfaces: {
    api?: string[];
    db?: string[];
    ui?: string[];
    workflows?: string[];
    policy?: string[];
    docs?: string[];
    tests?: string[];
  };
}

/**
 * A task describes a discrete unit of work that an agent or engineer
 * must perform to implement a patch. Each task must define clear
 * acceptance criteria and optionally depend on other tasks.
 */
export interface Task {
  id: string;
  title: string;
  surface: Array<
    | "api"
    | "db"
    | "ui"
    | "workflows"
    | "policy"
    | "docs"
    | "tests"
    | "other"
  >;
  why: string;
  acceptance: string[];
  agentPrompt: string;
  dependsOn?: string[];
}

/**
 * A task pack groups tasks under a single patch. It includes an
 * overview summary describing the high level goal.
 */
export interface TaskPack {
  packId: string;
  patchId: string;
  overview: string;
  tasks: Task[];
}

/**
 * Describes the parameters for requesting a wireframe image or
 * deterministic layout. This is used by the UI module to drive
 * image generation or fallback rendering.
 */
export interface UiWireframeRequest {
  screenName: string;
  device: "mobile" | "desktop";
  currentScreenSummary: string;
  proposedChanges: string[];
}

/**
 * A fallback wireframe layout representation. The UI layer can
 * interpret this structure to render a low‑fidelity wireframe in
 * HTML/CSS when image generation is unavailable.
 */
export interface UiWireframeLayout {
  layout: Array<{
    type:
      | "header"
      | "text"
      | "input"
      | "button"
      | "list"
      | "card"
      | "divider"
      | "progress";
    label: string;
    notes?: string;
  }>;
}

/**
 * Helper type for evidence chunks. A chunk ties raw text to
 * metadata. It is defined here for convenience; the runtime should
 * implement storage and retrieval for chunks.
 */
export interface EvidenceChunk {
  chunkId: string;
  text: string;
  meta?: Record<string, unknown>;
}

// Zod schemas are exported to allow consumers to validate
// arbitrary JSON payloads against these interfaces. When building
// validators, prefer using these schemas over ad‑hoc checks. See
// packages/libs/product-intent-utils for high level validators.

export const CitationSchema = z.object({
  chunkId: z.string().min(1),
  quote: z.string().min(1).max(240),
});

export const InsightSchema = z.object({
  insightId: z.string().min(1),
  claim: z.string().min(1).max(320),
  tags: z.array(z.string().min(1)).optional(),
  segment: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  citations: z.array(CitationSchema).min(1),
});

export const InsightExtractionSchema = z.object({
  insights: z.array(InsightSchema).min(1).max(30),
});

export const CitedTextBlockSchema = z.object({
  text: z.string().min(1),
  citations: z.array(CitationSchema).min(1),
});

export const RiskSchema = z.object({
  text: z.string().min(1).max(240),
  citations: z.array(CitationSchema).optional(),
});

export const ExpectedImpactSchema = z.object({
  metric: z.string().min(1).max(64),
  direction: z.enum(["up", "down"]),
  magnitudeHint: z.string().max(64).optional(),
  timeframeHint: z.string().max(64).optional(),
});

export const PatchChangeSchema = z.object({
  type: z.enum([
    "add_field",
    "remove_field",
    "rename_field",
    "add_event",
    "update_event",
    "add_operation",
    "update_operation",
    "update_form",
    "update_policy",
    "add_enum_value",
    "remove_enum_value",
    "other",
  ]),
  target: z.string().min(1),
  detail: z.string().min(1),
});

export const ContractPatchIntentSchema = z.object({
  featureKey: z.string().min(1).max(80),
  changes: z.array(PatchChangeSchema).min(1).max(25),
  acceptanceCriteria: z.array(z.string().min(1).max(140)).min(1).max(12),
});

export const OpportunityBriefSchema = z.object({
  opportunityId: z.string().min(1),
  title: z.string().min(1).max(120),
  problem: CitedTextBlockSchema,
  who: CitedTextBlockSchema,
  proposedChange: CitedTextBlockSchema,
  expectedImpact: ExpectedImpactSchema,
  confidence: z.enum(["low", "medium", "high"]),
  risks: z.array(RiskSchema).optional(),
  contractPatchIntent: ContractPatchIntentSchema,
});

export const ContractSpecPatchSchema = z.object({
  overlay: z.object({
    adds: z.array(z.object({ path: z.string(), value: z.any() })).optional(),
    updates: z.array(z.object({ path: z.string(), value: z.any() })).optional(),
    removes: z.array(z.object({ path: z.string() })).optional(),
  }),
});

export const ImpactReportSchema = z.object({
  reportId: z.string().min(1),
  patchId: z.string().min(1),
  summary: z.string().min(1).max(200),
  breaks: z.array(z.string().min(1).max(160)).optional(),
  mustChange: z.array(z.string().min(1).max(160)).optional(),
  risky: z.array(z.string().min(1).max(160)).optional(),
  surfaces: z.object({
    api: z.array(z.string().min(1).max(140)).optional(),
    db: z.array(z.string().min(1).max(140)).optional(),
    ui: z.array(z.string().min(1).max(140)).optional(),
    workflows: z.array(z.string().min(1).max(140)).optional(),
    policy: z.array(z.string().min(1).max(140)).optional(),
    docs: z.array(z.string().min(1).max(140)).optional(),
    tests: z.array(z.string().min(1).max(140)).optional(),
  }),
});

export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  surface: z.array(
    z.enum([
      "api",
      "db",
      "ui",
      "workflows",
      "policy",
      "docs",
      "tests",
      "other",
    ])
  ).min(1),
  why: z.string().min(1).max(200),
  acceptance: z.array(z.string().min(1).max(160)).min(1).max(10),
  agentPrompt: z.string().min(1).max(1400),
  dependsOn: z.array(z.string().min(1)).optional(),
});

export const TaskPackSchema = z.object({
  packId: z.string().min(1),
  patchId: z.string().min(1),
  overview: z.string().min(1).max(240),
  tasks: z.array(TaskSchema).min(3).max(14),
});

export const UiWireframeRequestSchema = z.object({
  screenName: z.string().min(1).max(80),
  device: z.enum(["mobile", "desktop"]),
  currentScreenSummary: z.string().min(1).max(400),
  proposedChanges: z.array(z.string().min(1).max(160)).min(1).max(10),
});

export const UiWireframeLayoutSchema = z.object({
  layout: z.array(
    z.object({
      type: z.enum([
        "header",
        "text",
        "input",
        "button",
        "list",
        "card",
        "divider",
        "progress",
      ]),
      label: z.string().min(1).max(80),
      notes: z.string().max(120).optional(),
    })
  ).min(3).max(30),
});
