import * as React from 'react';
import {
  MarketingCardsSection,
  MarketingIconCard,
  type MarketingCardTone,
  type MarketingSectionPadding,
  type MarketingSectionTone,
} from '@lssm/lib.design-system';
import { Muted } from '@lssm/lib.ui-kit-web/ui/typography';

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

export interface IconGridItem {
  icon: IconComponent;
  title: string;
  description: string;
  iconClassName?: string;
  tone?: MarketingCardTone;
}

interface IconGridSectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: IconGridItem[];
  tone?: MarketingSectionTone;
  padding?: MarketingSectionPadding;
  columns?: 2 | 3 | 4;
}

export function IconGridSection({
  eyebrow,
  title,
  subtitle,
  items,
  tone = 'default',
  padding,
  columns = 3,
}: IconGridSectionProps) {
  return (
    <MarketingCardsSection
      tone={tone}
      padding={padding}
      eyebrow={
        eyebrow ? (
          <Muted className="text-xs font-semibold uppercase tracking-[0.2em]">
            {eyebrow}
          </Muted>
        ) : null
      }
      title={title}
      subtitle={subtitle ? <Muted className="text-lg">{subtitle}</Muted> : null}
      columns={columns}
    >
      {items.map((card) => (
        <MarketingIconCard
          key={card.title}
          icon={card.icon}
          title={card.title}
          description={card.description}
          tone={card.tone}
          iconClassName={card.iconClassName}
        />
      ))}
    </MarketingCardsSection>
  );
}
