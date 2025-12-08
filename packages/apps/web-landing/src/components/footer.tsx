import Link from 'next/link';
import NewsletterSignup from './newsletter-signup';
import { Github, Linkedin, Mail } from 'lucide-react';

/**
 * VS Code icon component for the footer social section.
 */
function VSCodeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VS Code"
    >
      <path d="M17.583 2.255L7.8 10.48 3.83 7.58l-.83.51v7.82l.83.51 3.97-2.9 9.783 8.225c.247.18.558.255.867.205l2.5-.5c.37-.075.65-.38.72-.755V3.31c-.07-.375-.35-.68-.72-.755l-2.5-.5a.997.997 0 0 0-.867.2zM18 5.04v13.92l-6.583-5.53 1.166-.98.002-.002L18 8.485V5.04zm0 3.445l-3.417 2.87L18 14.22v-5.735zM6.75 11.5L3 14.1V9.9l3.75 1.6z" />
    </svg>
  );
}

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
            <h3 className="mb-4 font-bold">
              <Link
                href="/docs"
                className="hover:text-primary transition-colors"
              >
                Docs
              </Link>
            </h3>
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
              <li>
                <Link href="/changelog" className="hover:text-foreground">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/docs/manifesto" className="hover:text-foreground">
                  Manifesto
                </Link>
              </li>
              <li>
                <Link
                  href="/packages/contractspec/packages/apps/web-landing/src/app/(landing-marketing)/legal/privacy"
                  className="hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/packages/contractspec/packages/apps/web-landing/src/app/(landing-marketing)/legal/terms"
                  className="hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-bold">
              <Link
                href="/install"
                className="hover:text-primary transition-colors"
              >
                Install
              </Link>
            </h3>
            <div className="flex gap-4">
              <Link
                href="https://marketplace.visualstudio.com/items?itemName=lssm.vscode-contractspec"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Add to VS Code"
                target="_blank"
                rel="noopener noreferrer"
              >
                <VSCodeIcon size={20} />
              </Link>
            </div>
            <h3 className="my-2 font-bold">Social</h3>
            <div className="flex gap-4">
              <Link
                href="https://github.com/lssm-tech/contractspec"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
              </Link>
              {/*<a href="#" className="text-muted-foreground hover:text-foreground transition-colors">*/}
              {/*  <Twitter size={20} />*/}
              {/*</a>*/}
              <Link
                href="https://linkedin.com/company/contractspec"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="mailto:contact@contractspec.io"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            Built with ContractSpec © {new Date().getFullYear()}
          </p>
          <div className="text-muted-foreground mt-4 flex gap-6 text-sm md:mt-0">
            <Link
              href="/packages/contractspec/packages/apps/web-landing/src/app/(landing-marketing)/legal/privacy"
              className="hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/packages/contractspec/packages/apps/web-landing/src/app/(landing-marketing)/legal/terms"
              className="hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
