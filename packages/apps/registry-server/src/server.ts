import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { elysiaLogger, Logger, LogLevel } from '@lssm/lib.logger';
import {
  buildLssmItemJson,
  buildLssmManifestJson,
} from './handlers/lssm-handler';
import {
  buildContractSpecItemJson,
  readContractSpecManifest,
} from './handlers/contractspec-handler';

const PORT = Number(process.env.PORT ?? 8090);

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment: process.env.NODE_ENV || 'development',
  enableTracing: true,
  enableTiming: true,
  enableContext: true,
  enableColors: process.env.NODE_ENV !== 'production',
});

export const app = new Elysia()
  .use(cors())
  .use(
    elysiaLogger({
      logger,
      logRequests: true,
      logResponses: true,
      excludePaths: ['/health', '/healthz', '/favicon.ico'],
    })
  )
  .use(serverTiming())
  .get('/health', () => ({ status: 'healthy' }))
  .get('/healthz', () => ({ status: 'healthy' }))
  .get('/', () => ({
    name: 'lssm-registry-server',
    routes: {
      lssmManifest: '/r/lssm.json',
      lssmItem: '/r/lssm/:name',
      contractspecManifest: '/r/contractspec.json',
      contractspecItem: '/r/contractspec/:type/:name',
    },
  }))
  .get('/r/lssm.json', async ({ set }) => {
    try {
      return await buildLssmManifestJson(logger);
    } catch (error) {
      set.status = 500;
      return {
        error: 'Failed to load LSSM registry manifest',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  })
  .get('/r/lssm/:name', async ({ params, set }) => {
    try {
      return await buildLssmItemJson(params.name, logger);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      set.status = msg.includes('not found') ? 404 : 500;
      return {
        error: 'Failed to build LSSM registry item',
        message: msg,
      };
    }
  })
  .get('/r/contractspec.json', async ({ set }) => {
    try {
      return await readContractSpecManifest(logger);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      set.status = msg.includes('ENOENT') ? 404 : 500;
      return {
        error: 'Failed to load ContractSpec registry manifest',
        message: msg,
        hint: 'Run the contracts registry build step to generate packages/libs/contracts/registry/registry.json',
      };
    }
  })
  .get('/r/contractspec/:type/:name', async ({ params, set }) => {
    try {
      return await buildContractSpecItemJson(params.type, params.name, logger);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      set.status = msg.includes('not found') ? 404 : 500;
      return {
        error: 'Failed to build ContractSpec registry item',
        message: msg,
      };
    }
  })
  .listen(PORT);

logger.info('registry-server.started', {
  port: PORT,
  endpoints: {
    health: '/health',
    lssm: { manifest: '/r/lssm.json', item: '/r/lssm/:name' },
    contractspec: {
      manifest: '/r/contractspec.json',
      item: '/r/contractspec/:type/:name',
    },
  },
});

export type App = typeof app;
