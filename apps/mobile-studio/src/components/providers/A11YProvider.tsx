import React from 'react';
import { AccessibilityInfo, PixelRatio } from 'react-native';

interface A11YState {
  reduceMotionEnabled: boolean;
  boldTextEnabled: boolean;
  screenReaderEnabled: boolean;
  textScale: number; // PixelRatio.getFontScale()
  announce: (message: string) => void;
}

const A11YContext = React.createContext<A11YState | null>(null);

export function A11YProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState(false);
  const [boldTextEnabled, setBoldTextEnabled] = React.useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);
  const [textScale, setTextScale] = React.useState(PixelRatio.getFontScale());

  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);
    // isBoldTextEnabled is iOS only; guard with try
    AccessibilityInfo.isBoldTextEnabled?.().then?.(setBoldTextEnabled);
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);

    const rm = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotionEnabled
    );
    // boldTextChanged is iOS-only and not in all RN type defs
    const bt = AccessibilityInfo.addEventListener?.(
      'boldTextChanged' as 'reduceMotionChanged',
      ((enabled: boolean) => setBoldTextEnabled(enabled)) as (
        enabled: boolean
      ) => void
    );
    const sr = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    const handleFontScale = () => setTextScale(PixelRatio.getFontScale());
    // Note: announcementFinished doesn't actually fire on font scale change,
    // this is listening for any accessibility announcement to trigger a scale check
    const fs = AccessibilityInfo.addEventListener(
      'announcementFinished',
      handleFontScale as unknown as (event: {
        announcement: string;
        success: boolean;
      }) => void
    );

    return () => {
      rm?.remove?.();
      bt?.remove?.();
      sr?.remove?.();
      fs?.remove?.();
    };
  }, []);

  const announce = React.useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const value = React.useMemo<A11YState>(
    () => ({
      reduceMotionEnabled,
      boldTextEnabled,
      screenReaderEnabled,
      textScale,
      announce,
    }),
    [
      reduceMotionEnabled,
      boldTextEnabled,
      screenReaderEnabled,
      textScale,
      announce,
    ]
  );

  return <A11YContext.Provider value={value}>{children}</A11YContext.Provider>;
}

export function useA11Y() {
  const ctx = React.useContext(A11YContext);
  if (!ctx) throw new Error('useA11Y must be used within A11YProvider');
  return ctx;
}
