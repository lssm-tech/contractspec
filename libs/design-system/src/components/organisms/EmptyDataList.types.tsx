import * as React from 'react';

export interface EmptyDataListProps {
  emptyListTitle?: React.ReactNode;
  emptyListDescription?: React.ReactNode;
  createButton: React.ReactNode;
  secondaryButton?: React.ReactNode;
  media?: React.ReactNode;
  mediaVariant?: 'default' | 'icon';
  learnMoreHref?: string;
  learnMoreLabel?: React.ReactNode;
  learnMoreEndIcon?: React.ReactNode;
  onLearnMore?: () => void;
  handleLearnMore?: () => void;
  className?: string;
}
