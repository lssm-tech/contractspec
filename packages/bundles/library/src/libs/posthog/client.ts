import posthog from 'posthog-js';

export type PostHogInstance = typeof posthog;

export const analyticsEventNames = {
  CTA_INSTALL_CLICK: 'cta_install_click',
  CTA_STUDIO_CLICK: 'cta_studio_click',
  DOCS_QUICKSTART_VIEW: 'docs_quickstart_view',
  COPY_COMMAND_CLICK: 'copy_command_click',
  EXAMPLE_REPO_OPEN: 'example_repo_open',
} as const;

export type AnalyticsEventName =
  (typeof analyticsEventNames)[keyof typeof analyticsEventNames];

export const posthogKey = process.env.NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY;
export const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com';

const shouldCaptureAnalytics = () => {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & {
    msDoNotTrack?: string;
  };
  const dntWindow = window as Window & {
    doNotTrack?: string;
  };
  const dnt = nav.doNotTrack ?? nav.msDoNotTrack ?? dntWindow.doNotTrack;
  return dnt !== '1' && dnt !== 'yes';
};

export function initPosthog() {
  if (typeof window === 'undefined') return;
  if (!posthogKey) {
    console.warn('[PostHog] NEXT_PUBLIC_CONTRACTSPEC_POSTHOG_KEY is missing');
    return;
  }
  if (!shouldCaptureAnalytics()) return;

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
}

export function captureAnalyticsEvent(
  event: AnalyticsEventName,
  properties?: Record<string, unknown>
) {
  if (!posthogKey) return;
  if (!shouldCaptureAnalytics()) return;
  try {
    const globalPosthog = (globalThis as { posthog?: PostHogInstance }).posthog;
    const instance = globalPosthog ?? posthog;
    instance?.capture?.(event, properties);
  } catch {
    return;
  }
}

export { posthog };
export default posthog;
