'use client';

import type { HeaderNavItem } from '@contractspec/lib.design-system';
import {
  ButtonLink,
  MarketingHeader,
  NavBrand,
} from '@contractspec/lib.design-system';
import Image from 'next/image';
import appLogo from '../../public/logo-no-bg.png';

const navItems: HeaderNavItem[] = [
  { label: 'Product', href: '/product' },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
];

const langSwitchProps = {
  value: 'en',
  options: [{ code: 'en', label: 'EN' }],
  onChange: () => {
    // No-op for now
  },
};

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
      cta={{ label: 'Join the waitlist', href: '/contact#waitlist' }}
      right={
        <ButtonLink variant="ghost" href="/contact#call" size="sm">
          Book a demo
        </ButtonLink>
      }
      commandPaletteGroups={[]}
      langSwitchProps={langSwitchProps}
    />
  );
}
