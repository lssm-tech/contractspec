# @contractspec/example.meeting-recorder-providers

Website: https://contractspec.io/

**Meeting recorder provider integration** -- list meetings, transcripts, and webhook handler patterns.

## What This Demonstrates

- Provider creation and connection handling
- Meeting listing and transcript retrieval
- Webhook processing for recording events

## Exports

- `.` -- aggregated re-exports
- `./handlers/create-provider` -- provider creation handler
- `./handlers/get-transcript` -- transcript retrieval handler
- `./connection.sample` -- sample connection configuration
- `./docs` -- DocBlock documentation
- `./example` -- example spec definition

## Usage

```ts
import { createProviderHandler } from "@contractspec/example.meeting-recorder-providers/handlers/create-provider";
import { getTranscriptHandler } from "@contractspec/example.meeting-recorder-providers/handlers/get-transcript";
```
