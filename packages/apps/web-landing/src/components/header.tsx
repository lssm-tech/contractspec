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
  { label: 'Changelog', href: '/changelog' },
  { label: 'Docs', href: '/docs' },
  { label: 'GitHub', href: 'https://github.com/lssm-tech/contractspec' },
];

const langSwitchProps = {
  value: 'en',
  options: [{ code: 'en', label: 'EN' }],
  onChange: () => {
    // TODO: implement language switch
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
      navLinkClassName="rounded-md"
      cta={{ label: 'Install OSS Core', href: '/install' }}
      right={
        <ButtonLink variant="ghost" href="/contact#waitlist" size="sm">
          Studio Waitlist
        </ButtonLink>
      }
      commandPaletteGroups={[]}
      langSwitchProps={langSwitchProps}
    />
  );
}
