import type React from 'react';
import { BreadcrumbStructuredData } from '@/components/structured-data';
import DocsShellClient from './DocsShellClient';

export const dynamic = 'force-static';

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const breadcrumbs = [
		{ name: 'Home', url: 'https://www.contractspec.io' },
		{ name: 'Documentation', url: 'https://www.contractspec.io/docs' },
	];

	return (
		<>
			<BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
			<DocsShellClient>{children}</DocsShellClient>
		</>
	);
}
