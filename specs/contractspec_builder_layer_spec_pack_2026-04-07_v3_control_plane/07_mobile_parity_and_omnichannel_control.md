# Mobile Parity and Omnichannel Control

## Requirement

Builder v3 must deliver **full functional parity on mobile**.

This does **not** mean every desktop interaction is copied pixel-for-pixel into Telegram or WhatsApp.
It means every important capability is available from a mobile device through one of:
- Telegram,
- WhatsApp,
- responsive mobile web,
- authenticated in-app review pages launched from those channels.

No critical workflow should require a desktop-only escape hatch.

## Parity dimensions

### 1. Capability parity
Users can:
- create or refine requirements,
- upload docs and media,
- send voice notes,
- review blueprint changes,
- inspect evidence and blockers,
- approve/reject safe actions,
- trigger previews,
- inspect runtime target status,
- request export.

### 2. Evidence parity
Users can inspect:
- why the system thinks a change happened,
- what provider ran,
- what diff or artifact resulted,
- what policy or approval is blocking.

### 3. Approval parity
A mobile user with the right binding and approval strength can approve the same classes of actions allowed on desktop.

### 4. Recovery parity
A mobile user can:
- correct misinterpretations,
- reject proposals,
- reopen blocked items,
- resume interrupted flows.

### 5. Visibility parity
A mobile user can monitor:
- provider progress,
- runtime health,
- pending tickets,
- recent source ingestion,
- last export status.

## Channel vs mobile web

Messaging channels are great for:
- intake,
- short review cards,
- quick approvals,
- voice notes,
- alerts,
- lightweight corrections.

Mobile web is better for:
- rich diff inspection,
- long forms,
- side-by-side comparison,
- structured preview review,
- runtime target management.

The correct pattern is:
- **short action in channel when possible**
- **secure mobile deep-link when needed**
- **never force desktop**

## Core mobile flows

### Flow A: voice-first requirement capture
1. user sends voice note
2. Builder transcribes and summarizes
3. Builder asks for confirmation on risky interpretations
4. accepted directives update draft blueprint
5. user sees compact summary card

### Flow B: diff review card
1. provider proposes patch
2. Builder sends mobile review card
3. user sees summary, risk, provider, affected areas
4. user approves/rejects or opens secure mobile diff page

### Flow C: runtime incident on mobile
1. runtime target degrades
2. Builder sends alert to bound channels
3. user can inspect status and choose safe actions from mobile

## Channel-specific guidance

### Telegram
Use for:
- quick review cards,
- callbacks,
- threaded follow-up,
- voice notes,
- operator updates.

### WhatsApp
Use for:
- short review cards,
- guided approvals,
- voice-note intake,
- concise status updates,
- mobile-first user population.

### Mobile web
Use for:
- the full workbench experience on small screens,
- screenshots and diff evidence,
- export review,
- runtime and provider policy editing.

## Channel parity contract

Each Builder feature must declare:
- `mobileSupport`: `full` | `partial` | `blocked`
- `channelSupport[]`
- `mobileFallbackRef?`
- `approvalStrengthRequired`
- `evidenceShape`

Features marked `blocked` on mobile are not acceptable in v3 unless explicitly deferred and justified in rollout.

## Accessibility and resilience

Mobile parity also requires:
- resumable uploads,
- small payload summaries,
- graceful low-bandwidth mode,
- timezone-safe notifications,
- touch-first action targets,
- no hidden hover-only logic.
