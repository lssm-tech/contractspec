/**
 * Example OAuth callback handler for Powens (read-only open banking).
 *
 * This example assumes:
 * - You stored the Powens redirect `state` parameter when generating the
 *   authorisation URL. The state maps back to an integration connection record.
 * - Secrets (clientId/clientSecret/apiKey/webhookSecret) are managed via the
 *   ContractSpec secret provider abstraction.
 * - After linking, you kick off the canonical sync workflow to hydrate accounts.
 */
export { powensOAuthCallbackHandler } from './src/handlers/oauth-callback';

