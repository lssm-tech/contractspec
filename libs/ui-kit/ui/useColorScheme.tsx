import { useColorScheme as useNativewindColorScheme } from 'nativewind';

const DEFAULT_COLOR_SCHEME = 'light';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  return {
    colorScheme: colorScheme ?? DEFAULT_COLOR_SCHEME,
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  };
}
