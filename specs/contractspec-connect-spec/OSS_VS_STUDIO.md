# OSS vs Studio Boundary

## Why this split matters

Connect only works if local safety is real in OSS mode.

If Connect requires Studio for baseline enforcement, it stops being a practical coding-agent wedge and starts looking like a proprietary dependency searching for a problem.

## OSS responsibilities

OSS must cover everything required for local safety:

- `.contractsrc.json > connect`
- local DTO generation
- local audit and review packets
- replay hooks
- plugin-first adapter support
- command and path policy defaults

### OSS promise

A team without Studio should still be able to:

- block or review risky agent mutations
- inspect why a verdict was returned
- reproduce decisions locally
- consume read-only canon refs they already have

## Studio responsibilities

Studio may add:

- shared review queues
- organization-level policy UI
- canon-pack registry transport
- lineage across review and handoff flows
- managed lanes and schedules

### Studio promise

A team using Studio gains collaboration and transport, not basic safety.

## Decision rule

- If a feature is required for local safety, it belongs in OSS.
- If a feature is primarily multi-user governance, coordination, or transport, it belongs in Studio.
