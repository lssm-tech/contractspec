# Evidence Dataset Overview

This folder contains a synthetic evidence dataset designed to exercise the product‑discovery loop for a B2B SaaS application focused on onboarding and activation.  The goal of these files is to provide realistic‐looking raw input that a prototype **Cursor for Product Managers** can ingest, search, and cite when producing opportunity briefs, contract patches and impact reports.

## Contents

* `interviews/` — Eight short interview transcripts from different personas (admin, PM, security, end‑user, support, sales, engineer and founder).  Each begins with a YAML header describing metadata such as role, company size and pains.  The conversations include conflicting desires, explicit pain points and measurable outcomes.
* `tickets/` — A dump of recurring support tickets summarised in a simple format.  Each ticket records its frequency and severity, helping identify common friction points during setup.
* `public/` — A summary of discussions pulled from public sources (e.g. forums or community threads).  Only short snippets are included to avoid copyright issues.
* `analytics/` — Simplified telemetry data.  `events.csv` contains a small set of user‑level events (signup, setup steps, activation) with a `segment` field for SMB, mid‑market and enterprise users.  `funnel_summary.csv` aggregates activation funnel counts by segment over a two‑week period.
* `EXPECTED_OUTCOMES.md` — Outlines the kinds of recommendations the model should produce when asked to improve activation based on the provided evidence.  This file is useful for sanity‑checking your LLM prompts during the hackathon.

## Contradictions Matrix

The transcripts intentionally include tensions between personas to force the AI to weigh trade‑offs rather than accept all requests at face value:

| Tension | Example | Implication |
| ------- | ------- | ---------- |
| **Guidance vs. speed** | Admins ask for a guided checklist to avoid confusion, while end‑users just want to get one task done without “more steps”. | The system should propose an onboarding flow that adapts to role or segment. |
| **Configurability vs. compliance** | SMB wants easy signup with minimal friction; enterprise security insists on strict role‑based access, audit logs and no PII in telemetry. | Contract patches must include RBAC rules and privacy constraints. |
| **Short‑term revenue vs. long‑term adoption** | Sales teams care about reducing time‑to‑first‑value to close deals, whereas support teams see recurring tickets indicating deeper UX issues that need to be fixed. | Recommendations should balance quick wins with long‑term retention. |
| **Feature creep vs. focus** | Founders admit to chasing the loudest customer requests, while PMs complain there is no shared definition of “activated”. | Evidence‑backed prioritisation is crucial. |

Use this dataset to develop and test algorithms for evidence retrieval, citation generation and automated specification generation.  All contents are synthetic and do not represent real users.