Tu es un agent de coding autonome travaillant dans le repo ContractSpec :
https://github.com/lssm-tech/contractspec

MISSION GLOBALE
===============

Créer un nouvel example/template ContractSpec public, propre, testable et démontrable, nommé :

`finance-ops-ai-workflows`

Package npm attendu :

`@contractspec/example.finance-ops-ai-workflows`

Ce template doit servir à la fois :
1. d’example ContractSpec crédible pour le repo ;
2. de démo produit/métier utilisable dans un contexte commercial réel avec NDconsulting / Desliance ;
3. de preuve que l’on peut transformer l’IA en workflows métiers contractualisés, sûrs, traçables et testables ;
4. de base future pour une offre client autour de finance ops, DAF, reporting, cash management, procédures internes, adoption IA et ROI.

Ce n’est PAS une app gadget.
Ce n’est PAS un chatbot générique.
Ce n’est PAS une simple collection de prompts.
Ce n’est PAS un SaaS complet.
Ce n’est PAS une intégration réelle avec OpenAI, Outlook, Gmail, Power BI, ERP, CRM ou données client.

Le but est de livrer un template ContractSpec clair qui montre :

entrée métier
→ contrat explicite
→ handler déterministe
→ workflow IA simulé et encadré
→ validation humaine
→ sortie exploitable
→ logs ROI / adoption
→ tests
→ docs
→ potentiel de démo commerciale

CONTEXTE BUSINESS / DEAL
========================

Ce template est construit pour préparer un deal potentiel avec NDconsulting et Desliance.

NDconsulting est un cabinet orienté management de transition, direction administrative et financière, contrôle de gestion, informatique décisionnelle, opérations financières et trésorerie, gestion administrative, formation/coaching, reporting, business plan, procédures internes, outils de pilotage, levées de fonds, subventions, cash management et audit.

Desliance est la marque / offre orientée excellence opérationnelle en direction financière, avec un focus sur :
- optimisation de la fonction finance ;
- amélioration des processus financiers ;
- structuration de la fonction finance ;
- facilitation de la prise de décision ;
- transformation des outils informatiques ;
- reporting financier ;
- business plan ;
- procédures internes ;
- outils de pilotage ;
- cash management ;
- levées de fonds et subventions ;
- audit.

Le template doit donc démontrer des workflows IA qui collent à ces enjeux.

L’objectif commercial implicite est de pouvoir dire à la dirigeante :

“Je ne vous montre pas des prompts isolés. Je vous montre comment transformer vos métiers finance, DAF, cash, reporting, procédures et adoption IA en workflows ContractSpec : contrats explicites, règles déterministes, validation humaine, traçabilité, ROI et possibilité d’industrialisation.”

POSITIONNEMENT PRODUIT
======================

Le template doit avoir une narration produit forte :

Titre :
Finance Ops AI Workflows

Promesse :
A ContractSpec template for safe, deterministic, human-reviewed AI-assisted finance operations workflows.

Description courte :
Finance ops AI workflow example with mission intake triage, cash aging prioritization, procedure drafting, reporting narrative, human review, and AI adoption ROI logging.

Positionnement :
Ce template montre comment encadrer des workflows IA dans des fonctions finance sans déléguer de décisions sensibles à un LLM.

Principes :
- contracts first ;
- deterministic first ;
- human-in-the-loop ;
- no autonomous financial decision ;
- no autonomous email sending ;
- no real data ;
- no external API ;
- no hidden LLM dependency ;
- reviewable outputs ;
- replayable examples ;
- measurable ROI ;
- safe adoption path.

DIFFÉRENCE ENTRE PROMPT, WORKFLOW, AGENT ET TEMPLATE
====================================================

Le template doit rendre explicite cette progression :

Prompt :
Une demande ponctuelle à une IA. Utile mais non gouvernée.

Workflow :
Une chaîne structurée avec input, règles, traitement, output, validation et log.

Agent encadré :
Une IA simulée ou future qui opère uniquement dans des contrats, outils allowlistés et règles de validation.

ContractSpec template :
Une preuve reproductible : les opérations sont explicites, les handlers testables, les sorties reviewables, la gouvernance vérifiable.

Le template doit montrer que la valeur n’est pas “faire parler un LLM”.
La valeur est :
- cadrer le métier ;
- expliciter les opérations ;
- séparer calcul déterministe et génération assistée ;
- empêcher les décisions autonomes ;
- mesurer les gains ;
- créer un système que l’on peut industrialiser.

RÈGLES CONTRACTSPEC À RESPECTER
===============================

Avant tout code :
1. Lire `AGENTS.md`.
2. Lire le nearest package `AGENTS.md` si présent dans `packages/examples` ou package similaire.
3. Inspecter les examples existants :
    - `packages/examples/minimal`
    - `packages/examples/messaging-agent-actions`
    - si utile : `packages/examples/policy-safe-knowledge-assistant`
    - si utile : `packages/examples/kb-update-pipeline`
    - si utile : `packages/examples/agent-console`
