import Link from '@contractspec/lib.ui-link';

interface StudioPromptProps {
  title?: string;
  body?: string;
  ctaLabel?: string;
  href?: string;
}

export function StudioPrompt({
  title = 'Need managed policy gates and approvals?',
  body = 'ContractSpec Studio adds policy gates, remote registry workflows, and audit trails when you are ready to scale adoption.',
  ctaLabel = 'Join Studio waitlist',
  href = '/contact#waitlist',
}: StudioPromptProps) {
  return (
    <div className="card-subtle space-y-3 p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{body}</p>
      <Link href={href} className="btn-primary">
        {ctaLabel}
      </Link>
    </div>
  );
}
