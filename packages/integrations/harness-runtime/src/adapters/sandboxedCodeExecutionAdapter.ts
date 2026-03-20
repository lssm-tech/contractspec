import vm from "node:vm";
import type {
  HarnessExecutionAdapter,
  HarnessStepExecutionResult,
} from "../types";

export interface SandboxedCodeExecutionAdapterOptions {
  timeoutMs?: number;
}

export class SandboxedCodeExecutionAdapter implements HarnessExecutionAdapter {
  readonly mode = "code-execution" as const;
  private readonly timeoutMs: number;

  constructor(options: SandboxedCodeExecutionAdapterOptions = {}) {
    this.timeoutMs = options.timeoutMs ?? 1_000;
  }

  supports(step: Parameters<HarnessExecutionAdapter["supports"]>[0]) {
    return step.actionClass === "code-exec-read" || step.actionClass === "code-exec-mutate";
  }

  async execute(
    input: Parameters<HarnessExecutionAdapter["execute"]>[0],
  ): Promise<HarnessStepExecutionResult> {
    const script = input.step.input?.script;
    if (typeof script !== "string") {
      return {
        status: "failed" as const,
        summary: "Missing script in step input.",
      };
    }

    const sandbox = {
      input: input.step.input,
      target: input.target,
      result: undefined,
      console: { log: () => undefined },
    };
    vm.createContext(sandbox);
    vm.runInContext(`result = (() => { ${script}\n})();`, sandbox, {
      timeout: this.timeoutMs,
    });

    return {
      status: "completed" as const,
      summary: "Code execution completed.",
      output: sandbox.result,
      artifacts: [
        {
          kind: "step-summary" as const,
          contentType: "application/json",
          body: sandbox.result,
          summary: "Code execution result",
        },
      ],
    };
  }
}