4. Identifier les conventions exactes :
    - structure package ;
    - package.json ;
    - exports ;
    - scripts ;
    - tsconfig ;
    - contracts ;
    - handlers ;
    - docs/docblocks ;
    - feature file ;
    - example metadata ;
    - smoke tests ;
    - registry/template integration éventuelle.
5. Ne pas inventer une architecture si un pattern local existe.

Contraintes globales :
- TypeScript strict.
- Pas de `any`.
- Types explicites.
- Utiliser des type guards si nécessaire.
- 2 spaces.
- Semicolons.
- Double quotes.
- Files idéalement sous 250 lignes si possible, sauf contrainte locale différente.
- Ne pas modifier de fichiers générés sauf si les conventions du repo l’exigent.
- Ne pas faire d’appel API externe.
- Ne pas installer de dépendances inutiles.
- Ne pas introduire React/UI sauf si un pattern template spécifique l’exige clairement.
- Ne pas créer de base de données.
- Ne pas créer de serveur.
- Ne pas envoyer d’emails.
- Ne pas appeler OpenAI ou un LLM.
- Ne pas utiliser de vraie donnée personnelle.
- Ne pas donner de conseil financier, fiscal ou juridique définitif.

Si ContractSpec Connect est disponible :
- utiliser le workflow Connect avant les edits risqués ;
- produire ou respecter les context/plan/verdict artifacts si le repo le permet ;
- sinon continuer avec un plan clair et reviewable.

BOUCLE RALPH / MODE AUTONOME
============================

Tu opères en boucle jusqu’à atteindre les critères de réussite.

À chaque itération :
1. Inspecte les fichiers pertinents.
2. Mets à jour le plan.
3. Implémente le plus petit lot cohérent.
4. Lance les validations ciblées.
5. Corrige les erreurs locales.
6. Ne modifie pas le reste du repo inutilement.
7. Stoppe quand les tests/typecheck/smoke/preflight ciblés passent ou quand un blocage externe est clairement documenté.

Ne demande pas de confirmation sauf blocage bloquant réel.
Si une ambiguïté existe, choisis l’option la plus proche des patterns existants.
Si une commande échoue à cause d’un problème global du repo non lié au nouveau package, documente-le et continue avec des validations ciblées.

OBJECTIF D’IMPLÉMENTATION
=========================

Créer :

`packages/examples/finance-ops-ai-workflows`

Structure cible recommandée :

package root :
- `package.json`
- `tsconfig.json`
- `README.md`

src :
- `src/index.ts`
- `src/example.ts`
- `src/finance-ops-ai-workflows.feature.ts`

contracts :
- `src/contracts/index.ts`
- `src/contracts/mission-intake-triage.operation.ts`
- `src/contracts/cash-aging-prioritization.operation.ts`
- `src/contracts/procedure-draft.operation.ts`
- `src/contracts/reporting-narrative.operation.ts`
- `src/contracts/adoption-roi-log.operation.ts`

handlers :
- `src/handlers/index.ts`
- `src/handlers/finance-ops-ai-workflows.handlers.ts`

fixtures :
- `src/fixtures/index.ts`
- `src/fixtures/mission-intake.fixture.ts`
- `src/fixtures/cash-aging.fixture.ts`
- `src/fixtures/procedure-notes.fixture.ts`
- `src/fixtures/reporting-snapshot.fixture.ts`
- `src/fixtures/adoption-usage.fixture.ts`

docs :
- `src/docs/index.ts`
- `src/docs/finance-ops-ai-workflows.docblock.ts`
- `src/docs/demo-script-ndconsulting.md` if markdown docs are used in existing packages, otherwise include equivalent in README/docblock.

tests :
- `src/example.smoke.test.ts`
- `src/handlers/finance-ops-ai-workflows.handlers.test.ts`
- `src/contracts/finance-ops-ai-workflows.contracts.test.ts` if contract tests are common locally.

optional proof, only if pattern is clear and lightweight :
- `src/proof/finance-ops-ai-workflows-proof.ts`
- `src/proof/index.ts`

Do not create every file blindly if the local package pattern is simpler.
But do create enough structure for the template to be useful, importable, testable and understandable.

PACKAGE METADATA
================

Package name :
`@contractspec/example.finance-ops-ai-workflows`

Description :
`Finance ops AI workflow example with mission intake triage, cash aging prioritization, procedure drafting, reporting narrative, human review, and AI adoption ROI logging.`

Repository directory :
`packages/examples/finance-ops-ai-workflows`

Version :
Use the version convention of nearby examples. If examples use fixed current package versions, match the appropriate pattern. Do not invent a weird version.

Scripts :
Follow the closest example pattern. Likely include :
- `build`
- `typecheck`
- `test`
- `smoke`
- `preflight`
- `validate` if contract validation pattern exists
- `clean` only if comparable examples have it
- no unnecessary publish scripts unless the comparable template package requires them.

Dependencies :
Likely :
- `@contractspec/lib.contracts-spec`
- `@contractspec/lib.schema`

