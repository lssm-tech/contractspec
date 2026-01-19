'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import Link from 'next/link';
import type { TemplateId } from '@contractspec/lib.example-shared-ui';
import { getTemplate } from '@contractspec/module.examples';
import type { RegistryTemplate } from '@contractspec/lib.example-shared-ui';
import { useRegistryTemplates } from '@contractspec/lib.example-shared-ui';

type LocalTemplate = (typeof templates)[number];

export const TemplatesPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<TemplateId | null>(null);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [source, setSource] = useState<'local' | 'registry'>('local');
  const [selectedTemplateForCommand, setSelectedTemplateForCommand] = useState<
    RegistryTemplate | LocalTemplate | null
  >(null);

  const { data: registryTemplates = [], isLoading: registryLoading } =
    useRegistryTemplates();

  const filtered = templates.filter((t) => {
    const matchTag = !selectedTag || t.tags.includes(selectedTag);
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <TooltipProvider>
      <main className="">
        {/* Hero */}
        <section className="section-padding hero-gradient border-border relative border-b">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <h1 className="text-5xl leading-tight font-bold md:text-6xl">
              Recipe templates
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready-to-use, customizable recipes. Policies built in. One-click
              deploy.
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="section-padding border-border border-b">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-muted-foreground text-sm">Source:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSource('local')}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    {
                      'bg-violet-500 text-white': source === 'local',
                      'bg-card border-border hover:bg-card/80 border':
                        source !== 'local',
                    }
                  )}
                  aria-pressed={source === 'local'}
                >
                  Local
                </button>
                <button
                  onClick={() => setSource('registry')}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    {
                      'bg-violet-500 text-white': source === 'registry',
                      'bg-card border-border hover:bg-card/80 border':
                        source !== 'registry',
                    }
                  )}
                  aria-pressed={source === 'registry'}
                >
                  Community
                </button>
              </div>
            </div>
            <div className="relative">
              <Search
                className="text-muted-foreground absolute top-3 left-3"
                size={20}
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card border-border w-full rounded-lg border py-3 pr-4 pl-10 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                aria-label="Search templates"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-violet-500 text-white'
                    : 'bg-card border-border hover:bg-card/80 border'
                }`}
                aria-pressed={selectedTag === null}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors`,
                    {
                      'bg-violet-500 text-white': selectedTag === tag,
                      'bg-card border-border hover:bg-card/80 border':
                        selectedTag !== tag,
                    }
                  )}
                  aria-pressed={selectedTag === tag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="section-padding">
          <div className="mx-auto max-w-6xl">
            {source === 'registry' ? (
              registryLoading ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Loading community templates…
                  </p>
                </div>
              ) : registryTemplates.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No community templates found (configure
                    `NEXT_PUBLIC_CONTRACTSPEC_REGISTRY_URL`).
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {registryTemplates.map((t) => (
                    <div
                      key={t.id}
                      className="card-subtle relative flex flex-col space-y-4 p-6 transition-colors hover:border-violet-500/50"
                    >
                      <div>
                        <h3 className="text-lg font-bold">{t.name}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {t.description}
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {t.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="btn-ghost flex-1 text-center text-xs"
                              onClick={() => {
                                const local = getTemplate(t.id as TemplateId);
                                if (!local) {
                                  setSelectedTemplateForCommand(t);
                                  return;
                                }
                                setPreview(t.id as TemplateId);
                              }}
                            >
                              Preview
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview this template (if available locally)</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="btn-primary flex-1 text-center text-xs"
                              onClick={() => setSelectedTemplateForCommand(t)}
                            >
                              Use Template
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Get CLI command</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No templates match your filters. Try a different search.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((template, i) => (
                  <div
                    key={i}
                    className="card-subtle relative flex flex-col space-y-4 p-6 transition-colors hover:border-violet-500/50"
                  >
                    {'isNew' in template && template.isNew && (
                      <span className="absolute top-3 right-3 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{template.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-muted-foreground text-xs">
                        <span className="text-foreground font-medium">
                          Capabilities:
                        </span>{' '}
                        {template.capabilities}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="btn-ghost flex-1 text-center text-xs"
                            onClick={() => setPreview(template.templateId)}
                          >
                            Preview
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Preview this template in a modal</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="btn-primary flex-1 text-center text-xs"
                            onClick={() =>
                              setSelectedTemplateForCommand(template)
                            }
                          >
                            Use Template
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Get CLI command</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Extend with Integrations & Knowledge */}
        <section className="section-padding border-border bg-striped border-t">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Extend templates with integrations & knowledge
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Every template can be enhanced with built-in integrations and
                knowledge spaces. Add payments, email, AI, and structured
                knowledge without writing integration code.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="card-subtle space-y-4 p-6">
                <div className="text-3xl">💳</div>
                <h3 className="font-bold">Add Payments</h3>
                <p className="text-muted-foreground text-sm">
                  Connect Stripe to any template for payment processing,
                  subscriptions, and invoicing. Type-safe and policy-enforced.
                </p>
                <Link
                  href="/docs/integrations/stripe"
                  className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                >
                  Learn more →
                </Link>
              </div>
              <div className="card-subtle space-y-4 p-6">
                <div className="text-3xl">📧</div>
                <h3 className="font-bold">Add Notifications</h3>
                <p className="text-muted-foreground text-sm">
                  Send transactional emails via Postmark or Resend. Process
                  inbound emails with Gmail API. SMS via Twilio.
                </p>
                <Link
                  href="/docs/integrations"
                  className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                >
                  View integrations →
                </Link>
              </div>
              <div className="card-subtle space-y-4 p-6">
                <div className="text-3xl">🧠</div>
                <h3 className="font-bold">Add AI & Knowledge</h3>
                <p className="text-muted-foreground text-sm">
                  Power templates with OpenAI, vector search via Qdrant, and
                  structured knowledge spaces for context-aware workflows.
                </p>
                <Link
                  href="/docs/knowledge"
                  className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                >
                  Learn about knowledge →
                </Link>
              </div>
            </div>
            <div className="pt-4 text-center">
              <p className="text-muted-foreground mb-4 text-sm">
                All integrations are configured per-tenant with automatic health
                checks and credential rotation.
              </p>
              <Link href="/docs/architecture" className="btn-primary">
                View Architecture
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/*{preview ? (*/}
      <TemplatePreviewModal
        templateId={preview}
        onClose={() => {
          console.log('on close');
          setPreview(null);
        }}
      />
      {/*) : null}*/}

      <Dialog open={waitlistModalOpen} onOpenChange={setWaitlistModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Early Access Required</DialogTitle>
            <DialogDescription>
              ContractSpec Studio is in early access. Join the waitlist to
              deploy projects to our managed cloud.
            </DialogDescription>
          </DialogHeader>
          <WaitlistSection variant="compact" />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedTemplateForCommand}
        onOpenChange={() => setSelectedTemplateForCommand(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Use this template</DialogTitle>
            <DialogDescription>
              Initialize a new project with this template using the CLI.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-50">
              npx contractspec init --template{' '}
              {selectedTemplateForCommand?.id ||
                selectedTemplateForCommand?.templateId}
            </div>
            <div className="flex gap-2">
              <button
                className="btn-secondary w-full"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `npx contractspec init --template ${selectedTemplateForCommand?.id || selectedTemplateForCommand?.templateId}`
                  );
                  // Optionally show toast
                }}
              >
                Copy Command
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or
                </span>
              </div>
            </div>
            <button
              className="btn-ghost w-full text-sm"
              onClick={() => {
                setSelectedTemplateForCommand(null);
                setWaitlistModalOpen(true);
              }}
            >
              Deploy to Studio (Waitlist)
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
