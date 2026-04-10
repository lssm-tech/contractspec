# Input Sources and Ingestion

## Supported source classes

Builder must accept at least the following source classes.

### 1. Web chat guidance
Examples:
- goals,
- requirements,
- corrections,
- constraints,
- export requests,
- approval comments.

### 2. Voice / audio guidance
Examples:
- browser microphone turns,
- uploaded audio notes,
- voice notes from Telegram or WhatsApp,
- meeting recordings or snippets.

### 3. Files and ZIP bundles
Examples:
- `.txt`, `.md`, `.mdx`,
- `.json`, `.yaml`, `.yml`, `.csv`,
- `.pdf`,
- `.docx`,
- images like `.png`, `.jpg`, `.jpeg`, `.webp`,
- zipped requirement folders, screenshots, policy bundles, exports.

### 4. Studio data and snapshots
Examples:
- approved policy packs,
- approved connector snapshots,
- glossary and taxonomy,
- prior blueprints,
- reviewed drafts,
- approved runtime configurations.

### 5. Telegram control channel
Examples:
- messages,
- replies,
- callbacks / buttons,
- voice notes,
- attachments,
- edits and deletes.

### 6. WhatsApp control channel
Examples:
- text messages,
- media messages,
- voice notes,
- interactive replies,
- status events.

### 7. External provider outputs
Examples:
- plan drafts,
- patch proposals,
- test suggestions,
- STT transcripts,
- generated UI artifacts,
- explanation summaries.

External provider outputs are inputs to the Builder evidence system.
They are **not** automatically trusted final truth.

## Ingestion pipeline

Every source goes through:
1. receive
2. authenticate origin
3. classify
4. sanitize / unpack
5. extract
6. segment
7. summarize
8. provenance-link
9. confidence + conflict marking
10. store
11. compile into normalized directives

## Mobile-first ingestion requirement

Every supported source class that matters for desktop users must have a mobile-accessible equivalent.

Examples:
- doc upload from mobile share sheet,
- voice-note ingestion from messaging channels,
- approval comments from Telegram / WhatsApp,
- mobile-accessible preview screenshots and trace cards.

## ZIP handling rules

ZIP ingestion must:
- preserve original bundle hash,
- expand into logical entries,
- reject dangerous paths or traversal,
- cap size and fanout,
- identify binaries and unsupported content,
- allow partial ingest with visible warnings.

## Document handling rules

### PDFs
- prefer structured text extraction first,
- preserve page numbers,
- mark image-derived facts separately when visual extraction is needed.

### Images
- preserve original file,
- generate extracted descriptions or OCR separately from the original source record,
- flag uncertain regions.

### DOCX / office-like docs
- preserve document structure,
- extract headings, lists, and tables,
- preserve embedded image references where possible.

## Voice / STT rules

- preserve raw media when policy allows,
- create transcript segments with time ranges,
- separate transcript from interpreted directive,
- require confirmation for risky or structurally significant instructions derived from STT,
- attach language and confidence metadata.

## Studio import rules

Studio data must enter Builder as:
- a versioned snapshot,
- a traceable reference,
- or an approved memory artifact.

Builder must not rely on hidden mutable Studio state.
Imports should be replayable.

## External provider output ingestion rules

Provider output ingestion must attach:
- provider id,
- provider kind,
- model or engine version when available,
- input context hash,
- output artifact hashes,
- runtime target used,
- declared confidence or uncertainty if present.

## Commands

- `ingestSource(sourceRef, workspaceId)`
- `ingestZipBundle(bundleRef, workspaceId)`
- `ingestChannelMessage(channelPayload, bindingId)`
- `ingestAudio(sourceRef, transcriptionPolicy)`
- `importStudioSnapshot(snapshotRef, workspaceId)`
- `ingestProviderOutput(runReceiptId, artifactRefs[])`
