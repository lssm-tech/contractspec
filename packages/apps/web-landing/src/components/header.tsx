'use client';

import { MarketingHeader, NavBrand, ButtonLink } from '@lssm/lib.design-system';
import type { HeaderNavItem } from '@lssm/lib.design-system';

const navItems: HeaderNavItem[] = [
  { label: 'Product', href: '/product' },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
];

const langSwitchProps = {
  value: 'en',
  options: [{ code: 'en', label: 'EN' }],
  onChange: () => {},
};

export default function Header() {
  return (
    <MarketingHeader
      logo={<NavBrand title="ContractSpec" href="/" />}
      nav={navItems}
      cta={{ label: 'Join the waitlist', href: '/pricing#waitlist' }}
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