Dev dependencies :
Follow nearby examples. Likely :
- `@contractspec/tool.typescript`
- `@contractspec/tool.bun` if build tooling requires it
- `typescript`

Exports :
Include at least :
- `.`
- `./contracts`
- each operation contract if local pattern supports it
- `./handlers`
- `./docs`
- `./example`
- `./finance-ops-ai-workflows.feature`
- `./fixtures` if fixtures are exportable
- `./proof/...` only if proof exists

Do not over-copy huge publishConfig blocks unless the local example package clearly requires them.

EXAMPLE METADATA
================

Create `src/example.ts` using local `defineExample` pattern.

Expected metadata :

key :
`finance-ops-ai-workflows`

version :
`1.0.0`

title :
`Finance Ops AI Workflows`

description :
`Safe finance operations AI workflow example with mission intake triage, cash prioritization, procedure drafting, reporting narrative, human review, and adoption ROI logging.`

kind :
`template`

visibility :
`public`

stability :
`beta`

owners :
`["@platform.finance-ops"]`

tags :
- `package`
- `examples`
- `finance`
- `finance-ops`
- `workflow`
- `agents`
- `human-review`
- `cash-management`
- `reporting`
- `adoption`
- `roi`

surfaces :
Follow pattern from `messaging-agent-actions`.

Preferred :
- templates enabled
- sandbox enabled with modes matching local examples, likely `playground` and `specs`
- studio disabled unless template pattern says otherwise
- mcp disabled unless template pattern says otherwise

entrypoints :
- packageName: `@contractspec/example.finance-ops-ai-workflows`

FEATURE METADATA
================

Create `src/finance-ops-ai-workflows.feature.ts` using local `defineFeature` pattern.

Feature key :
`finance-ops-ai-workflows`

Title :
`Finance Ops AI Workflows`

Description :
`Contracted finance operations workflows for mission intake, cash prioritization, procedure drafting, reporting narrative, human review, and AI adoption ROI tracking.`

Domain :
`finance-ops`

Owners :
`["@platform.finance-ops"]`

Tags :
- `finance`
- `workflow`
- `agents`
- `human-review`
- `cash-management`
- `reporting`
- `procedure`
- `adoption`
- `roi`

Stability :
`beta`

Operations :
- `financeOps.missionIntake.triage`
- `financeOps.cashAging.prioritize`
- `financeOps.procedureDraft.create`
- `financeOps.reportingNarrative.compose`
- `financeOps.aiAdoption.logUsage`

Docs :
Add doc references if local feature pattern uses docs IDs.

CONTRACTS / OPERATIONS
======================

Implement operations contract-first.

Use `defineCommand`, `defineSchemaModel` and `ScalarTypeEnum` according to local patterns.
Inspect available scalar types before choosing. If `Boolean`, `Number`, `Integer`, `Float`, `Date`, `DateTime`, `Json` are not supported or not commonly used, use `String_unsecure()` with explicit string contracts and parse in handlers.
Avoid `any`.
Avoid ambiguous schemas.

OPERATION 1
-----------

File :
`src/contracts/mission-intake-triage.operation.ts`

Operation key :
`financeOps.missionIntake.triage`

Title :
`Triage Finance Mission Intake`

Goal :
Turn a fictive client intake brief into a reviewable DAF / finance transformation mission triage package.

Business purpose :
This maps to NDconsulting / Desliance style missions where a company needs support around DAF transition, finance transformation, reporting, cash tension, administrative continuity, crisis, process improvement, or finance team reinforcement.

Input schema name :
`MissionIntakeTriageInput`

Input fields :
- `clientName` string, required
- `companyContext` string, required
- `companySize` string, required
- `revenueBand` string, optional
- `industry` string, optional
- `situationSummary` string, required
- `painPoints` string, required
- `requestedOutcome` string, required
- `urgency` string, required
- `dataSensitivity` string, required
- `knownSystems` string, optional
- `availableDocuments` string, optional

Output schema name :
`MissionIntakeTriageResult`

Output fields :
- `missionType` string, required
- `priority` string, required
- `riskSummary` string, required
- `risksJson` string, required
- `missingInformationJson` string, required
- `documentsToRequestJson` string, required
- `questionsForExecutiveJson` string, required
- `thirtySixtyNinetyPlanJson` string, required
- `suggestedNextWorkflow` string, required
- `humanReviewRequired` string or boolean, required
- `safetyNotes` string, required

Acceptance scenarios :
1. cash-tension-intake
   given: company brief mentions cash tension and missing reporting
   when: triage is executed
   then: priority is high, cash/reporting documents are requested, human review is required

2. process-improvement-intake
   given: brief mentions internal processes and administrative inefficiency
   when: triage is executed
   then: procedure and process documents are requested

3. safe-review-draft
   given: any intake
   when: triage is executed
   then: output explicitly says it is a review draft and not final financial advice

Policy :
- auth: `admin` or closest local pattern for business workflow operations.

OPERATION 2
-----------

File :
`src/contracts/cash-aging-prioritization.operation.ts`

Operation key :
`financeOps.cashAging.prioritize`

Title :
`Prioritize Cash Aging Snapshot`

