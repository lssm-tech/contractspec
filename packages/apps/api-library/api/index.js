let appPromise;

function getApp() {
  if (appPromise) return appPromise;

  if (process.env.CONTRACTSPEC_MCP_STATEFUL === '1') {
    console.warn(
      '[api-library] CONTRACTSPEC_MCP_STATEFUL=1 is not supported on Node runtime; forcing stateless MCP mode.'
    );
  }

  process.env.CONTRACTSPEC_MCP_STATEFUL = '0';

  appPromise = import('../dist/index.js').then((mod) => {
    if (!mod?.default || typeof mod.default.handle !== 'function') {
      throw new Error('Invalid app export from dist/index.js');
    }

    return mod.default;
  });

  return appPromise;
}

function buildUrl(req) {
  const host = req.headers.host ?? 'localhost';
  return new URL(req.url ?? '/', `https://${host}`).toString();
}

async function toRequest(req) {
  const method = req.method ?? 'GET';
  if (method === 'GET' || method === 'HEAD') {
    return new Request(buildUrl(req), { method, headers: req.headers });
  }

  return new Request(buildUrl(req), {
    method,
    headers: req.headers,
    body: req,
    duplex: 'half',
  });
}

export default async function handler(req, res) {
  try {
    const app = await getApp();
    const request = await toRequest(req);
    const response = await app.handle(request);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
  } catch (error) {
    console.error('[api-library] request handling failed', {
      method: req?.method,
      url: req?.url,
      error:
        error instanceof Error ? (error.stack ?? error.message) : String(error),
    });

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=utf-8');
    }

    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
