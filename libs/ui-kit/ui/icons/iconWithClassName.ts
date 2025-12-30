import type { LucideIcon } from 'lucide-react-native';
import { styled } from 'nativewind';

export function iconWithClassName(icon: LucideIcon) {
  styled(icon, {
    className: {
      target: 'style',
      nativeStyleMapping: {
        color: true,
        opacity: true,
      },
    },
  });
}
