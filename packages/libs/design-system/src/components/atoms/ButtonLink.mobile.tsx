import * as React from 'react';
import { Button, type ButtonProps } from './Button.mobile';
import { Linking } from 'react-native';

export type ButtonLinkProps = Omit<ButtonProps, 'onPress'> & {
  href: string;
  replace?: boolean;
};

export function ButtonLink({
  href,
  replace,
  loading,
  disabled,
  onPressIn,
  onPressOut,
  ...btn
}: ButtonLinkProps) {
  const blocked = Boolean(disabled || loading);
  const handlePress = React.useCallback(() => {
    if (blocked) return;
    try {
      // Prefer expo-router Link via dynamic require if available
      const ExpoRouter = require('expo-router');
      if (ExpoRouter?.Link) {
        // If Link is available, we can't render it here without asChild; fallback to router.navigate
        const router = ExpoRouter.router ?? ExpoRouter.useRouter?.();
        if (router?.replace && replace) router.replace(href);
        else if (router?.push) router.push(href);
        else Linking.openURL(href);
        return;
      }
    } catch {}
    Linking.openURL(href);
  }, [blocked, href, replace]);

  return (
    <Button
      {...btn}
      onPress={handlePress}
      loading={loading}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {btn.children}
    </Button>
  );
}

export default ButtonLink;
