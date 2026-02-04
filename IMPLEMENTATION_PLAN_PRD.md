# PRD — Transcript → Evidence → Problems → Tickets (with proof links)

## Product name
**Controspect** (working name)  
Tagline: **“From meeting transcript to ready-to-work tickets, with context preserved.”**

## Goal
Turn a raw meeting transcript into:
1) **Evidence** (atomic findings with exact quote citations)  
2) **Problem statements** (one-line clustered issues)  
3) **Tickets** (ordered plan, each ticket linked back to transcript quotes)  
4) Optional: **PatchIntent + deterministic Impact Report** (ContractSpec-powered)

## Target users / ICP
Small, scrappy teams (founders/PMs/designers) who:
- run lots of calls
- don’t have perfect sprint rituals
- use Trello/Asana/Linear/Jira but hate typing tickets
- need “why” preserved to prevent drift and political rewriting

## Core value props
- **Time saved:** remove manual ticket typing after calls
- **Context preserved:** every ticket is provably grounded in quotes
- **Alignment:** “I never said that” becomes “click the quote”
- **Engineering-ready:** acceptance criteria + surfaces impacted (optional)

## Primary use case flow (demo)
**PM drops transcript → sees evidence → sees problems → gets tickets**

### Step 1: Ingest transcript
- Input: paste text or upload `.txt/.md`
- Output: transcript viewer with chunk IDs

### Step 2: Extract evidence
- Output: list of `EvidenceFinding` cards
- Each finding must include:
  - `claim` (short)
  - `quote` (exact substring)
  - `chunk_id`
  - optional `speaker`, `timestamp`
  - `tags` and `severity`
- Hard constraint: no evidence without citation quote

### Step 3: Generate problem statements
- Output: list of one-line problems
- Each problem links to 3–8 evidence findings

### Step 4: Generate tickets
- Output: ordered tickets (“mini roadmap”)
- Each ticket contains:
  - title
  - why (1–2 lines)
  - evidence links (quote cards)
  - acceptance criteria
  - suggested owner (PM/Design/Eng)
  - priority and confidence
- Export:
  - Markdown (`TICKETS.md`)
  - JSON (`tickets.json`)
  - copy-to-clipboard per ticket

### Optional Step 5: Patch + Impact (ContractSpec)
- For a selected ticket:
  - generate `PatchIntent`
  - produce “typed deltas”
  - run deterministic **Impact Engine**
  - show BREAKS / MUST CHANGE / RISKY + references (surfaces / file token hits)

## Non-goals (explicit)
- No login/auth
- No calendar integrations
- No “replace Jira/Linear”
- No perfect clustering
- No perfect repo scanning (token scan is fine)
- No audio transcription unless it’s already trivial

## Success criteria (for hackathon)
- End-to-end flow works on a demo transcript in < 45 seconds
- All evidence and problems have **clickable proof** (quote → transcript)
- Tickets are usable: acceptance criteria + ordering + evidence links
- Impact report looks “real” (deterministic rules + references)

## Data model (minimum)
- `Transcript { id, raw_text }`
- `Chunk { id, transcript_id, idx, text, start_char, end_char }`
- `EvidenceFinding { id, claim, quote, chunk_id, speaker?, tags[], severity }`
- `ProblemStatement { id, title, finding_ids[] }`
- `Ticket { id, title, why, evidence_ids[], acceptance[], priority, owner_hint, order }`
- Optional:
  - `PatchIntent { id, ticket_id, deltas[] }`
  - `ImpactReport { breaks[], must_change[], risky[], surfaces, references[] }`

## UX requirements
Single page, stepper or columns:
1) Transcript
2) Evidence
3) Problems
4) Tickets (+ optional Impact tab)

Interactions (must):
- click evidence → scroll transcript to the quote highlight
- click ticket → highlight its evidence quotes

## Technical constraints
- Strict JSON outputs, zod validation
- Citation validator: quote must be exact substring of chunk text
- Fail closed: if missing citations, regenerate
- Deterministic “Impact Engine”: rule-based, not LLM-based
