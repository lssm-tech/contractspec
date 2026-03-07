import { Elysia } from 'elysia';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { markdownHandler } from './handlers/markdown-handler';
import { mcpHandler } from './handlers/mcp-handler';
import { schemaHandler } from './handlers/schema-handler';
import { slackWebhookHandler } from './handlers/slack-webhook-handler';
import { githubWebhookHandler } from './handlers/github-webhook-handler';
import { whatsappWebhookHandler } from './handlers/whatsapp-webhook-handler';
import { channelDispatchHandler } from './handlers/channel-dispatch-handler';
import { startChannelDispatchScheduler } from './handlers/channel-dispatch-scheduler';

// const PORT = process.env.PORT || 8081;

const app = new Elysia()
  .get('/', () => ({
    message: 'ContractSpec Library API',
    endpoints: {
      mcp: {
        docs: '/mcp/docs',
        cli: '/mcp/cli',
      },
      schemas: '/schemas/contractsrc.json',
      markdown: '/mdx/*',
      slackWebhook: '/webhooks/slack/events',
      githubWebhook: '/webhooks/github/events',
      whatsappMetaWebhook: '/webhooks/whatsapp/meta',
      whatsappTwilioWebhook: '/webhooks/whatsapp/twilio',
      channelDispatch: '/internal/channel/dispatch',
    },
  }))
  .use(markdownHandler)
  .use(mcpHandler)
  .use(schemaHandler)
  .use(slackWebhookHandler)
  .use(githubWebhookHandler)
  .use(whatsappWebhookHandler)
  .use(channelDispatchHandler);

startChannelDispatchScheduler();
// .listen(PORT);

appLogger.info(
  `📚 ContractSpec Library API Server running at ${app.server?.hostname}:${app.server?.port}`
);

// Graceful shutdown handling
// process.on('SIGTERM', async () => {
//   appLogger.info('📴 SIGTERM received, shutting down gracefully');
//   await appLogger.flush();
//   process.exit(0);
// });
//
// process.on('SIGINT', async () => {
//   appLogger.info('📴 SIGINT received, shutting down gracefully');
//   await appLogger.flush();
//   process.exit(0);
// });

export type App = typeof app;
export default app;
