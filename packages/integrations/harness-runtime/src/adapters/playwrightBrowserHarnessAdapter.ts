import type {
  HarnessExecutionAdapter,
  HarnessStepExecutionResult,
} from "../types";

interface PlaywrightLikePage {
  goto(url: string): Promise<void>;
  click(selector: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  content(): Promise<string>;
  screenshot(): Promise<Buffer>;
  title(): Promise<string>;
  close(): Promise<void>;
}

export class PlaywrightBrowserHarnessAdapter implements HarnessExecutionAdapter {
  readonly mode = "deterministic-browser" as const;

  supports(step: Parameters<HarnessExecutionAdapter["supports"]>[0]) {
    return !step.actionClass.startsWith("code-exec");
  }

  async execute(
    input: Parameters<HarnessExecutionAdapter["execute"]>[0],
  ): Promise<HarnessStepExecutionResult> {
    const playwrightModule = "playwright";
    const playwright = (await import(playwrightModule)) as {
      chromium: {
        launch(): Promise<{
          newPage(): Promise<PlaywrightLikePage>;
          close(): Promise<void>;
        }>;
      };
    };

    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    try {
      const url =
        typeof input.step.input?.url === "string"
          ? input.step.input.url
          : input.target.baseUrl;
      if (url) await page.goto(url);

      const actions = Array.isArray(input.step.input?.actions)
        ? input.step.input.actions
        : [];
      for (const action of actions as Array<Record<string, unknown>>) {
        if (action?.type === "click" && typeof action.selector === "string") {
          await page.click(action.selector);
        }
        if (
          action?.type === "fill" &&
          typeof action.selector === "string" &&
          typeof action.value === "string"
        ) {
          await page.fill(action.selector, action.value);
        }
      }

      const [title, html, screenshot] = await Promise.all([
        page.title(),
        page.content(),
        page.screenshot(),
      ]);
      return {
        status: "completed" as const,
        summary: title,
        artifacts: [
          {
            kind: "screenshot" as const,
            contentType: "image/png",
            body: screenshot,
            summary: `${input.step.key} screenshot`,
          },
          {
            kind: "dom-snapshot" as const,
            contentType: "text/html",
            body: html,
            summary: `${input.step.key} DOM snapshot`,
          },
        ],
      };
    } finally {
      await page.close();
      await browser.close();
    }
  }
}