Goal :
Prioritize a fictive aged receivables snapshot with deterministic rules and produce reviewable cash actions.

Business purpose :
This maps to cash management, reporting, risk anticipation and operational finance workflows for Desliance.

Input schema name :
`CashAgingPrioritizationInput`

Input fields :
- `snapshotId` string, required
- `snapshotDate` string, optional
- `currency` string, required
- `rowsJson` string, required
- `reviewOwner` string, optional
- `dataSensitivity` string, required

Each row in `rowsJson` is fictive and should represent :
- `clientName`
- `invoiceId`
- `dueDate`
- `amount`
- `owner`
- `disputeStatus`
- `notes`

Output schema name :
`CashAgingPrioritizationResult`

Output fields :
- `referenceDate` string, required
- `currency` string, required
- `totalExposure` string or number, required
- `overdueExposure` string or number, required
- `disputedExposure` string or number, required
- `topPrioritiesJson` string, required
- `actionsJson` string, required
- `executiveSummary` string, required
- `workflowDecision` string, required
- `humanReviewRequired` string or boolean, required
- `safetyNotes` string, required

Acceptance scenarios :
1. high-value-overdue
   given: invoice amount >= 10000 and overdue > 30 days
   when: cash aging is prioritized
   then: invoice is high priority and appears in top priorities

2. disputed-invoice
   given: invoice has disputeStatus not equal to none
   when: cash aging is prioritized
   then: action is not aggressive collection but dispute resolution / owner clarification

3. deterministic-finance-rules
   given: same input
   when: handler runs multiple times
   then: same output is returned because prioritization does not depend on LLM randomness

4. human-review
   given: any cash snapshot
   when: output is produced
   then: human review is always required before any client communication

Policy :
- auth: `admin`

OPERATION 3
-----------

File :
`src/contracts/procedure-draft.operation.ts`

Operation key :
`financeOps.procedureDraft.create`

Title :
`Create Finance Procedure Draft`

Goal :
Turn messy fictive process notes into a structured internal procedure draft with roles, controls and validation steps.

Business purpose :
This maps to Desliance / NDconsulting procedure internal work, administrative processes, process improvement, change management and training.

Input schema name :
`ProcedureDraftInput`

Input fields :
- `procedureName` string, required
- `processArea` string, required
- `rawNotes` string, required
- `stakeholders` string, optional
- `frequency` string, optional
- `knownRisks` string, optional
- `dataSensitivity` string, required

Output schema name :
`ProcedureDraftResult`

Output fields :
- `procedureTitle` string, required
- `purpose` string, required
- `scope` string, required
- `rolesAndResponsibilitiesJson` string, required
- `stepByStepProcedureJson` string, required
- `controlsJson` string, required
- `kpisJson` string, required
- `openQuestionsJson` string, required
- `trainingNotes` string, required
- `humanReviewRequired` string or boolean, required
- `safetyNotes` string, required

Acceptance scenarios :
1. messy-notes
   given: disorganized notes about receivables follow-up
   when: procedure draft is created
   then: output includes steps, roles, controls and open questions

2. controls-required
   given: procedure area is finance or cash
   when: draft is created
   then: controls and review points are included

3. no-final-policy
   given: any procedure draft
   when: output is produced
   then: output is explicitly a draft requiring management validation

Policy :
- auth: `admin`

OPERATION 4
-----------

File :
`src/contracts/reporting-narrative.operation.ts`

Operation key :
`financeOps.reportingNarrative.compose`

Title :
`Compose Reporting Narrative`

Goal :
Convert a fictive KPI snapshot into a management reporting narrative with deterministic interpretation helpers and human-review guardrails.

Business purpose :
This maps to reporting financier, contrôle de gestion, BI, outils de pilotage and executive decision support.

Input schema name :
`ReportingNarrativeInput`

Input fields :
- `reportingPeriod` string, required
- `currency` string, required
- `kpiSnapshotJson` string, required
- `knownContext` string, optional
- `audience` string, required
- `dataSensitivity` string, required

Each KPI row can include :
- `metric`
- `currentValue`
- `previousValue`
- `targetValue`
- `unit`
- `owner`
- `notes`

Output schema name :
`ReportingNarrativeResult`

Output fields :
- `period` string, required
- `executiveSummary` string, required
- `varianceHighlightsJson` string, required
- `questionsForReviewJson` string, required
- `recommendedFollowUpsJson` string, required
- `confidenceNotes` string, required
- `humanReviewRequired` string or boolean, required
- `safetyNotes` string, required

Acceptance scenarios :
1. variance-detected
   given: KPI current value differs materially from target
   when: reporting narrative is composed
   then: variance is highlighted and review questions are generated

2. no-invention
   given: missing context
   when: output is produced
   then: confidence notes mention missing context instead of inventing causes

3. human-review
   given: any reporting snapshot
   when: output is produced
   then: human review is required before sending to management or clients

Policy :
- auth: `admin`

OPERATION 5
-----------

File :
`src/contracts/adoption-roi-log.operation.ts`

