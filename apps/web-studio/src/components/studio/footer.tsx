import Link from 'next/link';
import NewsletterSignup from '@/components/newsletter-signup';

export default function StudioFooter() {
  return (
    <footer className="bg-card border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        {/* Newsletter Section */}
        <div className="border-border mb-12 flex items-center justify-center border-b pb-12">
          <div className="max-w-md text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Stay updated with Studio
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Get the latest updates on features, templates, and releases.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold">Studio</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/studio/features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/studio/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/studio/docs" className="hover:text-foreground">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold">Resources</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/templates" className="hover:text-foreground">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="hover:text-foreground">
                  Showcase
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold">Support</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-foreground">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold">Legal</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            ContractSpec Studio © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
