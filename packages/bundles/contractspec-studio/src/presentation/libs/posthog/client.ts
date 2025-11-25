import posthog from 'posthog-js';

export type PostHogInstance = typeof posthog;

let isInitialized = false;

export const posthogKey = process.env.NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY;
export const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

export function initPosthog() {
  if (typeof window === 'undefined' || isInitialized) return;

  const posthogKey = process.env.NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY;
  const posthogHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

  if (!posthogKey) {
    console.warn('[PostHog] NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY is missing');
    return;
  }

  const isDev = process.env.NODE_ENV === 'development';

  posthog.init(posthogKey, {
    api_host: posthogHost,
    autocapture: !isDev,
    capture_dead_clicks: !isDev,
    capture_performance: !isDev,
    capture_pageview: !isDev,
    capture_heatmaps: !isDev,
    capture_exceptions: !isDev,
    debug: process.env.NODE_ENV === 'development',
  });

  isInitialized = true;
}

export { posthog };
export default posthog;
