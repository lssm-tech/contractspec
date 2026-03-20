'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import type { HeaderNavItem } from '@contractspec/lib.design-system';
import { MarketingHeader, NavBrand } from '@contractspec/lib.design-system';
import Image from 'next/image';
import appLogo from '../../public/logo-no-bg.png';

const navItems: HeaderNavItem[] = [
	{ label: 'Product', href: '/product' },
	{ label: 'Templates', href: '/templates' },
	{ label: 'Pricing', href: '/pricing' },
	{ label: 'Changelog', href: '/changelog' },
	{ label: 'Docs', href: '/docs' },
	{ label: 'GitHub', href: 'https://github.com/lssm-tech/contractspec' },
];

const SUPPORTED_LOCALES = [{ code: 'en', label: 'EN' }] as const;

// Language switch is only shown when multiple locales are available
const langSwitchProps =
	SUPPORTED_LOCALES.length > 1
		? {
				value: 'en',
				options: [...SUPPORTED_LOCALES],
				onChange: (locale: string) => {
					captureAnalyticsEvent('locale_switch', { locale, surface: 'header' });
				},
			}
		: undefined;

export default function Header() {
	return (
		<MarketingHeader
			logo={
				<NavBrand
					title="ContractSpec"
					href="/"
					logo={
						<Image src={appLogo} alt="ContractSpec Logo" className="h-8 w-8" />
					}
				/>
			}
			nav={navItems}
			navLinkClassName="rounded-md"
			cta={{
				label: 'Install OSS Core',
				href: '/install',
				onClick: () =>
					captureAnalyticsEvent(analyticsEventNames.CTA_INSTALL_CLICK, {
						surface: 'header',
					}),
			}}
			right={
				<a
					className="btn-ghost"
					href="https://www.contractspec.studio"
					onClick={() =>
						captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
							surface: 'header',
						})
					}
				>
					Try Studio
				</a>
			}
			commandPaletteGroups={[]}
			langSwitchProps={langSwitchProps}
		/>
	);
}
