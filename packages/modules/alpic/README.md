# @contractspec/module.alpic

Minimal helpers for hosting MCP servers and ChatGPT App assets on Alpic.

## Usage

```ts
import { createAlpicMcpApp } from "@contractspec/module.alpic";

const app = createAlpicMcpApp();
app.listen(8080);
```

## Assets

Alpic serves static assets from `/assets` on the deployed domain. Use the
helpers to build paths or absolute URLs:

```ts
import { alpicAssetPath, alpicAssetUrl } from "@contractspec/module.alpic";

const relativePath = alpicAssetPath("index.html");
const absoluteUrl = alpicAssetUrl("index.html");
```
