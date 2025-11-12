export interface SkeletonCircleProps {
  // Tailwind size class, e.g., 'w-8 h-8' or single size token like 'size-8'
  sizeClass?: string; // if provided takes precedence
  size?: number; // px fallback
  className?: string;
}
