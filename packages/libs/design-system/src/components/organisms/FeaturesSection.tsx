import * as React from 'react';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cva } from 'class-variance-authority';

const sectionVariants = cva('', {
  variants: {
    density: {
      compact: 'py-10',
      comfortable: 'py-12 sm:py-16 lg:py-24',
    },
  },
  defaultVariants: { density: 'comfortable' },
});

export function FeaturesSection({
  title,
  subtitle,
  children,
  className,
  density,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
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
        <VStack className="gap-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="text-muted-foreground mx-auto max-w-2xl text-base">
              {subtitle}
            </p>
          ) : null}
        </VStack>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