Operation key :
`financeOps.aiAdoption.logUsage`

Title :
`Log AI Adoption ROI`

Goal :
Log an AI workflow usage and estimate ROI, data risk and recommended next step.

Business purpose :
This maps to the CEO’s objective of making teams adopt AI while tracking usage, gains and risks without turning it into creepy individual surveillance. Measure use cases, not humans.

Input schema name :
`AiAdoptionUsageInput`

Input fields :
- `workflowKey` string, required
- `team` string, required
- `useCase` string, required
- `timeBeforeMinutes` string or number, required
- `timeAfterMinutes` string or number, required
- `dataRisk` string, required
- `humanValidated` string or boolean, required
- `qualityRating` string, required
- `notes` string, optional

Output schema name :
`AiAdoptionUsageResult`

Output fields :
- `usageLogId` string, required
- `estimatedMinutesSaved` string or number, required
- `estimatedHoursSaved` string or number, required
- `roiSummary` string, required
- `recommendedNextStep` string, required
- `requiresPolicyReview` string or boolean, required
- `standardizationCandidate` string or boolean, required
- `safetyNotes` string, required

Acceptance scenarios :
1. positive-roi-low-risk
   given: time before is 120, time after is 45, data risk low, human validated true
   when: usage is logged
   then: saved time is 75 minutes and next step is standardize

2. high-risk-data
   given: data risk high
   when: usage is logged
   then: policy review is required

3. no-gain
   given: time before equals or is lower than time after
   when: usage is logged
   then: next step is abandon_or_redesign or train depending on quality

4. low-quality
   given: quality rating is low
   when: usage is logged
   then: recommended next step is train or redesign

Policy :
- auth: `admin`

HANDLERS DÉTERMINISTES
======================

Implement `src/handlers/finance-ops-ai-workflows.handlers.ts`.

Must export :
- domain types ;
- pure helper functions ;
- `createFinanceOpsAiWorkflowsHandlers()` ;
- handlers compatible with all operations ;
- no external calls ;
- no `any`.

Required handler API shape :
Follow the local handler pattern, especially `messaging-agent-actions`.
Use `HandlerForOperationSpec` if local examples use it.

Core exported pure functions :
- `triageMissionIntake(input)`
- `prioritizeCashAging(input)`
- `createProcedureDraft(input)`
- `composeReportingNarrative(input)`
- `logAiAdoptionUsage(input)`
- `parseJsonArraySafely(...)`
- `parseNumberSafely(...)`
- `normalizeBooleanLike(...)`
- `classifyDataRisk(...)`
- `buildSafetyNotes(...)`

Use a fixed reference date for deterministic tests :
`2026-04-28`

Never use `new Date()` for business calculations unless injected or fixed.
This avoids flaky tests, because apparently time itself enjoys sabotaging CI.

MISSION TRIAGE RULES
====================

Input text fields to analyze :
- `situationSummary`
- `painPoints`
- `requestedOutcome`
- `urgency`
- `availableDocuments`
- `knownSystems`

Normalize all text to lower case.

Priority rules :
- `high` if urgency contains `urgent`, `critical`, `crisis`, `redressement`, `retournement`, `cash`, `trésorerie`, `treasury`, `rupture`, `départ`, `vacant`, `manager absent`
- `medium` if pain points contain `reporting`, `process`, `procédure`, `procedure`, `contrôle`, `controle`, `budget`, `forecast`, `business plan`
- otherwise `low`

Mission type rules :
- if text contains `cash`, `trésorerie`, `treasury`, `bfr`, `relance`, return `Cash management / finance recovery`
- if text contains `daf`, `direction financière`, `raf`, `finance manager`, return `DAF transition / finance leadership`
- if text contains `reporting`, `contrôle de gestion`, `power bi`, `bi`, return `Reporting and management control`
- if text contains `process`, `procédure`, `administratif`, return `Finance process improvement`
- otherwise `Finance transformation intake`

Risk rules :
Add risk items based on text :
- cash tension
- missing reporting
- leadership vacancy
- overdue receivables
- weak internal controls
- unclear data quality
- operational continuity
- stakeholder alignment
- tool fragmentation

Documents to request :
Always include :
- latest trial balance or management accounts, if available
- organization chart / finance team roles
- latest reporting package, if available
- current finance process notes
- access map for key systems

If cash-related :
- aged receivables
- aged payables
- cash forecast
- bank position
- payment calendar
- collection process

If reporting-related :
- monthly reporting pack
- KPI definitions
- budget / forecast files
- Power BI or spreadsheet models
- chart of accounts mapping

If process-related :
- internal procedures
- approval matrices
- role descriptions
- closing calendar
- controls checklist

Questions for executive :
Generate 8 to 12 deterministic questions covering :
- business objective
- urgency
- cash exposure
- reporting expectations
- decision rhythm
- existing team
- systems
- constraints
- success criteria
- validation owner

30/60/90 plan :
Return JSON with phases :
- `days_0_30`
- `days_31_60`
- `days_61_90`

Each phase includes :
- objectives
- actions
- deliverables
- validation points

