import * as React from 'react';
import { Button } from '../button';
import { cn } from '../utils';
import { Link } from 'expo-router';

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: { label: string; href?: string; onClick?: () => void };
  secondaryCta?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}) {
  return (
    <section className={cn('mx-auto max-w-4xl py-16 text-center', className)}>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          {subtitle}
        </p>
      )}
      {(primaryCta || secondaryCta) && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {primaryCta &&
            (primaryCta.href ? (
              <Button size="lg">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : (
              <Button size="lg" onPress={primaryCta.onClick}>
                {primaryCta.label}
              </Button>
            ))}
          {secondaryCta &&
            (secondaryCta.href ? (
              <Button variant="outline" size="lg">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onPress={secondaryCta.onClick}
              >
                {secondaryCta.label}
              </Button>
            ))}
        </div>
      )}
    </section>
  );
}
