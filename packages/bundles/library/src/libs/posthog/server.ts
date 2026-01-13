import { PostHog } from 'posthog-node';

const posthogKey = process.env.NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

const posthogServer = posthogKey
  ? new PostHog(posthogKey, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

export default posthogServer;
export type PostHogServerInstance = PostHog;