Always include :
- `humanReviewRequired: true`
- safety note: “Review draft only. Not final financial, legal, tax or accounting advice.”

CASH AGING RULES
================

Parse `rowsJson` safely.

If JSON invalid :
- return a safe result with zero exposure ;
- include safety note explaining invalid JSON ;
- include `humanReviewRequired: true` ;
- do not throw unless local handler convention expects throw.

Expected row fields :
- `clientName`
- `invoiceId`
- `dueDate`
- `amount`
- `owner`
- `disputeStatus`
- `notes`

Reference date :
`2026-04-28`

Calculate overdue days :
- parse dueDate ;
- if invalid, overdueDays = 0 and add note ;
- overdueDays = max(daysBetween(referenceDate, dueDate), 0)

Exposure :
- totalExposure = sum amount
- overdueExposure = sum amount where overdueDays > 0
- disputedExposure = sum amount where disputeStatus is not empty and not `none`

Priority classification :
- `dispute` if disputeStatus not empty and not `none`
- `high` if amount >= 10000 and overdueDays > 30
- `medium` if overdueDays > 15
- `low` otherwise

Sort priorities :
1. dispute first if amount >= 10000
2. high
3. medium
4. low
5. then by amount descending
6. then by overdue days descending

Action rules :
- dispute: `Clarify dispute with owner before collection follow-up`
- high: `Prepare executive escalation and client follow-up draft`
- medium: `Schedule standard follow-up and payment date confirmation`
- low: `Monitor and include in next routine review`

Never generate actual email sending.
Only generate reviewable action drafts.

Executive summary :
Must include :
- total exposure
- overdue exposure
- disputed exposure
- top 3 priorities
- warning that output requires finance owner validation
- no invented causes

Workflow decision :
- `review_disputes_first` if disputedExposure > 0
- `escalate_high_priority_items` if high priority count > 0
- `routine_follow_up` otherwise

Always include human review.

PROCEDURE DRAFT RULES
=====================

Input :
- procedureName
- processArea
- rawNotes
- stakeholders
- frequency
- knownRisks
- dataSensitivity

Output must structure messy notes into :
- purpose
- scope
- roles and responsibilities
- step-by-step procedure
- controls
- KPIs
- open questions
- training notes
- safety notes

Do not invent exact legal obligations.
Do not invent company-specific approval thresholds unless provided.
If missing, add open questions.

If processArea contains cash, receivables, relance, treasury :
- include controls around payment promises, dispute tracking, aging review, escalation threshold, validation owner.

If processArea contains reporting, closing, monthly :
- include controls around data source, reconciliation, variance review, sign-off, deadline.

If processArea contains business plan, funding, subventions :
- include controls around assumptions, evidence, owner review, submission validation.

Always include :
- human review required ;
- management validation required ;
- draft status.

REPORTING NARRATIVE RULES
=========================

Parse `kpiSnapshotJson` safely.

Each KPI row can include :
- metric
- currentValue
- previousValue
- targetValue
- unit
- owner
- notes

Compute deterministic helper values :
- varianceVsPrevious if previousValue exists
- varianceVsTarget if targetValue exists
- classify variance:
    - `above_target`
    - `below_target`
    - `stable`
    - `needs_context`
- material variance threshold:
    - 10 percent if percentages are computable
    - otherwise use absolute comparison if units/values are simple numbers
    - if not computable, mark needs_context

Executive summary :
- concise narrative ;
- no invented business causes ;
- mention “needs context” when data alone is insufficient ;
- include questions for review ;
- include follow-up actions.

Questions for review :
- why did metric move?
- is data source reliable?
- who owns corrective action?
- is target still valid?
- does this affect cash, margin or operational capacity?

Always include :
- human review required ;
- safety notes.

ADOPTION ROI RULES
==================

Parse time fields as numbers.

estimatedMinutesSaved :
`max(timeBeforeMinutes - timeAfterMinutes, 0)`

estimatedHoursSaved :
minutes / 60 rounded to 2 decimals.

Normalize :
- dataRisk: low, medium, high
- humanValidated: true/false
- qualityRating: low, medium, high

requiresPolicyReview :
true if :
- dataRisk high ;
- humanValidated false ;
- useCase mentions sensitive data ;
- workflowKey mentions client_data and dataRisk not low

standardizationCandidate :
true if :
- estimatedMinutesSaved > 15 ;
- dataRisk low or medium ;
- humanValidated true ;
- qualityRating high or medium

recommendedNextStep :
- `policy_review` if requiresPolicyReview
- `standardize` if standardizationCandidate and quality not low
- `train` if quality low and minutes saved > 0
- `abandon_or_redesign` if estimatedMinutesSaved <= 0
- `monitor` otherwise

Safety notes :
- Track use cases and workflow ROI, not intrusive employee surveillance.
- Do not log confidential client content in usage logs.
- Validate outputs before client-facing use.

FIXTURES
========

Create useful fictive fixtures.

