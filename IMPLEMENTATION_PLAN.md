# PRD: Enhanced ContractSpec Impact Report Table

## 1. Overview

This Product Requirement Document (PRD) proposes the introduction of a **contract‑level verification table** into the ContractSpec impact report.  The current report summarises contract changes, risk classifications, validation results, drift results and next steps【936750595225037†L92-L166】.  It does not provide a consolidated view of the health of individual contracts.  To give stakeholders immediate visibility into the status of each contract, we will add a table that lists every contract, when it was last verified, how long ago that was, which surfaces are covered, and the current number of drift mismatches (drift debt).

## 2. Goal / Problem Statement

* **Primary goal:** Provide a concise, actionable summary of each contract’s verification status in the ContractSpec report.  This should enable product owners, engineers and stakeholders to quickly identify contracts that are drifting, not fully covered or not recently verified.
* **Problem:** Today’s impact reports require readers to interpret risk classifications and lists of drifted files.  Non‑technical stakeholders may struggle to understand whether a contract is healthy or not.  Engineering managers cannot easily prioritise remediation work across dozens of contracts.  Without a high‑level overview, contracts with growing drift debt may go unnoticed until they cause production issues.

## 3. Motivation / Business Rationale

ContractSpec’s mission is to **stabilise AI‑generated code** by ensuring that specifications remain the single source of truth.  As AI code generation accelerates, drift between specs and implementations accumulates.  Customers and prospects need clear evidence that ContractSpec can surface drift and enforce consistency.  A contract‑level verification table will:

1. **Highlight coverage gaps.**  By listing which surfaces (API, runtime validation, UI form, docs/examples, permissions) are generated for each contract, the report will show whether teams are fully leveraging ContractSpec or only partially adopting it.
2. **Expose stale verifications.**  Tracking the last verified commit and time since verification reveals contracts that have not passed validation in weeks or months.  This encourages teams to update or regenerate specs more frequently.
3. **Quantify drift debt.**  Summarising the number of mismatches per contract provides a simple metric to prioritise work.  Contracts with high drift debt become immediate candidates for remediation.
4. **Drive adoption.**  Executives and investors evaluating ContractSpec will see at a glance which parts of their system are governed by specs and how effectively drift is managed.  A compelling table can make the value proposition obvious (“we need this”).

## 4. Stakeholders

* **Founders and CTOs:** Need to communicate the stability of AI‑generated systems to investors and customers.
* **Product owners / PMs:** Require high‑level overviews to prioritise features, maintenance and technical debt.
* **Engineering teams:** Use the report to understand which contracts need attention, where drift is occurring, and which surfaces are missing.
* **Quality / Compliance:** May rely on verification history to ensure that regulated surfaces (e.g. API endpoints) have not drifted.

## 5. Scope and Functional Requirements

### 5.1 In‑scope

1. **Table generation:** The report must include a Markdown table with the following columns:
  - **Contract / endpoint / event name:** The fully qualified name (e.g. `user.create`, `order.updated`).
  - **Last verified commit:** The short SHA of the most recent commit on the default branch where all generated artifacts for that contract matched the spec.
  - **Time since verified:** A human‑friendly elapsed time (e.g. “23 days”) calculated from the `lastVerifiedDate` to the report generation time.  If a contract has never been verified, display “Never”.
  - **Surfaces covered:** A comma‑separated list of surfaces generated and validated for the contract (API schema, runtime validation, UI form, docs/examples, permissions).
  - **Drift debt:** The number of mismatches currently detected for that contract.

2. **Data collection:** Extend the CI and CLI tooling to collect per‑contract verification data (contract names, surfaces covered, last verified commit and date, mismatches).

3. **Report integration:** Modify the existing report scripts to read the new `contracts` array from the JSON report file and render the table in the output.  The table should appear near the top of the report, after the title and before the “What changed” section.

4. **Backward compatibility:** If the `contracts` array is absent (e.g. older CI runs), the report generator must still produce the existing sections without errors.

5. **Testing:** Add unit and integration tests for the new data collection, JSON schema and report rendering.

### 5.2 Out of scope

* Persisting verification history to an external database or service beyond storing it in a repository file or artifact.  Advanced stateful storage may be considered later but is not part of this release.
* Generating or updating contract specs themselves.  The feature only surfaces status; it does not generate new specifications.
* Automatically fixing drift or regenerating artifacts.  Remediation remains manual.

## 6. Non‑Functional Requirements & Constraints

