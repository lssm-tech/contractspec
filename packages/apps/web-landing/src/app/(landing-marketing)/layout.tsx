import { MarketingLayout } from '@contractspec/lib.design-system';
import { Analytics } from '@vercel/analytics/next';
import type React from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import '@/instrumentation-client';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<MarketingLayout header={<Header />} footer={<Footer />}>
			{children}
			<Analytics />
		</MarketingLayout>
	);
}
