# UI Surfaces and Flows

## Primary surfaces

### 1. Builder cockpit
Shows:
- workspace summary,
- current blueprint status,
- readiness status,
- runtime mode,
- provider activity,
- pending approvals.

### 2. Source inbox
Shows:
- chat turns,
- voice notes,
- files and ZIP entries,
- Studio imports,
- provider outputs.

### 3. Decision ledger
Shows:
- accepted decisions,
- conflicts,
- inferred items,
- superseded items,
- provenance.

### 4. Provider activity panel
Shows:
- active runs,
- provider chosen,
- runtime mode used,
- receipts,
- comparison results,
- patch proposal status.

### 5. Blueprint editor
Shows:
- structured app model,
- workflows,
- surfaces,
- policies,
- runtime profiles,
- mobile parity markers.

### 6. Runtime target manager
Shows:
- managed/local/hybrid targets,
- health,
- capability handshake,
- trust profile,
- last export compatibility.

### 7. Mobile review page
Shows:
- compact diff,
- evidence summary,
- approval options,
- runtime implications,
- deep provenance links.

## Key flows

### Flow 1: chat + docs to first blueprint
1. user starts workspace
2. user chats goal and uploads docs/ZIP
3. Builder ingests and fuses
4. clarification lane resolves ambiguity
5. plan lane proposes app class, runtime target, and provider strategy
6. draft blueprint appears
7. readiness shows open gaps

### Flow 2: voice note to safe change
1. user sends voice note through WhatsApp or Telegram
2. STT provider transcribes
3. Builder extracts directive candidates
4. risky interpretations require confirmation
5. approved change updates blueprint or plan
6. mobile card confirms result

### Flow 3: provider patch proposal review
1. Builder delegates scoped task to coding provider
2. proposal and receipt return
3. harness verifies
4. mobile or web review card appears
5. user approves or rejects
6. preview updates if accepted

### Flow 4: local runtime registration
1. power user installs local runtime
2. runtime handshake registers with Builder
3. trust profile and capability summary appear
4. workspace can target local/hybrid mode
5. mobile users can still monitor and approve safe actions

### Flow 5: export decision
1. readiness goes green for one or more runtime modes
2. user selects managed/local/hybrid export
3. final approval flow runs
4. export bundle, receipts, and audit package are generated

## UX rules

- never hide runtime mode from the user
- never hide which provider created a patch proposal
- never make the evidence trail harder to access on mobile
- never allow a message-thread UX to be the only way to inspect a critical diff
