# Telemetry Ingest Endpoint

The ContractSpec API provides a telemetry ingest endpoint for clients to send product analytics events.

## Endpoint

```
POST /api/telemetry/ingest
```

## Request

```json
{
  "event": "contractspec.vscode.command_run",
  "distinct_id": "client-uuid",
  "properties": {
    "command": "validate"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Headers

| Header                     | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `x-contractspec-client-id` | Optional client identifier (used as fallback for distinct_id) |
| `Content-Type`             | Must be `application/json`                                    |

### Body

| Field         | Type   | Required | Description                                        |
| ------------- | ------ | -------- | -------------------------------------------------- |
| `event`       | string | Yes      | Event name (e.g., `contractspec.vscode.activated`) |
| `distinct_id` | string | Yes      | Anonymous client identifier                        |
| `properties`  | object | No       | Event properties                                   |
| `timestamp`   | string | No       | ISO 8601 timestamp                                 |

## Response

```json
{
  "success": true
}
```

## Configuration

The endpoint requires `POSTHOG_PROJECT_KEY` environment variable to be set. If not configured, events are accepted but not forwarded.

| Environment Variable  | Description             | Default                  |
| --------------------- | ----------------------- | ------------------------ |
| `POSTHOG_HOST`        | PostHog host URL        | `https://eu.posthog.com` |
| `POSTHOG_PROJECT_KEY` | PostHog project API key | (required)               |

## Privacy

- No PII is collected or stored
- `distinct_id` is an anonymous client-generated UUID
- File paths and source code are never included in events
- Respects VS Code telemetry settings on the client side

## Events

### OSS Adoption Funnel

| Event                  | Description                  | Properties                                          |
| ---------------------- | ---------------------------- | --------------------------------------------------- |
| `cta_install_click`    | Clicked Install OSS CTA      | `surface`                                           |
| `cta_studio_click`     | Clicked Studio CTA           | `surface`, `variant`                                |
| `docs_quickstart_view` | Entered quickstart docs path | `surface`, `destination`                            |
| `copy_command_click`   | Copied a command block       | `surface`, `language`, `filename`, `packageManager` |
| `example_repo_open`    | Selected a template/example  | `surface`, `templateId`, `source`                   |

### Extension Events

| Event                             | Description         | Properties         |
| --------------------------------- | ------------------- | ------------------ |
| `contractspec.vscode.activated`   | Extension activated | `version`          |
| `contractspec.vscode.command_run` | Command executed    | `command`          |
| `contractspec.vscode.mcp_call`    | MCP call made       | `endpoint`, `tool` |

### API Events

| Event                          | Description           | Properties                                     |
| ------------------------------ | --------------------- | ---------------------------------------------- |
| `contractspec.api.mcp_request` | MCP request processed | `endpoint`, `method`, `success`, `duration_ms` |