Mission fixture :
A PME industrielle with :
- 85 employees
- CA 14 M€
- sudden RAF departure
- no monthly reporting for 4 months
- cash tension
- irregular receivables follow-up
- Excel/Power BI fragmented tools
- objective: stabilize finance function and restore reporting

Cash aging fixture :
At least 6 fictive receivable rows :
1. high amount, overdue > 30
2. disputed high amount
3. medium overdue
4. low priority
5. invalid-ish note but valid date
6. recent invoice not overdue

Procedure notes fixture :
Messy notes about client collection / relance process:
- invoices sent weekly
- disputes in emails
- owner unclear
- reminders irregular
- CEO wants weekly cash visibility
- no escalation rule
- no KPI

Reporting fixture :
At least 5 KPIs:
- revenue
- gross margin
- operating expenses
- cash balance
- DSO
  With previous and target values where possible.

Adoption fixture :
At least 5 usage logs:
- mission intake triage
- cash prioritization
- procedure draft
- reporting narrative
- training support
  Mix low/medium/high data risk and quality.

DOCS / README
=============

Write a high-quality README.

README sections :

1. Title
   `Finance Ops AI Workflows`

2. One-liner
   `A ContractSpec template for safe, deterministic, human-reviewed AI-assisted finance operations workflows.`

3. Why this exists
   Explain that finance teams should not deploy generic AI usage without contracts, validation and traceability.
   This template demonstrates how to move from prompts to workflows.

4. Business context
   Mention use cases:
- DAF transition intake
- cash management and receivables prioritization
- internal procedure drafting
- reporting narrative
- AI adoption ROI tracking

5. What this demonstrates
- explicit contracts
- deterministic handlers
- no LLM dependency
- no external API
- human review
- finance guardrails
- adoption ROI
- safe template for future agents/workflows

6. Workflows
   Describe each operation in business language:
- Mission Intake Triage
- Cash Aging Prioritization
- Procedure Draft Creation
- Reporting Narrative Composition
- AI Adoption ROI Logging

7. Architecture
   Explain:
- contracts
- handlers
- fixtures
- docs
- feature metadata
- example metadata
- tests

8. Safety model
   Include:
- no real financial advice
- no autonomous decisions
- no autonomous email sending
- no real client data
- deterministic rules for sensitive calculations
- human validation before client-facing use

9. Running locally
   Commands:
- install, if necessary
- build
- typecheck
- test
- smoke
- preflight
  Use commands matching package conventions.

10. How to use this template commercially
    Short section:
    This example can be used to demonstrate to finance consulting firms how AI workflows can be structured before building custom automations.

11. Suggested next steps
- replace fixtures with client-approved anonymized scenarios
- connect to approved tools
- add policy checks
- add audit logs
- add human approval queue
- add dashboard only after workflows are validated

Also create docblock docs if local pattern supports it.
DocBlock should be concise and useful in Studio/templates preview.

DEMO SCRIPT FOR NDCONSULTING / DESLIANCE
========================================

If docs allow markdown, create `src/docs/demo-script-ndconsulting.md`.
Otherwise include this in README or docblock.

Demo script title :
`Demo script: from prompts to contracted finance workflows`

Demo narrative :

Opening :
“Instead of showing isolated prompts, this template shows finance workflows as contracts: each input, output, rule and validation point is explicit.”

Demo 1 :
Mission Intake Triage
- show fictive PME industrial brief
- run handler
- show mission type, priority, documents, questions, 30/60/90 plan
- message: the AI does not replace a DAF, it structures the preparation

Demo 2 :
Cash Aging Prioritization
- show fictive aged receivables
- run deterministic prioritization
- show top priorities and actions
- message: sensitive calculations are rule-based, not hallucinated

Demo 3 :
Procedure Draft
- show messy process notes
- generate structured procedure
- message: converts field knowledge into reviewable operating procedure

Demo 4 :
Reporting Narrative
- show KPI snapshot
- generate management narrative
- message: produces a draft narrative but refuses to invent causes

Demo 5 :
Adoption ROI Log
- log usage
- show minutes saved, risk, next step
- message: track use cases and ROI, not intrusive individual surveillance

Closing :
“The next step would be to map NDconsulting / Desliance recurring workflows, pick one pilot, and replace these fixtures with approved anonymized client-like scenarios.”

TESTS
=====

Implement tests using Bun test according to repo pattern.

Handler tests must cover :

Mission intake :
- cash + reporting + urgency => high priority
- documents include cash and reporting documents
- human review required
- safety notes included
- deterministic output

Cash aging :
- valid rows parse
- total exposure computed
- overdue exposure computed
- disputed exposure computed
- high priority invoice sorted correctly
- dispute action generated
- invalid JSON handled safely
- same input returns same output

Procedure draft :
- messy notes become steps
- roles and responsibilities exist
- controls exist
- open questions exist for missing thresholds
- human review required

Reporting narrative :
- variances detected
- missing context is acknowledged
- no invented causes
- review questions generated
- human review required

Adoption ROI :
- 120 before, 45 after => 75 minutes saved
- low risk + human validated + good quality => standardize
- high risk => policy_review
- no gain => abandon_or_redesign
- low quality + gain => train or redesign depending on rules

