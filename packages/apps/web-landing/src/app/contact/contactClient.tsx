'use client';

import { useActionState } from 'react';
import {
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  submitContactForm,
  SubmitContactFormResult,
} from '@/lib/email';
import { Input } from '@lssm/lib.design-system';
import { Button } from '@lssm/lib.ui-kit-web/ui/button';
import { Textarea } from '@lssm/lib.ui-kit-web/ui/textarea';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import { WaitlistSection } from '@/components/waitlist-section';

export default function ContactClient() {

  // Contact form handler
  const handleContactSubmit = async (
    _prevState: SubmitContactFormResult | null,
    formData: FormData
  ): Promise<SubmitContactFormResult> => {
    const result = await submitContactForm(formData);

    if (result.success) {
      return {
        success: true,
        text: 'Message sent successfully! We\'ll get back to you soon.',
      };
    } else {
      return {
        success: false,
        text: result.text || 'Failed to send message. Please try again.',
      };
    }
  };

  const [contactResult, contactAction, contactPending] = useActionState<
    SubmitContactFormResult | null,
    FormData
  >(handleContactSubmit, null);

  return (
    <section className="section-padding hero-gradient w-full">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Page Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold">Get in touch</h1>
          <p className="text-muted-foreground text-lg">
            Choose how you'd like to connect with us
          </p>
        </div>

        {/* Waitlist Registration Section */}
        <WaitlistSection context="contact" />

        {/* Book a Call Section */}
        <div className="card-subtle space-y-6 p-8" id="call">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-400" size={24} />
            <div>
              <h2 className="text-2xl font-bold">Book a 20-min call</h2>
              <p className="text-muted-foreground text-sm">
                Schedule a walkthrough with our team to see ContractSpec in action
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <object
              data="https://meet.reclaimai.com/e/f863cb29-caac-44b6-972b-1407dd9545a3"
              width="100%"
              height="700px"
              style={{ outline: 'none' }}
              aria-label="Calendar booking widget"
            />
          </div>
        </div>

        {/* Send Message Section */}
        <div className="card-subtle space-y-6 p-8" id="message">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-emerald-400" size={24} />
            <div>
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="text-muted-foreground text-sm">
                Have questions or feedback? We'd love to hear from you
              </p>
            </div>
          </div>

          <form action={contactAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                disabled={contactPending || contactResult?.success}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                keyboard={{ kind: 'email' }}
                placeholder="your@email.com"
                disabled={contactPending || contactResult?.success}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message" className="text-sm font-medium">
                Message
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="Tell us what's on your mind..."
                disabled={contactPending || contactResult?.success}
                rows={6}
                required
              />
            </div>

            {contactResult && !contactPending && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  contactResult.success
                    ? 'border border-green-500/20 bg-green-500/10 text-green-400'
                    : 'border border-red-500/20 bg-red-500/10 text-red-400'
                }`}
              >
                {contactResult.success ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{contactResult.text}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={contactPending || contactResult?.success}
              className="w-full"
            >
              {contactPending ? 'Sending...' : 'Send message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
