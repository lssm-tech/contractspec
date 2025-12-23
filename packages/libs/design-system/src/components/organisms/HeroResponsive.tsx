'use client';

import * as React from 'react';
import { HeroSection } from './HeroSection';
import { useResponsive } from '../../platform/useResponsive';

export function HeroResponsive({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}: React.ComponentProps<typeof HeroSection>) {
  const { screen } = useResponsive();
  const spacing =
    screen === 'desktop' ? 'gap-6' : screen === 'tablet' ? 'gap-4' : 'gap-3';
  const size =
    screen === 'desktop'
      ? 'text-5xl'
      : screen === 'tablet'
        ? 'text-4xl'
        : 'text-3xl';
  return (
    <HeroSection
      title={<div className={`${size}`}>{title}</div>}
      subtitle={subtitle}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      className={[className, spacing].filter(Boolean).join(' ')}
    />
  );
}
