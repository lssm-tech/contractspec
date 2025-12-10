'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { joinWaitlist } from '../../libs/email/waitlist';
import { submitWaitlistApplication } from '../../libs/email/waitlist-application';
import { Button } from '@lssm/lib.ui-kit-web/ui/button';
import { Textarea } from '@lssm/lib.ui-kit-web/ui/textarea';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import { Checkbox } from '@lssm/lib.ui-kit-web/ui/checkbox';
import { Switch } from '@lssm/lib.ui-kit-web/ui/switch';
import { Input } from '@lssm/lib.ui-kit-web/ui/input';

interface WaitlistSectionProps {
  variant?: 'default' | 'compact';
  context?: 'pricing' | 'contact';
  scrollToId?: string;
}

// Zod schemas
const simpleWaitlistSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

const designPartnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Please enter a valid email address'),
  company: z.string().optional(),
  role: z.string().optional(),
  whatBuilding: z.string().min(1, 'Please tell us what you are building'),
  whatSolving: z
    .string()
    .min(1, 'Please tell us what ContractSpec will solve for you'),
  teamSize: z.string().optional(),
  timeline: z.string().optional(),
  openToSessions: z.boolean().default(false),
  okayWithCaseStudies: z.boolean().default(false),
});

type SimpleWaitlistFormData = z.infer<typeof simpleWaitlistSchema>;
type DesignPartnerFormData = z.infer<typeof designPartnerSchema>;

