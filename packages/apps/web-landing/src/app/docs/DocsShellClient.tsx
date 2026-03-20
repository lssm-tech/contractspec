'use client';

import {
	SidebarInset,
	SidebarProvider,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import type React from 'react';
import { DocsNavSidebar } from '@/app/docs/DocsNavSidebar';
import { DocsPageFooterNav } from '@/app/docs/DocsPageFooterNav';
import Footer from '@/components/footer';
import { OpenWithAI } from '@/components/open-with-ai';

export default function DocsShellClient({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<DocsNavSidebar />

			<SidebarInset>
				<main className="flex-1 overflow-hidden">
					<div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
						<div className="docs-shell-note">
							<div>
								<p className="font-mono text-[11px] text-[color:var(--rust)] uppercase tracking-[0.22em]">
									OSS-first docs
								</p>
								<p className="mt-2 max-w-3xl text-muted-foreground text-sm leading-6">
									These docs teach the open system first: contracts, generated
									surfaces, runtimes, governance, and incremental adoption.
									Studio shows up as the operating layer on top, not as the
									source of truth.
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-3">
								<a href="/llms.txt" className="docs-chip-link">
									AI index
								</a>
								<OpenWithAI />
							</div>
						</div>
						<div className="docs-page-body">{children}</div>
						<DocsPageFooterNav />
					</div>
				</main>

				<Footer />
			</SidebarInset>
		</SidebarProvider>
	);
}
