import React, { useMemo } from 'react';
import { HStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Button } from '@contractspec/lib.design-system';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { i18n } from '@contractspec/lib.translation-studio/native';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const current = i18n.language?.split('-')[0] || 'fr';
  const langs = useMemo(() => ['fr', 'en'] as const, []);
  return (
    <HStack className={compact ? '' : 'gap-2'}>
      {langs.map((lng) => (
        <Button
          key={lng}
          size={compact ? 'sm' : 'default'}
          variant={current === lng ? 'default' : 'outline'}
          onPress={() => i18n.changeLanguage(lng)}
        >
          <Text>{lng.toUpperCase()}</Text>
        </Button>
      ))}
    </HStack>
  );
}