1. **Performance:** The additional data collection must not significantly increase CI runtimes.  Per‑contract scanning should operate in linear time with respect to the number of contracts.  Limit the number of API calls to GitHub (e.g. by caching results).
2. **Compatibility:** The Markdown table must render correctly in GitHub PR comments and the GitHub Actions “step summary”.  Avoid long sentences in the table cells; keep cell content to short phrases.
3. **Maintainability:** New code should be well‑tested and documented.  The data model should be flexible enough to add more surfaces or metrics in the future.
4. **Security:** Do not expose sensitive information such as full commit messages, author names or private endpoints.  Only show the short commit SHA and dates.
5. **Configuration:** If a project defines custom surfaces beyond the five listed, the system should support extending the list via configuration, but this is optional for the first iteration.

## 7. Assumptions & Dependencies

* The project uses GitHub as its primary source control system and runs CI via GitHub Actions.  Commit statuses are available via the GitHub API.
* Each contract resides in a dedicated file under a known directory (e.g. `src/contracts`), and there is a way to extract the contract’s name and metadata using existing libraries.
* The drift check already produces or can produce a list of mismatches per contract.  If it currently outputs mismatches per file only, changes will be needed to map mismatches back to contracts.
* The last verified commit for a contract can be determined either by storing state in the repository (e.g. a `.contractspec/verified.json` file) or by inferring it from commit statuses.  The implementation plan explores both options.

## 8. Success Metrics / KPIs

* **Coverage visibility:** Percentage of contracts with full surface coverage reported.
* **Time‑to‑awareness:** Reduction in average time between a drift occurring and the team noticing it (as measured via PR comments or Slack notifications).
* **Drift reduction:** Downward trend in total drift mismatches across all contracts after the feature’s adoption.
* **Stakeholder satisfaction:** Qualitative feedback from product owners and founders indicating that the report is easier to understand and more actionable.

## 9. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Complexity of data collection** | Gathering per‑contract data (especially last verified commit) could require non‑trivial changes to the CLI and CI workflows. | Start by leveraging existing drift check outputs; if necessary, store state in a simple JSON file in the repository to avoid complex lookups. |
| **Performance overhead** | Scanning all contracts and making API calls could slow down CI. | Cache results, only process changed contracts on PR runs, and parallelise scanning where possible. |
| **Inaccurate metrics** | If the mapping between mismatches and contracts is imperfect, drift debt counts may be misleading. | Add validation tests and cross‑check with manual calculations during rollout; document any known limitations. |
| **UI clutter** | A large number of contracts could result in a long table. | Provide the ability to collapse or paginate the table (e.g. limit to top N by drift debt) or include a summary at the top. |
| **Backward compatibility** | Existing users without the new `contracts` data might experience failures. | Make the new field optional and provide defaults; ensure report generation still succeeds when data is missing. |

## 10. Timeline & Milestones (suggested)

1. **Week 1:** Design data model; create `ContractVerificationStatus` interface; implement JSON schema changes; write unit tests.
2. **Week 2:** Extend CLI to scan contracts and determine surfaces; integrate drift mismatch counts per contract; produce the `contracts` array in the JSON report.
3. **Week 3:** Implement logic to record last verified commit; either via `.contractspec/verified.json` or by parsing commit statuses; compute time since verification.
4. **Week 4:** Update report scripts to render the table; update GitHub workflows; write integration tests; prepare documentation and examples.
5. **Week 5:** Conduct internal testing on sample projects; gather feedback; refine UI/UX of the report; finalise release.

## 11. Open Questions

* What is the definitive source for the last verified commit?  Should we commit a state file back to the repo or rely on GitHub statuses and artifacts?  This will determine part of the implementation complexity.
* How should we handle contracts that are deleted or renamed?  Should their verification history be preserved, or can it be purged?
* Do we need to provide configuration options (e.g. to exclude certain surfaces) in the first iteration?
* How will the table scale for repositories with hundreds of contracts?  Should we group by domain or provide filters?

## 12. Detailed Implementation Plan

The following plan outlines the concrete steps required to implement the feature.  It expands upon the high‑level summary above and serves as a guide for engineering.  It is intentionally verbose to ensure no ambiguity.

### 12.1 Extend the data model

1. Define a new `ContractVerificationStatus` interface with fields:
  * `name: string` – Contract/event name.
  * `lastVerifiedSha?: string` – Short SHA of the last commit where validation succeeded.
  * `lastVerifiedDate?: string` – ISO date/time of the last verification.
  * `surfaces: string[]` – List of surfaces covered.
  * `driftMismatches: number` – Count of mismatches for this contract.
2. Update the existing `ReportData` interface to include an optional `contracts?: ContractVerificationStatus[]` property.
3. Update any JSON schema or type definitions used in the CLI and report scripts accordingly.

### 12.2 Collect per‑contract data

1. **Identify contracts** – Use the existing specification loader to enumerate all contracts within the project.  Extract their fully qualified names from the `meta.name` property (e.g. `user.create`).
2. **Determine surfaces covered** – Inspect each contract specification:
  - API schema and runtime validation are present when `io.input` or `io.output` is defined.
  - UI form is present when the spec defines a UI form or if the generator produces a React form for this spec.
  - Docs/examples are present if the spec includes examples, descriptions or documentation annotations.
  - Permissions are present when a `policy` is defined.
    Document these heuristics so that future developers can modify or extend them.
