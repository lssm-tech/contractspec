'use client';

import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import type { BadgeDisplayProps } from '../types';

const BADGE_ICONS: Record<string, string> = {
  studio_first_30m: '🎯',
  platform_tour: '🗺️',
  crm_first_win: '🏆',
  drill_master: '🧠',
  coach_listener: '👂',
  quest_complete: '⭐',
  streak_7: '🔥',
  streak_30: '💎',
  default: '🏅',
};

const sizeStyles = {
  sm: 'h-6 w-6 text-sm',
  md: 'h-8 w-8 text-base',
  lg: 'h-10 w-10 text-lg',
};

export function BadgeDisplay({
  badges,
  maxVisible = 5,
  size = 'md',
}: BadgeDisplayProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const hiddenCount = badges.length - maxVisible;

  if (badges.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">No badges earned yet</div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {visibleBadges.map((badge) => (
        <div
          key={badge}
          className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20',
            sizeStyles[size]
          )}
          title={badge.replace(/_/g, ' ')}
        >
          {BADGE_ICONS[badge] ?? BADGE_ICONS.default}
        </div>
      ))}
      {hiddenCount > 0 && (
        <div
          className={cn(
            'text-muted-foreground bg-muted flex items-center justify-center rounded-full',
            sizeStyles[size],
            'text-xs font-medium'
          )}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
}
