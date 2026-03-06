import type { BenchmarkDimension } from "../types";

export interface EvalCase {
  id: string;
  prompt: string;
  expectedOutput?: string;
  /** Regex or substring that must appear in the response. */
  expectedPattern?: string;
  /** Custom grading function key (resolved at runtime). */
  graderKey?: string;
  metadata?: Record<string, unknown>;
}

export interface EvalSuite {
  key: string;
  displayName: string;
  description: string;
  dimension: BenchmarkDimension;
  cases: EvalCase[];
  /** Default grading strategy when individual cases don't specify one. */
  defaultGrader: "exact" | "contains" | "regex" | "llm-judge";
}

export interface EvalCaseResult {
  caseId: string;
  passed: boolean;
  score: number;
  response: string;
  latencyMs: number;
  error?: string;
}

export interface EvalRunResult {
  runId: string;
  evalSuiteKey: string;
  modelId: string;
  providerKey: string;
  totalCases: number;
  passedCases: number;
  averageScore: number;
  averageLatencyMs: number;
  caseResults: EvalCaseResult[];
  startedAt: Date;
  completedAt: Date;
}

/**
 * Abstraction over the LLM provider for eval execution.
 * Kept minimal to avoid coupling to a specific SDK.
 */
export interface EvalLLMAdapter {
  chat(prompt: string): Promise<{ text: string; latencyMs: number }>;
}
