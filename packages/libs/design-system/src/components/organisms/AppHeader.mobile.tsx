'use client';

import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@lssm/lib.ui-kit/ui/utils';
import { SheetMenu } from '../native/SheetMenu.mobile';
import { BottomTabs, type BottomTabItem } from '../native/BottomTabs.mobile';

export interface AppHeaderMobileProps {
  logo?: React.ReactNode; // typically a brand component
  toolbarRight?: React.ReactNode;
  className?: string;
  menuContent?: React.ReactNode; // sheet menu content
  bottomTabs?: BottomTabItem[];
}

export function AppHeader({
  logo,
  toolbarRight,
  className,
  menuContent,
  bottomTabs,
}: AppHeaderMobileProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <View className={cn('bg-background border-b', className)}>
      <View className="flex-row items-center justify-between px-3 py-2">
        <Pressable accessibilityLabel="Open menu" onPress={() => setOpen(true)}>
          <Text className="text-lg">☰</Text>
        </Pressable>
        <View className="px-2">
          {typeof logo === 'string' ? (
            <Text className="text-xl font-bold">{logo}</Text>
          ) : (
            logo
          )}
        </View>
        <View className="flex-row items-center gap-2">{toolbarRight}</View>
      </View>

      {bottomTabs && bottomTabs.length > 0 && <BottomTabs items={bottomTabs} />}

      <SheetMenu open={open} onOpenChange={setOpen} title="Menu">
        {menuContent}
      </SheetMenu>
    </View>
  );
}