Smoke test :
- imports default example
- imports feature
- imports contracts
- imports handlers
- verifies keys:
    - `finance-ops-ai-workflows`
    - `financeOps.missionIntake.triage`
    - `financeOps.cashAging.prioritize`
    - `financeOps.procedureDraft.create`
    - `financeOps.reportingNarrative.compose`
    - `financeOps.aiAdoption.logUsage`

Contract test if useful :
- verify operation metadata has title, goal, owners, tags, stability, policy.
- verify feature lists all operations.
- verify example metadata has templates surface enabled.

Do not use fragile snapshots unless existing examples use them heavily.
Prefer explicit assertions.

REGISTRY / TEMPLATE INTEGRATION
===============================

Search how templates are surfaced.

Search for :
- `messaging-agent-actions`
- `minimal`
- `policy-safe-knowledge-assistant`
- `defineExample`
- `examples registry`
- `packages/apps-registry`
- website templates registry
- any generated manifest

If the registry integration is obvious and safe :
- add `finance-ops-ai-workflows` to the appropriate local registry.
- use key/title/tags/stability/visibility consistent with `example.ts`.

If ambiguous :
- do not modify registry randomly.
- document what appears to be responsible.
- state what remains to wire manually.

QUALITY BAR
===========

This template is successful if :

1. It compiles.
2. It typechecks.
3. Tests pass.
4. Smoke test passes.
5. README is useful to a business and technical reader.
6. Contracts are explicit and aligned with handlers.
7. Handlers are deterministic.
8. No LLM calls exist.
9. No external API calls exist.
10. No real financial advice is implied.
11. Human review is required everywhere.
12. The package exports are clean.
13. The example metadata allows it to be shown as a public template if registry wiring supports it.
14. The output can be used as a demo for NDconsulting / Desliance.
15. The implementation respects the repository conventions.

ANTI-DÉRAPAGE
=============

Do not:
- create a full SaaS ;
- create a React dashboard ;
- create a database ;
- add authentication ;
- add email sending ;
- add OpenAI SDK ;
- add LangChain ;
- add n8n/Make/Zapier integrations ;
- add a real agent runtime ;
- add random UI components ;
- add speculative architecture ;
- write files outside the package unless registry integration is clear ;
- change shared libraries ;
- loosen TypeScript ;
- use `any` ;
- silence errors with casts ;
- invent unsupported ContractSpec primitives ;
- break existing examples ;
- make financial recommendations sound final ;
- pretend this is production-ready.

If tempted to add UI, stop.
If tempted to call an LLM, stop.
If tempted to make autonomous actions, stop.
If tempted to make it “more impressive” by adding complexity, stop. The impressive part is that it is reviewable and does not behave like a caffeinated spreadsheet ghost.

OPTIONAL STRETCH GOALS
======================

Only after MVP passes build/typecheck/test/smoke :

1. Add a proof/replay artifact
   If local examples include proof artifacts, add a lightweight replay that runs all five workflows on fixtures and exports a structured result.

2. Add richer docs
   Add a business-facing demo script and implementation notes.

3. Add additional workflow
   Only if very easy:
   `financeOps.fundingReadiness.check`
   For levées de fonds / subventions readiness.
   Input:
- project summary
- funding need
- timeline
- available evidence
  Output:
- readiness score
- missing documents
- assumptions to validate
- next actions
  Must be deterministic and safe.

4. Add package-level changelog note only if repo conventions require it.

VALIDATION COMMANDS
===================

After implementation, run the package-local commands first.

Possible commands:
- `bun run typecheck`
- `bun run test`
- `bun run smoke`
- `bun run preflight`
- `bun run validate` if available
- workspace-targeted command if repo uses workspace tooling

If commands fail:
1. identify if failure is package-local or repo-global ;
2. fix package-local failures ;
3. rerun ;
4. document repo-global failures without trying to repair the entire monorepo.

FINAL OUTPUT REQUIRED
=====================

At the end, produce a concise implementation report with :

1. Summary
   One paragraph explaining what was built.

2. Business/product value
   Explain how this helps demonstrate NDconsulting / Desliance workflows:
- mission triage
- cash prioritization
- procedure draft
- reporting narrative
- AI adoption ROI

3. Files created/modified
   List paths.

4. Contracts created
   List operation keys.

5. Handlers implemented
   List handler functions.

6. Tests added
   List test files and coverage.

7. Commands run
   For each command:
- command
- result
- relevant notes

8. Registry status
   State whether template registry was wired or not.

9. Limitations
   Explicitly mention:
- no real LLM
- no external integrations
- fictive data only
- not production financial advice
- human review required

10. How to demo it
    Give a 5-step demo flow:
- import fixtures
- run mission intake
- run cash aging
- run procedure/reporting
- run ROI logging
- show outputs

11. Suggested next iteration
    Only after this package is stable:
- connect to approved anonymized data
- add human approval queue
- add policy layer
- add real integration behind contracts
- create NDconsulting-specific pilot.