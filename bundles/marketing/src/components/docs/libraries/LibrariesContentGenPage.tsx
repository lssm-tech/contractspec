// export const metadata: Metadata = {
//   title: 'Content Generation Library | ContractSpec',
//   description:
//     'Generate blog posts, landing pages, emails, social posts, and SEO metadata.',
// };

export function LibrariesContentGenPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@contractspec/lib.content-gen</h1>
        <p className="text-muted-foreground text-lg">
          Feed a single ContentBrief and produce cohesive marketing assets
          without touching a CMS.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">One brief, many assets</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import {
  BlogGenerator,
  LandingPageGenerator,
  EmailCampaignGenerator,
  SocialPostGenerator,
} from '@contractspec/lib.content-gen/generators';
import { SeoOptimizer } from '@contractspec/lib.content-gen/seo';

const brief = {
  title: 'AI Ops Copilot',
  summary: 'Automates support + growth.',
  problems: ['Support queues pile up', 'Growth teams lack experiments'],
  solutions: ['AI agents', 'Approval queue', 'Analytics'],
  audience: { role: 'COO', industry: 'Fintech' },
};

const blog = await new BlogGenerator().generate(brief);
const landing = await new LandingPageGenerator().generate(brief);
const email = await new EmailCampaignGenerator().generate({ brief, variant: 'announcement' });
const social = await new SocialPostGenerator().generate(brief);
const seo = new SeoOptimizer().optimize(brief);`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">When to use</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Ship landing page refreshes whenever specs change.</li>
          <li>Automate release emails + nurture sequences per vertical.</li>
          <li>
            Create social snippets that stay on-message with the same brief.
          </li>
          <li>Generate SEO metadata + Schema.org markup alongside content.</li>
        </ul>
      </div>
    </div>
  );
}
