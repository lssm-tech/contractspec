import { resolve } from "node:path";
import process from "node:process";

type ExampleCheck = {
  name: string;
  cwd: string;
  steps: {
    label: string;
    command: string[];
  }[];
};

const repoRoot = resolve(import.meta.dir, "..");
const bunExecutable = process.execPath;
const contractspecBuildExecutable = resolve(
  repoRoot,
  "node_modules/.bin/contractspec-bun-build",
);
const tscExecutable = resolve(repoRoot, "node_modules/.bin/tsc");
const cliContractspecEntry = resolve(
  repoRoot,
  "packages/apps/cli-contractspec/src/cli.ts",
);
const agentConsoleProofScript = resolve(
  repoRoot,
  "scripts/generate-agent-console-meetup-proof.ts",
);
const messagingAgentActionsProofScript = resolve(
  repoRoot,
  "scripts/generate-messaging-agent-actions-meetup-proof.ts",
);

const curatedExamples: ExampleCheck[] = [
  {
    name: "minimal",
    cwd: resolve(repoRoot, "packages/examples/minimal"),
    steps: [
      { label: "build", command: [tscExecutable, "--project", "tsconfig.json"] },
      { label: "typecheck", command: [tscExecutable, "--noEmit"] },
      { label: "test", command: [bunExecutable, "test"] },
      { label: "smoke", command: [bunExecutable, "test", "src/example.smoke.test.ts"] },
    ],
  },
  {
    name: "opencode-cli",
    cwd: resolve(repoRoot, "packages/examples/opencode-cli"),
    steps: [
      { label: "build", command: [tscExecutable, "--project", "tsconfig.json"] },
      { label: "typecheck", command: [tscExecutable, "--noEmit"] },
      { label: "test", command: [bunExecutable, "test"] },
      { label: "smoke", command: [bunExecutable, "test", "src/example.smoke.test.ts"] },
    ],
  },
  {
    name: "agent-console",
    cwd: resolve(repoRoot, "packages/examples/agent-console"),
    steps: [
      { label: "prebuild", command: [contractspecBuildExecutable, "prebuild"] },
      { label: "build:bundle", command: [contractspecBuildExecutable, "transpile"] },
      { label: "build:types", command: [contractspecBuildExecutable, "types"] },
      { label: "typecheck", command: [tscExecutable, "--noEmit"] },
      { label: "test", command: [bunExecutable, "test"] },
      { label: "proof", command: [bunExecutable, agentConsoleProofScript] },
    ],
  },
  {
    name: "ai-chat-assistant",
    cwd: resolve(repoRoot, "packages/examples/ai-chat-assistant"),
    steps: [
      { label: "prebuild", command: [contractspecBuildExecutable, "prebuild"] },
      { label: "build:bundle", command: [contractspecBuildExecutable, "transpile"] },
      { label: "build:types", command: [contractspecBuildExecutable, "types"] },
      { label: "typecheck", command: [tscExecutable, "--noEmit"] },
      { label: "test", command: [bunExecutable, "test"] },
      { label: "smoke", command: [bunExecutable, "test", "src/example.smoke.test.ts"] },
    ],
  },
  {
    name: "messaging-agent-actions",
    cwd: resolve(repoRoot, "packages/examples/messaging-agent-actions"),
    steps: [
      { label: "prebuild", command: [contractspecBuildExecutable, "prebuild"] },
      { label: "build:bundle", command: [contractspecBuildExecutable, "transpile"] },
      { label: "build:types", command: [contractspecBuildExecutable, "types"] },
      { label: "typecheck", command: [tscExecutable, "--noEmit"] },
      { label: "test", command: [bunExecutable, "test"] },
      {
        label: "proof",
        command: [bunExecutable, messagingAgentActionsProofScript],
      },
    ],
  },
];

const requiredEnvKeys = [
  "CHANNEL_WORKSPACE_MAP_TELEGRAM",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_WEBHOOK_SECRET_TOKEN",
  "TELEGRAM_DEFAULT_CHAT_ID",
];

function info(message: string): void {
  process.stdout.write(`${message}\n`);
}

function fail(message: string): never {
  throw new Error(message);
}

async function run(command: string[], cwd: string, label: string): Promise<void> {
  info(`> ${label}`);
  const proc = Bun.spawn(command, {
    cwd,
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    fail(`${label} failed with exit code ${exitCode}`);
  }
}

async function runCuratedExampleChecks(): Promise<void> {
  for (const example of curatedExamples) {
    info(`\n# ${example.name}`);
    for (const step of example.steps) {
      await run(step.command, example.cwd, `${example.name}:${step.label}`);
    }
  }
}

function assertRequiredEnv(): void {
  const missing = requiredEnvKeys.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    fail(
      `Missing required meetup env keys: ${missing.join(", ")}. ` +
        "Set the Telegram live-demo floor before running the curated preflight.",
    );
  }
}

async function checkUrls(): Promise<void> {
  const rawUrls = process.env.MEETUP_PREFLIGHT_URLS?.trim();
  if (!rawUrls) {
    info(
      "\n# Reachability\nSkipping deployed ingress checks because MEETUP_PREFLIGHT_URLS is not set.",
    );
    return;
  }

  const urls = rawUrls
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (urls.length === 0) {
    fail("MEETUP_PREFLIGHT_URLS was provided but no usable URLs were found.");
  }

  info("\n# Reachability");
  for (const url of urls) {
    info(`> probe ${url}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
      if (!response.ok) {
        fail(`Reachability probe failed for ${url} with status ${response.status}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      fail(`Reachability probe failed for ${url}: ${message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function main(): Promise<void> {
  info("# Meetup examples preflight");
  await run(
    [bunExecutable, cliContractspecEntry, "examples", "validate", "--repo-root", "."],
    repoRoot,
    "examples:validate",
  );
  assertRequiredEnv();
  await runCuratedExampleChecks();
  await checkUrls();
  info("\nMeetup examples preflight passed.");
}

await main();
