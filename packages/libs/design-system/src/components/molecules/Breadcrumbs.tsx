'use client';

import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Breadcrumb as Root,
} from '@contractspec/lib.ui-kit-web/ui/breadcrumb';
import * as React from 'react';

export interface BreadcrumbItemDef {
	href?: string;
	label: React.ReactNode;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItemDef[] }) {
	if (!items?.length) return null;
	return (
		<Root>
			<BreadcrumbList>
				{items.map((it, idx) => (
					<React.Fragment key={idx}>
						<BreadcrumbItem>
							{it.href ? (
								<BreadcrumbLink href={it.href}>{it.label}</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{it.label}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{idx < items.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Root>
	);
}