export function WaitlistSection({
  variant = 'default',
  context = 'pricing',
}: WaitlistSectionProps) {
  const [isDesignPartner, setIsDesignPartner] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Simple waitlist form
  const simpleForm = useForm<SimpleWaitlistFormData>({
    resolver: zodResolver(simpleWaitlistSchema),
    defaultValues: {
      email: '',
    },
  });

  // Design partner form
  const designPartnerForm = useForm({
    resolver: zodResolver<
      z.input<typeof designPartnerSchema>,
      unknown,
      z.output<typeof designPartnerSchema>
    >(designPartnerSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      whatBuilding: '',
      whatSolving: '',
      teamSize: '',
      timeline: '',
      openToSessions: false,
      okayWithCaseStudies: false,
    },
  });

  // Sync email between forms
  const simpleEmail = simpleForm.watch('email');
  const designPartnerEmail = designPartnerForm.watch('email');

  // Sync from simple form to design partner form
  useEffect(() => {
    const currentDesignPartnerEmail = designPartnerForm.getValues('email');
    if (simpleEmail && simpleEmail !== currentDesignPartnerEmail) {
      designPartnerForm.setValue('email', simpleEmail, { shouldDirty: false });
    }
  }, [simpleEmail, designPartnerForm]);

  // Sync from design partner form to simple form
  useEffect(() => {
    const currentSimpleEmail = simpleForm.getValues('email');
    if (designPartnerEmail && designPartnerEmail !== currentSimpleEmail) {
      simpleForm.setValue('email', designPartnerEmail, { shouldDirty: false });
    }
  }, [designPartnerEmail, simpleForm]);

  const handleSimpleSubmit = async (data: SimpleWaitlistFormData) => {
    setIsPending(true);
    setSubmitResult(null);

    try {
      const formData = new FormData();
      formData.set('email', data.email);

      const result = await joinWaitlist(formData);

      if (result.success) {
        setSubmitResult({
          success: true,
          text: 'Thanks for joining the waitlist! Check your inbox for a confirmation.',
        });
        simpleForm.reset();
      } else {
        setSubmitResult({
          success: false,
          text: result.text || 'Failed to join waitlist. Please try again.',
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        text: 'Failed to join waitlist. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleDesignPartnerSubmit = async (data: DesignPartnerFormData) => {
    setIsPending(true);
    setSubmitResult(null);

    try {
      const formData = new FormData();
      formData.set('email', data.email);
      formData.set('name', data.name);
      if (data.company) formData.set('company', data.company);
      if (data.role) formData.set('role', data.role);
      formData.set('whatBuilding', data.whatBuilding);
      formData.set('whatSolving', data.whatSolving);
      if (data.teamSize) formData.set('teamSize', data.teamSize);
      if (data.timeline) formData.set('timeline', data.timeline);
      if (data.openToSessions) formData.set('openToSessions', 'on');
      if (data.okayWithCaseStudies) formData.set('okayWithCaseStudies', 'on');

      const result = await submitWaitlistApplication(formData);

      if (result.success) {
        setSubmitResult({
          success: true,
          text: "You're on the list. Thanks for applying. We're slowly onboarding design partners in waves. If your use case is a good fit, we'll reach out personally.",
        });
        designPartnerForm.reset();
      } else {
        setSubmitResult({
          success: false,
          text:
            result.text || 'Failed to submit application. Please try again.',
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        text: 'Failed to submit application. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = isDesignPartner
    ? designPartnerForm.handleSubmit(handleDesignPartnerSubmit)
    : simpleForm.handleSubmit(handleSimpleSubmit);

  const isCompact = variant === 'compact';

  return (
    <div
      id="waitlist"
      className={isCompact ? 'space-y-4' : 'card-subtle space-y-6 p-8'}
    >
      {!isCompact && (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
            <span className="text-sm font-medium text-violet-300">
              {isDesignPartner
                ? 'Design Partner Waitlist'
                : 'Join the Waitlist'}
            </span>
          </div>
          <h2 className="text-2xl font-bold">
            {isDesignPartner
              ? 'Apply for early access to ContractSpec'
              : 'Get early access to ContractSpec'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isDesignPartner
              ? "Tell us what you're building. We'll prioritize teams where ContractSpec can have a big impact, and where we can learn the most."
              : 'Join the waitlist to be notified when ContractSpec becomes available.'}
          </p>
        </div>
      )}

      {!isCompact && (
        <div className="border-border bg-muted/20 flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="space-y-1">
            <Label
              htmlFor="design-partner-toggle"
              className="text-sm font-medium"
            >
              Apply as a design partner
            </Label>
            <p className="text-muted-foreground text-xs">
              {isDesignPartner
                ? 'Get hands-on support, influence the roadmap, and founding discount'
                : 'Get priority access, 1:1 onboarding, and help shape ContractSpec'}
            </p>
          </div>
          <Switch
            id="design-partner-toggle"
            checked={isDesignPartner}
            onCheckedChange={setIsDesignPartner}
            disabled={isPending || submitResult?.success}
          />
        </div>
      )}

      {!isCompact && isDesignPartner && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Benefits:</p>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• Early access to ContractSpec Studio</li>
            <li>• 1:1 onboarding and architecture sessions</li>
            <li>• Priority support via direct channels</li>
            <li>• Influence over roadmap and features</li>
            <li>• Founding discount when paid plans launch</li>
          </ul>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {isDesignPartner ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="waitlist-name" className="text-sm font-medium">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="waitlist-name"
                  {...designPartnerForm.register('name')}
                  type="text"
                  placeholder="Your name"
                  disabled={isPending || submitResult?.success}
                />
                {designPartnerForm.formState.errors.name && (
                  <p className="text-xs text-red-400">
                    {designPartnerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="waitlist-email" className="text-sm font-medium">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="waitlist-email"
                  {...designPartnerForm.register('email')}
                  type="email"
                  placeholder="your@email.com"
                  disabled={isPending || submitResult?.success}
                />
                {designPartnerForm.formState.errors.email && (
                  <p className="text-xs text-red-400">
                    {designPartnerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="waitlist-company"
                  className="text-sm font-medium"
                >
                  Company / Project Name
                </Label>
                <Input
                  id="waitlist-company"
                  {...designPartnerForm.register('company')}
                  type="text"
                  placeholder="Your company or project"
                  disabled={isPending || submitResult?.success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waitlist-role" className="text-sm font-medium">
                  Role
                </Label>
                <Select
                  value={designPartnerForm.watch('role') || ''}
                  onValueChange={(value) =>
                    designPartnerForm.setValue('role', value)
                  }
                  disabled={isPending || submitResult?.success}
                >
                  <SelectTrigger id="waitlist-role" className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="cto">CTO</SelectItem>
                    <SelectItem value="lead-engineer">Lead Engineer</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="product-manager">
                      Product Manager
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="waitlist-what-building"
                className="text-sm font-medium"
              >
                What are you building with AI today?{' '}
                <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="waitlist-what-building"
                {...designPartnerForm.register('whatBuilding')}
                placeholder="Tell us about your project..."
                disabled={isPending || submitResult?.success}
                rows={4}
              />
              {designPartnerForm.formState.errors.whatBuilding && (
                <p className="text-xs text-red-400">
                  {designPartnerForm.formState.errors.whatBuilding.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="waitlist-what-solving"
                className="text-sm font-medium"
              >
                What do you hope ContractSpec will solve for you?{' '}
                <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="waitlist-what-solving"
                {...designPartnerForm.register('whatSolving')}
                placeholder="What problems are you trying to solve?"
                disabled={isPending || submitResult?.success}
                rows={4}
              />
              {designPartnerForm.formState.errors.whatSolving && (
                <p className="text-xs text-red-400">
                  {designPartnerForm.formState.errors.whatSolving.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="waitlist-team-size"
                  className="text-sm font-medium"
                >
                  Team Size
                </Label>
                <Select
                  value={designPartnerForm.watch('teamSize') || ''}
                  onValueChange={(value) =>
                    designPartnerForm.setValue('teamSize', value)
                  }
                  disabled={isPending || submitResult?.success}
                >
                  <SelectTrigger id="waitlist-team-size" className="w-full">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="2-5">2-5</SelectItem>
                    <SelectItem value="6-20">6-20</SelectItem>
                    <SelectItem value="20+">20+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="waitlist-timeline"
                  className="text-sm font-medium"
                >
                  Timeline
                </Label>
                <Select
                  value={designPartnerForm.watch('timeline') || ''}
                  onValueChange={(value) =>
                    designPartnerForm.setValue('timeline', value)
                  }
                  disabled={isPending || submitResult?.success}
                >
                  <SelectTrigger id="waitlist-timeline" className="w-full">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Now</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="exploring">Exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="waitlist-open-to-sessions"
                  checked={designPartnerForm.watch('openToSessions')}
                  onCheckedChange={(checked) =>
                    designPartnerForm.setValue(
                      'openToSessions',
                      checked === true
                    )
                  }
                  disabled={isPending || submitResult?.success}
                />
                <Label
                  htmlFor="waitlist-open-to-sessions"
                  className="cursor-pointer text-sm leading-relaxed"
                >
                  I'm open to 1:1 product/design sessions
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="waitlist-case-studies"
                  checked={designPartnerForm.watch('okayWithCaseStudies')}
                  onCheckedChange={(checked) =>
                    designPartnerForm.setValue(
                      'okayWithCaseStudies',
                      checked === true
                    )
                  }
                  disabled={isPending || submitResult?.success}
                />
                <Label
                  htmlFor="waitlist-case-studies"
                  className="cursor-pointer text-sm leading-relaxed"
                >
                  I'm okay with anonymized case studies about our usage
                </Label>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="waitlist-email" className="text-sm font-medium">
              Email <span className="text-red-400">*</span>
            </Label>
            <Input
              id="waitlist-email"
              {...simpleForm.register('email')}
              type="email"
              placeholder="your@email.com"
              disabled={isPending || submitResult?.success}
            />
            {simpleForm.formState.errors.email && (
              <p className="text-xs text-red-400">
                {simpleForm.formState.errors.email.message}
              </p>
            )}
          </div>
        )}

        {submitResult && !isPending && (
          <div
            className={`flex items-start gap-2 rounded-lg p-4 text-sm ${
              submitResult.success
                ? 'border border-green-500/20 bg-green-500/10 text-green-400'
                : 'border border-red-500/20 bg-red-500/10 text-red-400'
            }`}
          >
            {submitResult.success ? (
              <CheckCircle size={20} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              {submitResult.success ? (
                <>
                  <p className="mb-1 font-semibold">You're on the list.</p>
                  <p className="text-sm">{submitResult.text}</p>
                </>
              ) : (
                <p>{submitResult.text}</p>
              )}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending || submitResult?.success}
          className="w-full"
        >
          {isPending
            ? 'Submitting...'
            : isDesignPartner
              ? 'Apply to the waitlist'
              : 'Join waitlist'}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          No spam. We'll only email you about ContractSpec and your application.
        </p>
      </form>
    </div>
  );
}
