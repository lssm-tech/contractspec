import { PostHog } from 'posthog-react-native';

export type PostHogInstance = typeof PostHog;

export const posthogKey = process.env.NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY;
export const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

export function initPosthog() {
  const posthogKey = process.env.NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY;
  const posthogHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

  if (!posthogKey) {
    console.warn('[PostHog] NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY is missing');
    throw new Error('NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY is missing');
  }

  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    // autocapture: !isDev,
    // capture_dead_clicks: !isDev,
    // capture_performance: !isDev,
    // capture_pageview: !isDev,
    // capture_heatmaps: !isDev,
    // capture_exceptions: !isDev,
    // debug: process.env.NODE_ENV === 'development',
  });

  return posthog;
}

const posthog = initPosthog();
export { posthog };
