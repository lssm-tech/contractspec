'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import logoImage from '@/public/icon.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-background/80 border-border border-b py-3 backdrop-blur-md'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="relative h-6 w-6">
              <Image
                src={logoImage}
                alt="ContractSpec Logo"
                layout="fill" // required
                objectFit="fit" // change to suit your needs
                // className="rounded-full" // just an example
              />
            </div>
            ContractSpec
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/product"
              className="text-sm font-medium transition-colors hover:text-violet-400"
            >
              Product
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium transition-colors hover:text-violet-400"
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium transition-colors hover:text-violet-400"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium transition-colors hover:text-violet-400"
            >
              Docs
            </Link>
            {/* <Link
              href="/changelog"
              className="text-sm font-medium hover:text-violet-400 transition-colors"
            >
              Changelog
            </Link> */}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/contact#call" className="btn-ghost text-sm">
              Book a demo
            </Link>
            <Link href="/contact#waitlist" className="btn-primary text-sm">
              Join the waitlist
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="bg-background/80 mt-4 space-y-3 pb-4 backdrop-blur-md md:hidden">
            <Link
              href="/product"
              className="block text-sm font-medium hover:text-violet-400"
            >
              Product
            </Link>
            <Link
              href="/templates"
              className="block text-sm font-medium hover:text-violet-400"
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="block text-sm font-medium hover:text-violet-400"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="block text-sm font-medium hover:text-violet-400"
            >
              Docs
            </Link>
            <Link
              href="/changelog"
              className="block text-sm font-medium hover:text-violet-400"
            >
              Changelog
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/contact" className="btn-ghost text-center text-sm">
                Book a demo
              </Link>
              <Link
                href="/pricing#waitlist"
                className="btn-primary text-center text-sm"
              >
                Join the waitlist
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
