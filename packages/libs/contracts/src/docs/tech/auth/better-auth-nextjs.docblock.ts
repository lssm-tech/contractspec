import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_auth_better_auth_nextjs_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.auth.better-auth-nextjs',
    title: 'Better Auth + Next.js integration (ContractSpec)',
    summary:
      'How ContractSpec wires Better Auth into Next.js (server config, client singleton, and proxy cookie-only redirects).',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/auth/better-auth-nextjs',
    tags: ['auth', 'better-auth', 'nextjs', 'cookies', 'proxy', 'hmr'],
    body: `# Better Auth + Next.js integration (ContractSpec)

This repo uses Better Auth as the primary auth layer (sessions, organizations, teams, API keys, and OAuth).

## Server config (Better Auth)

- Source: \`packages/bundles/contractspec-studio/src/application/services/auth.ts\`
- Important: \`nextCookies()\` must be the **last** plugin in the Better Auth plugin list so \`Set-Cookie\` is applied correctly in Next.js environments.

## Better Auth Admin plugin

ContractSpec Studio enables the Better Auth **Admin plugin** to support platform-admin user operations (list users, impersonation, etc.).

- Server: \`admin()\` plugin in \`packages/bundles/contractspec-studio/src/application/services/auth.ts\`
- Client: \`adminClient()\` in \`packages/bundles/contractspec-studio/src/presentation/providers/auth/client.ts\`

### PLATFORM_ADMIN ⇒ Better Auth admin role

Better Auth Admin endpoints authorize via \`user.role\`. ContractSpec enforces an org-driven rule:

- If the **active organization** has \`type = PLATFORM_ADMIN\`, the signed-in user is ensured to have \`User.role\` containing \`admin\`.
- This is applied in the session creation hook and re-checked in \`assertsPlatformAdmin()\`.

This keeps admin enablement deterministic and avoids manual role backfills.

## Client config (React web + Expo)

To avoid duplicate background refresh/polling loops in dev (Fast Refresh/HMR), the Better Auth client is implemented as a singleton cached on \`globalThis\`.

- Web client: \`packages/bundles/contractspec-studio/src/presentation/providers/auth/client.ts\`
- Native client: \`packages/bundles/contractspec-studio/src/presentation/providers/auth/client.native.ts\`

Import guidance:

- If you only need the context/hook, prefer importing from \`@lssm/bundle.contractspec-studio/presentation/providers/auth\`.
- If you explicitly need the Better Auth client instance (e.g. admin impersonation, direct API calls), import from \`@lssm/bundle.contractspec-studio/presentation/providers/auth/client\`.

## Public routes (login / signup)

Public auth pages should avoid eager \`authClient\` initialization.

Pattern used:

- In the submit handler, dynamically import \`@lssm/bundle.contractspec-studio/presentation/providers/auth/index.web\` and call \`authClient.signIn.*\` / \`authClient.signUp.*\`.

This prevents session refresh behavior from starting just because a public page rendered.

## Next.js proxy auth (web-landing)

The Next.js proxy/middleware is used for **redirect decisions only**. It must not perform DB-backed session reads on every request.

- Source: \`packages/apps/web-landing/src/proxy.ts\`
- Approach: cookie-only checks via Better Auth cookies helpers:
  - \`getSessionCookie(request)\`
  - \`getCookieCache(request)\`

These checks are intentionally optimistic and should only gate routing. Full authorization must still be enforced on server-side actions/routes and GraphQL resolvers.
`,
  },
];

registerDocBlocks(tech_auth_better_auth_nextjs_DocBlocks);
