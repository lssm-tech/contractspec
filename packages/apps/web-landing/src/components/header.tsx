'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import appLogo from '../../public/logo-no-bg.png';

const navItems = [
	{ label: 'Product', href: '/product' },
	{ label: 'Templates', href: '/templates' },
	{ label: 'Pricing', href: '/pricing' },
	{ label: 'Docs', href: '/docs' },
	{ label: 'Changelog', href: '/changelog' },
	{ label: 'GitHub', href: 'https://github.com/lssm-tech/contractspec' },
];

function handleInstallClick() {
	captureAnalyticsEvent(analyticsEventNames.CTA_INSTALL_CLICK, {
		surface: 'header',
	});
}

function handleStudioClick() {
	captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
		surface: 'header',
	});
}

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-border/80 border-b bg-[rgb(251_247_240_/_0.88)] backdrop-blur-xl">
			<div className="editorial-shell px-4 py-4 md:px-6 lg:px-8">
				<div className="flex items-center justify-between gap-6">
					<Link href="/" className="flex items-center gap-3">
						<Image src={appLogo} alt="ContractSpec" className="h-10 w-10" />
						<div className="flex flex-col">
							<span className="font-semibold text-sm uppercase tracking-[0.08em]">
								ContractSpec
							</span>
							<span className="text-muted-foreground text-xs">
								Open spec system
							</span>
						</div>
					</Link>

					<nav className="hidden items-center gap-6 lg:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-muted-foreground text-sm hover:text-foreground"
								target={item.href.startsWith('http') ? '_blank' : undefined}
								rel={
									item.href.startsWith('http')
										? 'noopener noreferrer'
										: undefined
								}
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="hidden items-center gap-3 lg:flex">
						<Link
							href="https://www.contractspec.studio"
							className="btn-ghost"
							onClick={handleStudioClick}
						>
							Explore Studio
						</Link>
						<Link
							href="/install"
							className="btn-primary"
							onClick={handleInstallClick}
						>
							Start with OSS
						</Link>
					</div>

					<details className="group lg:hidden">
						<summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-foreground text-sm">
							<Menu size={16} />
							Menu
						</summary>
						<div className="absolute top-full right-4 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-[28px] border border-border bg-card p-5 shadow-[0_25px_80px_rgb(36_26_16_/_0.1)]">
							<div className="space-y-4">
								<p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
									Choose your entry point
								</p>
								<div className="grid gap-3">
									{navItems.map((item) => (
										<Link
											key={item.href}
											href={item.href}
											className="rounded-2xl border border-border/70 px-4 py-3 text-sm hover:bg-muted"
											target={
												item.href.startsWith('http') ? '_blank' : undefined
											}
											rel={
												item.href.startsWith('http')
													? 'noopener noreferrer'
													: undefined
											}
										>
											{item.label}
										</Link>
									))}
								</div>
								<div className="grid gap-3">
									<Link
										href="/install"
										className="btn-primary w-full"
										onClick={handleInstallClick}
									>
										Start with OSS
									</Link>
									<Link
										href="https://www.contractspec.studio"
										className="btn-ghost w-full"
										onClick={handleStudioClick}
									>
										Explore Studio
									</Link>
								</div>
							</div>
						</div>
					</details>
				</div>
			</div>
		</header>
	);
}
