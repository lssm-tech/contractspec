'use client';

import React from 'react';

export type TextSize = 's' | 'm' | 'l' | 'xl';
export type TextSpacing = 'normal' | 'increased';
export type LineHeight = 'normal' | 'increased';
export type UnderlineLinks = boolean;
export type FocusRing = 'normal' | 'thick';
export type ReduceMotion = 'system' | 'reduce' | 'no-preference';
export type HighContrast = boolean;
export type DyslexiaFont = boolean;

export interface AccessibilityPreferences {
  textSize: TextSize;
  textSpacing: TextSpacing;
  lineHeight: LineHeight;
  underlineLinks: UnderlineLinks;
  focusRing: FocusRing;
  reduceMotion: ReduceMotion;
  highContrast: HighContrast;
  dyslexiaFont: DyslexiaFont;
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  textSize: 'm',
  textSpacing: 'normal',
  lineHeight: 'normal',
  underlineLinks: false,
  focusRing: 'normal',
  reduceMotion: 'system',
  highContrast: false,
  dyslexiaFont: false,
};

const STORAGE_KEY = 'a11y:preferences:v1';

function getStoredPreferences(): AccessibilityPreferences | null {
  try {
    const raw =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed } as AccessibilityPreferences;
  } catch {
    return null;
  }
}

function savePreferences(prefs: AccessibilityPreferences) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }
  } catch {
    // ignore
  }
}

function applyCssVariables(prefs: AccessibilityPreferences) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  // Type scale (base multiplier)
  const sizeMap: Record<TextSize, string> = {
    s: '0.95',
    m: '1',
    l: '1.1',
    xl: '1.25',
  };
  root.style.setProperty('--a11y-text-scale', sizeMap[prefs.textSize]);
  // Target size: increase on larger text choices
  const targetMin =
    prefs.textSize === 'l' || prefs.textSize === 'xl' ? '44px' : '0px';
  root.style.setProperty('--a11y-target-min', targetMin);

  // Spacing per WCAG 1.4.12
  root.style.setProperty(
    '--a11y-letter-spacing',
    prefs.textSpacing === 'increased' ? '0.12em' : 'normal'
  );
  root.style.setProperty(
    '--a11y-word-spacing',
    prefs.textSpacing === 'increased' ? '0.16em' : 'normal'
  );
  root.style.setProperty(
    '--a11y-line-height',
    prefs.lineHeight === 'increased' ? '1.6' : '1.5'
  );

  // Links
  root.style.setProperty(
    '--a11y-underline-links',
    // Use 'revert' so we don't override the site's default when disabled
    prefs.underlineLinks ? 'underline' : 'revert'
  );

  // Focus ring
  root.style.setProperty(
    '--a11y-focus-ring-width',
    prefs.focusRing === 'thick' ? '4px' : '2px'
  );

  // Reduce motion
  root.style.setProperty('--a11y-reduce-motion', prefs.reduceMotion);

  // Contrast
  root.style.setProperty(
    '--a11y-contrast-mode',
    prefs.highContrast ? 'high' : 'normal'
  );
  if (prefs.highContrast) {
    root.setAttribute('data-contrast', 'high');
  } else {
    root.removeAttribute('data-contrast');
  }

  // Dyslexia-friendly font (consumer should map to an available font family)
  root.style.setProperty(
    '--a11y-font-family-alt-enabled',
    prefs.dyslexiaFont ? '1' : '0'
  );

  // Inline fallbacks in case global CSS variables are not wired/included by the app bundler.
  // These properties are inheritable, so setting them on <body> yields broad coverage.
  if (body) {
    if (prefs.textSpacing === 'increased') {
      body.style.letterSpacing = '0.12em';
      body.style.wordSpacing = '0.16em';
    } else {
      body.style.letterSpacing = '';
      body.style.wordSpacing = '';
    }

    body.style.lineHeight = prefs.lineHeight === 'increased' ? '1.6' : '';
  }
}

interface PreferencesContextValue {
  preferences: AccessibilityPreferences;
  setPreferences: (
    updater:
      | Partial<AccessibilityPreferences>
      | ((p: AccessibilityPreferences) => AccessibilityPreferences)
  ) => void;
}

const PreferencesContext = React.createContext<PreferencesContextValue | null>(
  null
);

export function useA11YPreferences() {
  const ctx = React.useContext(PreferencesContext);
  if (!ctx)
    throw new Error(
      'useA11YPreferences must be used within A11YPreferencesProvider'
    );
  return ctx;
}

export function A11YPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferencesState] =
    React.useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = getStoredPreferences();
    const next = stored ?? DEFAULT_PREFERENCES;
    setPreferencesState(next);
    setHydrated(true);
    applyCssVariables(next);
  }, []);

  const setPreferences = React.useCallback<
    PreferencesContextValue['setPreferences']
  >((updater) => {
    setPreferencesState((prev) => {
      const next =
        typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      savePreferences(next);
      applyCssVariables(next);
      try {
        if (typeof window !== 'undefined') {
          const changed: Partial<AccessibilityPreferences> = {};
          for (const key of Object.keys(
            next
          ) as (keyof AccessibilityPreferences)[]) {
            if (next[key] !== prev[key]) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              changed[key] = next[key] as any;
            }
          }
          window.dispatchEvent(
            new CustomEvent('a11y:pref_changed', {
              detail: {
                previous: prev,
                current: next,
                changed,
              },
            })
          );
        }
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ preferences, setPreferences }),
    [preferences, setPreferences]
  );

  return (
    <PreferencesContext value={value}>
      {children}
      {!hydrated ? null : null}
    </PreferencesContext>
  );
}

// Helper to compute className additions that respect tokens (optional)
export function a11yRootClassName() {
  return 'a11y-root';
}
