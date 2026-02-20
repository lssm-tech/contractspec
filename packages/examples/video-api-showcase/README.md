# @contractspec/example.video-api-showcase

Website: https://contractspec.io/

Generate API documentation videos from contract spec definitions using the `ApiOverview` composition.

This package demonstrates:

- Manually constructing a `VideoProject` from spec metadata (name, method, endpoint, code)
- Mapping API spec definitions to `ApiOverview` composition props
- Configuring render output with quality presets (draft/standard/high)
- Batch-building video projects for multiple specs with `buildApiVideoSuite`

## Quickstart

```typescript
import { buildApiVideo, buildRenderConfig } from "@contractspec/example.video-api-showcase";
import { createUserSpec } from "@contractspec/example.video-api-showcase";

// Build a single video project from a spec definition
const project = buildApiVideo(createUserSpec);

// Configure rendering
const config = buildRenderConfig("./out/create-user.mp4", "standard");
```

Three sample specs are included: `createUserSpec` (POST /api/users), `listTransactionsSpec` (GET /api/transactions), and `sendNotificationSpec` (POST /api/notifications).

This example uses manual `VideoProject` construction rather than the `VideoGenerator` pipeline -- ideal when the video structure is known ahead of time.
