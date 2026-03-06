# @contractspec/example.in-app-docs

Website: https://contractspec.io/

**DocBlock for in-app documentation**

Example showing how to use DocBlock for in-app documentation for non-technical users. Registers doc blocks on load and provides UI components for viewing docs inside your application.

## What This Demonstrates

- DocBlock registration and structure for user-facing guides
- InAppDocsViewer component for rendering docs in-app
- Example spec with sandbox and markdown modes

## Exports

- `.` — main entry (registers docs, exports example and UI)
- `./docs` — doc blocks
- `./example` — example metadata
- `./ui` — UI components
- `./ui/InAppDocsViewer` — docs viewer component

## Usage

```ts
import "@contractspec/example.in-app-docs"; // registers doc blocks
import { InAppDocsViewer } from "@contractspec/example.in-app-docs/ui/InAppDocsViewer";

// Render the viewer in your app
<InAppDocsViewer />
```
