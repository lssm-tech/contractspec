import * as React from 'react';
import { Hero } from '@contractspec/lib.ui-kit-web/ui/marketing/Hero';
import { cva } from 'class-variance-authority';

const sectionVariants = cva(
  'relative overflow-hidden bg-linear-to-b from-background to-muted/20',
  {
    variants: {
      density: {
        compact: 'py-12',
        comfortable: 'py-16 sm:py-24 lg:py-32',
      },
    },
    defaultVariants: { density: 'comfortable' },
  }
);

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
  density,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: { label: string; href?: string; onClick?: () => void };
  secondaryCta?: { label: string; href?: string; onClick?: () => void };
  className?: string;
  density?: 'compact' | 'comfortable';
}) {
  return (
    <section
      className={[sectionVariants({ density }), className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero
          title={title}
          subtitle={subtitle}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />
      </div>
    </section>
  );
}
