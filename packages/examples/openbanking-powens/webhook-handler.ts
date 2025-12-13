/**
 * Example Powens webhook handler (Next.js / edge runtime ready).
 *
 * Powens delivers events (connection updates, transaction notifications, etc.)
 * to the webhook URL you configure on the integration. Use the shared webhook
 * secret to verify authenticity, then enqueue the appropriate ContractSpec
 * workflows so the canonical ledger stays in sync.
 */
export { powensWebhookHandler } from './src/handlers/webhook-handler';





