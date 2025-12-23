import * as React from 'react';
import { Button } from '../button';
import { cn } from '../utils';
import { Link } from 'expo-router';

export interface PricingTier {
  name: string;
  price: string;
  tagline?: string;
  features: string[];
  cta?: { label: string; href?: string; onClick?: () => void };
  highlighted?: boolean;
}

export function PricingTable({
  tiers,
  className,
}: {
  tiers: PricingTier[];
  className?: string;
}) {
  return (
    <section className={cn('mx-auto max-w-6xl py-12', className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={cn(
              'flex flex-col rounded-lg border p-6',
              t.highlighted && 'border-primary shadow-lg'
            )}
          >
            <div className="text-muted-foreground mb-2 text-base font-medium">
              {t.name}
            </div>
            <div className="text-3xl font-semibold">{t.price}</div>
            {t.tagline && (
              <div className="text-muted-foreground mt-1 text-base">
                {t.tagline}
              </div>
            )}
            <ul className="mt-4 space-y-2 text-base">
              {t.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="bg-primary mt-1 h-1.5 w-1.5 rounded-full" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {t.cta && (
              <div className="mt-6">
                {t.cta.href ? (
                  <Button className="w-full">
                    <Link href={t.cta.href}>{t.cta.label}</Link>
                  </Button>
                ) : (
                  <Button className="w-full" onPress={t.cta.onClick}>
                    {t.cta.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-6 text-center text-base">
        Usage-based tiers inspired by generous free allowances and per-unit
        pricing.
      </p>
    </section>
  );
}
