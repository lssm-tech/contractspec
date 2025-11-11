import type { NextApiRequest, NextApiResponse } from 'next';
import { createFetchHandler, type RestOptions } from './rest-generic';
import type { SpecRegistry } from '../registry';
import type { HandlerCtx } from '../types';

export function makeNextPagesHandler(
  reg: SpecRegistry,
  ctxFactory: (req: NextApiRequest) => HandlerCtx,
  options?: RestOptions
) {
  const fetchHandler = createFetchHandler(
    reg,
    (_req: Request) => {
      throw new Error('Use per-request wrapper'); // we wrap below
    },
    options
  );

  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = `${req.headers['x-forwarded-proto'] ?? 'http'}://${req.headers.host}${req.url}`;
    const method = req.method?.toUpperCase() || 'GET';

    const request = new Request(url, {
      method,
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [k, String(v)])
      ),
      body: method === 'POST' ? JSON.stringify(req.body ?? {}) : undefined,
    });

    const perReqHandler = createFetchHandler(
      reg,
      () => ctxFactory(req),
      options
    );
    const response = await perReqHandler(request);

    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    const text = await response.text();
    res.send(text);
  };
}
