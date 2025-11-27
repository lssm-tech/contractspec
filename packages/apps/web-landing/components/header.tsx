"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logoImage from "@/public/icon.png";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-6 h-6  relative">
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
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/product"
              className="text-sm font-medium hover:text-violet-400 transition-colors"
            >
              Product
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium hover:text-violet-400 transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-violet-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium hover:text-violet-400 transition-colors"
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
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sandbox" className="btn-ghost text-sm">
              Try sandbox
            </Link>
            <Link href="/contact" className="btn-primary text-sm">
              Book 15-min
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3 pb-4 bg-background/80 backdrop-blur-md">
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
              <Link href="/sandbox" className="btn-ghost text-sm text-center">
                Try sandbox
              </Link>
              <Link href="/contact" className="btn-primary text-sm text-center">
                Book 15-min
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
