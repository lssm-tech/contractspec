import { SkeletonList as UISkeletonList } from '@contractspec/lib.ui-kit-web/ui/molecules/SkeletonList';
import type { SkeletonListProps } from './types';

export function SkeletonList({ count = 10, className }: SkeletonListProps) {
  return <UISkeletonList count={count} className={className} />;
}
