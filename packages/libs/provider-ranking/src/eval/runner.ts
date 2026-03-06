import type {
  EvalCase,
  EvalCaseResult,
  EvalLLMAdapter,
  EvalRunResult,
  EvalSuite,
} from "./types";

interface EvalRunnerOptions {
  maxConcurrency?: number;
}

/**
 * Executes an eval suite against an LLM adapter and produces
 * scored results that can be stored as BenchmarkResults.
 */
export class EvalRunner {
  constructor(
    private readonly adapter: EvalLLMAdapter,
    private readonly options: EvalRunnerOptions = {},
  ) {}

  async run(
    suite: EvalSuite,
    modelId: string,
    providerKey: string,
  ): Promise<EvalRunResult> {
    const runId = `eval-${suite.key}-${modelId}-${Date.now()}`;
    const startedAt = new Date();
    const concurrency = this.options.maxConcurrency ?? 5;

    const caseResults = await this.runCasesWithConcurrency(
      suite.cases,
      suite.defaultGrader,
      concurrency,
    );

    const passedCases = caseResults.filter((r) => r.passed).length;
    const averageScore =
      caseResults.length > 0
        ? caseResults.reduce((sum, r) => sum + r.score, 0) / caseResults.length
        : 0;
    const averageLatencyMs =
      caseResults.length > 0
        ? caseResults.reduce((sum, r) => sum + r.latencyMs, 0) / caseResults.length
        : 0;

    return {
      runId,
      evalSuiteKey: suite.key,
      modelId,
      providerKey,
      totalCases: suite.cases.length,
      passedCases,
      averageScore: Math.round(averageScore * 100) / 100,
      averageLatencyMs: Math.round(averageLatencyMs),
      caseResults,
      startedAt,
      completedAt: new Date(),
    };
  }

  private async runCasesWithConcurrency(
    cases: EvalCase[],
    defaultGrader: EvalSuite["defaultGrader"],
    concurrency: number,
  ): Promise<EvalCaseResult[]> {
    const results: EvalCaseResult[] = [];
    const queue = [...cases];

    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      while (queue.length > 0) {
        const evalCase = queue.shift();
        if (!evalCase) break;
        const result = await this.runSingleCase(evalCase, defaultGrader);
        results.push(result);
      }
    });

    await Promise.all(workers);
    return results;
  }

  private async runSingleCase(
    evalCase: EvalCase,
    defaultGrader: EvalSuite["defaultGrader"],
  ): Promise<EvalCaseResult> {
    try {
      const { text, latencyMs } = await this.adapter.chat(evalCase.prompt);
      const { passed, score } = this.grade(evalCase, text, defaultGrader);

      return {
        caseId: evalCase.id,
        passed,
        score,
        response: text,
        latencyMs,
      };
    } catch (error) {
      return {
        caseId: evalCase.id,
        passed: false,
        score: 0,
        response: "",
        latencyMs: 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private grade(
    evalCase: EvalCase,
    response: string,
    defaultGrader: EvalSuite["defaultGrader"],
  ): { passed: boolean; score: number } {
    const grader = evalCase.graderKey ?? defaultGrader;

    switch (grader) {
      case "exact":
        if (!evalCase.expectedOutput) return { passed: true, score: 1 };
        return {
          passed: response.trim() === evalCase.expectedOutput.trim(),
          score: response.trim() === evalCase.expectedOutput.trim() ? 1 : 0,
        };

      case "contains":
        if (!evalCase.expectedOutput) return { passed: true, score: 1 };
        return {
          passed: response.includes(evalCase.expectedOutput),
          score: response.includes(evalCase.expectedOutput) ? 1 : 0,
        };

      case "regex": {
        if (!evalCase.expectedPattern) return { passed: true, score: 1 };
        const regex = new RegExp(evalCase.expectedPattern);
        const matches = regex.test(response);
        return { passed: matches, score: matches ? 1 : 0 };
      }

      case "llm-judge":
        // LLM-as-judge requires a separate LLM call; deferred to pipeline layer
        return { passed: true, score: 0.5 };

      default:
        return { passed: true, score: 0.5 };
    }
  }
}
