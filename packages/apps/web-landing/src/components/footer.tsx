import Link from 'next/link';
import NewsletterSignup from './newsletter-signup';
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        {/* Newsletter Section */}
        <div className="border-border mb-12 flex items-center justify-center border-b pb-12">
          <div className="max-w-md">
            <NewsletterSignup />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold">Product</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/product" className="hover:text-foreground">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs/comparison" className="hover:text-foreground">
                  Comparison
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold">Docs</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/docs" className="hover:text-foreground">
                  Getting started
                </Link>
              </li>
              <li>
                <Link href="/docs/specs" className="hover:text-foreground">
                  Specs
                </Link>
              </li>
              <li>
                <Link href="/docs/safety" className="hover:text-foreground">
                  Safety
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold">Company</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {/* <li>
                <Link href="/changelog" className="hover:text-foreground">
                  Changelog
                </Link>
              </li> */}
              <li>
                <Link href="/docs/manifesto" className="hover:text-foreground">
                  Manifesto
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Social</h3>
            <div className="flex gap-4">
              <a href="https://github.com/lssm-tech/contractspec" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              {/*<a href="#" className="text-muted-foreground hover:text-foreground transition-colors">*/}
              {/*  <Twitter size={20} />*/}
              {/*</a>*/}
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            Built with ContractSpec © {new Date().getFullYear()}
          </p>
          <div className="text-muted-foreground mt-4 flex gap-6 text-sm md:mt-0">
            <Link href="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
