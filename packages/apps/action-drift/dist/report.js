var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};

// src/report.ts
var import_node_fs = __toESM(require("node:fs"));

// src/format-age.ts
function formatAge(isoDate, now = Date.now()) {
  if (!isoDate)
    return "Never";
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then))
    return "Never";
  const diffMs = now - then;
  if (diffMs < 0)
    return "just now";
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0)
    return `${days} day${days === 1 ? "" : "s"}`;
  if (hours > 0)
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  if (minutes > 0)
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  return "just now";
}

// src/report.ts
var MAX_DETAIL_CHARS = 60000;
var MAX_LIST_ITEMS = 20;
var args = process.argv.slice(2);
var argMap = new Map;
for (let i = 0;i < args.length; i += 1) {
  const arg = args[i];
  if (arg?.startsWith("--")) {
    const key = arg.replace(/^--/, "");
    const value = args[i + 1];
    if (value) {
      argMap.set(key, value);
    }
    i += 1;
  }
}
var dataPath = argMap.get("data") || process.env.CONTRACTSPEC_REPORT_DATA;
var outputPath = argMap.get("output") || process.env.CONTRACTSPEC_REPORT_OUTPUT || "contractspec-report.md";
var summaryPath = argMap.get("summary") || process.env.GITHUB_STEP_SUMMARY;
if (!dataPath) {
  console.error("Missing report data path. Use --data or CONTRACTSPEC_REPORT_DATA.");
  process.exit(1);
}
var readFileIfExists = (filePath) => {
  if (!filePath)
    return "";
  if (!import_node_fs.default.existsSync(filePath))
    return "";
  return import_node_fs.default.readFileSync(filePath, "utf8");
};
var truncate = (value, maxChars = MAX_DETAIL_CHARS) => {
  if (value.length <= maxChars)
    return value;
  return `${value.slice(0, maxChars)}

*(output truncated)*`;
};
var formatList = (items) => {
  if (!items || items.length === 0)
    return "- None";
  return items.slice(0, MAX_LIST_ITEMS).map((item) => `- ${item}`).join(`
`);
};
var data = JSON.parse(import_node_fs.default.readFileSync(dataPath, "utf8"));
var viewContent = truncate(readFileIfExists(data.whatChanged?.detailsPath));
var validationOutput = truncate(readFileIfExists(data.validation?.outputPath));
var driftFiles = data.drift?.files ?? [];
var lines = [];
lines.push("## ContractSpec Report");
lines.push("");
if (data.contracts && data.contracts.length > 0) {
  lines.push("### Overall verification status");
  lines.push("");
  lines.push("| Contract / Endpoint / Event | Last verified commit | Time since verified | Surfaces covered | Drift debt |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const c of data.contracts) {
    const sha = c.lastVerifiedSha ?? "—";
    const time = formatAge(c.lastVerifiedDate);
    const surfaces = c.surfaces.join(", ");
    lines.push(`| ${c.name} | ${sha} | ${time} | ${surfaces} | ${c.driftMismatches} |`);
  }
  lines.push("");
}
lines.push("### 1) What changed");
if (data.whatChanged?.summary) {
  lines.push(data.whatChanged.summary);
} else {
  lines.push("No contract changes detected.");
}
if (viewContent.trim().length > 0) {
  lines.push("");
  lines.push("<details>");
  lines.push("<summary>Contract view (product)</summary>");
  lines.push("");
  lines.push(viewContent);
  lines.push("");
  lines.push("</details>");
}
lines.push("");
lines.push("### 2) Risk classification");
if (data.risk?.status) {
  const riskSummary = [
    `Status: ${data.risk.status}`,
    data.risk.breaking !== undefined ? `Breaking: ${data.risk.breaking}` : null,
    data.risk.nonBreaking !== undefined ? `Non-breaking: ${data.risk.nonBreaking}` : null
  ].filter(Boolean);
  lines.push(riskSummary.join(" | "));
} else {
  lines.push("Impact analysis unavailable.");
}
lines.push("");
lines.push("### 3) Validation results");
if (data.validation?.status) {
  lines.push(`Status: ${data.validation.status}`);
  if (validationOutput.trim().length > 0) {
    lines.push("");
    lines.push("<details>");
    lines.push("<summary>Validation output</summary>");
    lines.push("");
    lines.push(validationOutput);
    lines.push("");
    lines.push("</details>");
  }
} else {
  lines.push("Validation step not run.");
}
lines.push("");
lines.push("### 4) Drift results");
if (data.drift?.status) {
  lines.push(`Status: ${data.drift.status}`);
  if (driftFiles.length > 0) {
    lines.push("");
    lines.push("<details>");
    lines.push("<summary>Drifted files</summary>");
    lines.push("");
    lines.push(formatList(driftFiles));
    lines.push("");
    lines.push("</details>");
  }
} else {
  lines.push("Drift check not run.");
}
lines.push("");
lines.push("### 5) Next steps");
if (data.nextSteps && data.nextSteps.length > 0) {
  lines.push(formatList(data.nextSteps));
} else {
  lines.push("- No action required.");
}
var report = `${lines.join(`
`)}
`;
import_node_fs.default.writeFileSync(outputPath, report, "utf8");
if (summaryPath) {
  import_node_fs.default.appendFileSync(summaryPath, report, "utf8");
}
