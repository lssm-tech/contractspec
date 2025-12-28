import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardTitle,
  type MarketingCardTone,
} from './MarketingCard';

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

const layoutVariants = cva('w-full', {
  variants: {
    variant: {
      iconFirst: 'space-y-3',
      listing: '',
      support: '',
    },
  },
  defaultVariants: { variant: 'iconFirst' },
});

export type MarketingIconCardVariant = VariantProps<
  typeof layoutVariants
>['variant'];

interface MarketingIconCardProps {
  icon: IconComponent;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: MarketingCardTone;
  iconClassName?: string;
  headerAction?: React.ReactNode;
  variant?: MarketingIconCardVariant;
  className?: string;
}

export function MarketingIconCard({
  icon: Icon,
  title,
  description,
  tone = 'default',
  iconClassName,
  headerAction,
  variant = 'iconFirst',
  className,
}: MarketingIconCardProps) {
  return (
    <MarketingCard tone={tone} className={className}>
      <MarketingCardContent className={layoutVariants({ variant })}>
        {variant === 'iconFirst' ? (
          <VStack gap="sm" align="start">
            <HStack
              gap="sm"
              align="center"
              justify="between"
              className="w-full"
            >
              <Icon className={iconClassName} size={24} />
              {headerAction}
            </HStack>
            <MarketingCardTitle className="text-xl">{title}</MarketingCardTitle>
            {description ? (
              <Muted className="text-sm leading-relaxed">{description}</Muted>
            ) : null}
          </VStack>
        ) : (
          <HStack gap="md" align="start">
            <Icon
              className={iconClassName}
              size={variant === 'listing' ? 18 : 20}
            />
            <VStack gap="xs" align="start">
              <MarketingCardTitle className="text-base font-semibold">
                {title}
              </MarketingCardTitle>
              {description ? (
                <Muted className="text-sm leading-relaxed">{description}</Muted>
              ) : null}
              {headerAction ? <Small>{headerAction}</Small> : null}
            </VStack>
          </HStack>
        )}
      </MarketingCardContent>
    </MarketingCard>
  );
}
