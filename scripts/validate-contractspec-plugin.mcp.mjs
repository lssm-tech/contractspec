export function validateMcpShape(context, mcpConfig) {
  if (!mcpConfig?.mcpServers || typeof mcpConfig.mcpServers !== 'object') {
    context.errors.push('.mcp.json must contain mcpServers');
    return [];
  }

  const urls = [];
  for (const [name, server] of Object.entries(mcpConfig.mcpServers)) {
    if (typeof server !== 'object' || server === null) {
      context.errors.push(`MCP server '${name}' must be an object`);
      continue;
    }
    if (
      typeof server.description !== 'string' ||
      server.description.trim().length === 0
    ) {
      context.errors.push(`MCP server '${name}' should include a description`);
    }
    if (typeof server.url !== 'string') {
      context.notices.push(
        `Skipped network check for '${name}' (no url field)`
      );
      continue;
    }
    if (!server.url.startsWith('https://')) {
      context.errors.push(
        `MCP server '${name}' url must use https: ${server.url}`
      );
      continue;
    }
    urls.push([name, server.url]);
  }

  return urls;
}

export async function checkMcpUrls(context, urls) {
  if (process.env.SKIP_PLUGIN_NETWORK_CHECK === '1') {
    context.notices.push(
      'Skipped MCP network check (SKIP_PLUGIN_NETWORK_CHECK=1)'
    );
    return;
  }
  if (typeof fetch !== 'function') {
    context.notices.push(
      'Global fetch unavailable; skipping MCP network check'
    );
    return;
  }

  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'contractspec-plugin-validate', version: '1.0.0' },
    },
  };

  for (const [name, url] of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify(payload),
        signal:
          typeof AbortSignal?.timeout === 'function'
            ? AbortSignal.timeout(15000)
            : undefined,
      });

      if (!response.ok) {
        context.errors.push(
          `MCP server '${name}' failed initialize check with status ${response.status}`
        );
      }
    } catch (error) {
      context.errors.push(
        `MCP server '${name}' initialize check failed: ${String(error)}`
      );
    }
  }
}
