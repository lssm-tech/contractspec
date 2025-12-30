/**
 * Toast utilities (platform-aware)
 *
 * Next.js compatibility: Uses `burnt` on React Native. In web/SSR contexts,
 * falls back to console logs to avoid runtime errors.
 */
import * as Burnt from 'burnt';
import { Platform } from 'react-native';

interface ToastOptions {
  title: string;
  description?: string;
}

export const toastError = (options: ToastOptions) => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Burnt.toast({
      title: options.title,
      message: options.description,
      preset: 'error',
    });
  } else if (typeof window !== 'undefined') {
    console.error(
      `[toast:error] ${options.title}${options.description ? `: ${options.description}` : ''}`
    );
  }
};

export const toastDone = (options: ToastOptions) => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Burnt.toast({
      title: options.title,
      message: options.description,
      preset: 'done',
    });
  } else if (typeof window !== 'undefined') {
    console.info(
      `[toast:done] ${options.title}${options.description ? `: ${options.description}` : ''}`
    );
  }
};
