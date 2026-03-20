'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@contractspec/lib.ui-kit-web/ui/dialog';
import * as React from 'react';
import { Text, View } from 'react-native';

export function SheetMenu({
	open,
	onOpenChange,
	title = 'Menu',
	children,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	children: React.ReactNode;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>
			<DialogContent>
				<View className="gap-2">
					{typeof children === 'string' ? <Text>{children}</Text> : children}
				</View>
			</DialogContent>
		</Dialog>
	);
}