3. **Calculate drift mismatches:** Modify the drift detector to produce per‑contract mismatch counts.  When a mismatch between a generated artifact and the spec is detected, associate it with the contract that produced the artifact.  At the end of the drift check, aggregate mismatches per contract and write them into the `contracts` array.
4. **Record last verified commit:** Choose an approach to persist per‑contract verification history:
  - **Option A:** After every successful drift check, write a `.contractspec/verified.json` file that maps contract names to the current commit SHA and date.  Include this file in the repository or in a dedicated branch.  During report generation, read this file to find `lastVerifiedSha` and `lastVerifiedDate`.
  - **Option B:** Parse recent commits via the GitHub API using `get_commit_combined_status` to find the last commit where the `ContractSpec Drift` job succeeded for a given contract.  This avoids storing files but may require multiple API calls per contract.  Cache results to minimise overhead.
5. **Compute time since verified:** When generating the report, compute the difference between `lastVerifiedDate` and the current timestamp in days (round down to the nearest integer).  If no verification exists, leave the date undefined and display “Never” in the report.
6. **Populate the `contracts` array:** Assemble an array of `ContractVerificationStatus` objects with all fields populated.  Write this array into the JSON report file alongside the existing fields.

### 12.3 Update report generation scripts

1. Modify the report scripts in `packages/apps/action-pr/src/report.ts` and `packages/apps/action-drift/src/report.ts` to read `contracts` from the parsed `ReportData` object.
2. If `contracts` is defined and non‑empty, construct a Markdown table.  Example pseudocode:

   ```ts
   if (data.contracts && data.contracts.length > 0) {
     lines.push('### Overall verification status');
     lines.push('');
     lines.push('| Contract / Endpoint / Event | Last verified commit | Time since verified | Surfaces covered | Drift debt |');
     lines.push('| --- | --- | --- | --- | --- |');
     for (const c of data.contracts) {
       const sha = c.lastVerifiedSha ?? '—';
       const time = c.lastVerifiedDate ? calculateAge(c.lastVerifiedDate) : 'Never';
       const surfaces = c.surfaces.join(', ');
       lines.push(`| ${c.name} | ${sha} | ${time} | ${surfaces} | ${c.driftMismatches} |`);
     }
     lines.push('');
   }
   ```
3. Insert this block near the top of the report, after the heading and before the existing sections.  If `contracts` is missing, skip the table and produce the old report.
4. Ensure the helper functions such as `truncate` and `formatList` are reused where appropriate and adjust maximum line lengths to avoid truncation within the table.
5. Append the final table along with the existing sections (What changed, Risk classification, etc.) and write to the output file.

### 12.4 Update CI workflows and CLI commands

1. Modify the GitHub Action workflows for PR and drift checks to pass the expanded JSON report file to the report script via the `--data` argument.
2. In the PR workflow, ensure that per‑contract data is collected only for contracts changed in the pull request to save time.  In the drift workflow (main branch), collect data for all contracts.
3. Add a step to write or update `.contractspec/verified.json` (if Option A is chosen) after the drift check completes successfully.

### 12.5 Documentation and examples

1. Update the ContractSpec documentation to describe the new table, each column’s meaning, and how to interpret the data.  Emphasise that “Last verified commit” and “Time since verified” reflect the last drift‑free state and that high drift debt values indicate growing technical debt.
2. Provide before/after screenshots of the report.  Include sample projects illustrating how the table appears with multiple contracts and various surface combinations.
3. Describe how to configure surfaces or extend the list if custom surfaces are used.

### 12.6 Testing and validation

1. **Unit tests:**
  - Test JSON schema modifications for backwards compatibility.
  - Test the logic that determines surfaces and counts mismatches.
  - Test the age calculation and formatting of table cells.
2. **Integration tests:**
  - Simulate a repository with multiple contracts and different verification histories.  Verify that the generated JSON report contains correct `contracts` data and that the final report includes the table.
  - Ensure that the report generation script behaves correctly when `contracts` is undefined or empty.
3. **Performance tests:**
  - Run the updated CLI against a large project to ensure that the additional scanning and API calls do not significantly degrade CI performance.

## 13. Conclusion

By adding a contract‑level verification table to the impact report, ContractSpec will provide stakeholders with an at‑a‑glance overview of system health.  The table aligns with business goals (stabilise AI‑generated code, reduce drift) and offers clear metrics that non‑technical stakeholders can understand.  The detailed implementation plan above outlines how to integrate this feature into the existing codebase, preserve backwards compatibility, and deliver a compelling improvement to the user experience.