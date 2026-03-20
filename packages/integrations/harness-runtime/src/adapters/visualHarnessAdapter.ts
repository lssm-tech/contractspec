import type {
  HarnessExecutionAdapter,
  HarnessStepExecutionInput,
  HarnessStepExecutionResult,
} from "../types";

export type VisualHarnessHandler = (
  input: HarnessStepExecutionInput,
) => Promise<HarnessStepExecutionResult>;

export class CallbackVisualHarnessAdapter implements HarnessExecutionAdapter {
  readonly mode = "visual-computer-use" as const;

  constructor(private readonly handler: VisualHarnessHandler) {}

  supports() {
    return true;
  }

  async execute(input: HarnessStepExecutionInput) {
    return this.handler(input);
  }
}
