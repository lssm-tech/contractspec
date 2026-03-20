'use client';

import { Separator } from '@contractspec/lib.ui-kit-web/ui/separator';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import { Header, type HeaderProps } from './Header';

export interface AppHeaderProps extends HeaderProps {
	breadcrumb?: React.ReactNode;
	toolbarRight?: React.ReactNode;
	className?: string;
}

export function AppHeader({
	breadcrumb,
	toolbarRight,
	className,
	...props
}: AppHeaderProps) {
	return (
		<div
			className={cn(
				'w-full border-b bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60',
				className
			)}
		>
			<div className="mx-auto w-full max-w-7xl px-2 md:px-4">
				<Header {...props} />
				{(breadcrumb || toolbarRight) && (
					<>
						<Separator />
						<div className="flex items-center justify-between gap-3 py-2">
							<div className="min-w-0 overflow-hidden text-ellipsis">
								{breadcrumb}
							</div>
							<div className="flex items-center gap-2">{toolbarRight}</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
