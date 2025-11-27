'use client';

import Link from 'next/link';
import {
  ChevronRight,
  Calendar,
  AlertTriangle,
  Layers,
  RefreshCw,
  Shield,
  Code,
  CheckCircle,
  XCircle,
  Unlock,
  Zap,
  GitBranch,
  FileCode,
} from 'lucide-react';
import Image from 'next/image';

export default function ClientPage() {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-padding hero-gradient relative">
        <div className="fade-in mx-auto max-w-4xl space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl leading-tight font-bold text-pretty md:text-6xl">
              Stabilize your AI-generated code
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty md:text-xl">
              ContractSpec is the compiler that keeps AI-written software
              coherent, safe, and regenerable. You keep your app. You own the
              code. One module at a time.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/docs/quickstart" className="btn-primary">
              Get started <ChevronRight size={16} />
            </Link>
            <Link href="/contact" className="btn-ghost flex items-center gap-2">
              <Calendar size={16} /> Book a demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            {[
              'Safe Regeneration',
              'Multi-Surface Sync',
              'No Lock-in',
              'Just TypeScript',
              'You Own the Code',
              'Incremental Adoption',
              'Standard Tech',
              'AI Governance',
            ].map((chip) => (
              <span key={chip} className="badge">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-6xl">
          <p className="text-muted-foreground mb-6 text-center text-sm">
            Powering production applications
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              {
                name: 'HCircle',
                logo: '/assets/images/used-by/hcircle.png',
                url: 'https://hcircle.app/',
              },
              {
                name: 'ArtisanOS',
                logo: '/assets/images/used-by/artisanos.png',
                url: 'https://artisanos.app/',
                inverted: true,
              },
              {
                name: 'Strit',
                logo: '/assets/images/used-by/strit.png',
                url: 'https://strit.academy/',
              },
            ].map((client) => (
              <Link
                key={client.name}
                href={client.url}
                className="text-muted-foreground flex flex-col items-center px-4 text-sm font-medium"
                target="_blank"
              >
                <div className="relative h-16 w-16">
                  <Image
                    src={client.logo}
                    alt={`${client.name} Logo`}
                    layout="fill"
                    objectFit="fit"
                    className={client.inverted ? 'invert' : ''}
                  />
                </div>
                {client.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="section-padding border-border bg-muted/30 border-b">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-4 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-red-500 uppercase">
              The Problem
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              AI agents write code fast. Then the chaos begins.
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              In 2025, "vibe coding" and AI agents generate enormous amounts of
              code. But they have critical limitations that destroy long-term
              maintainability.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: AlertTriangle,
                title: "Can't enforce invariants",
                body: 'AI-generated code drifts from business rules over time. No source of truth means no safety.',
                color: 'text-red-400',
              },
              {
                icon: Layers,
                title: 'Multi-surface chaos',
                body: 'API, DB, UI, and events get out of sync. One change breaks three surfaces.',
                color: 'text-orange-400',
              },
              {
                icon: RefreshCw,
                title: 'Hallucinated refactors',
                body: 'AI "improvements" introduce subtle bugs and break contracts you didn\'t know existed.',
                color: 'text-amber-400',
              },
              {
                icon: XCircle,
                title: 'Unmaintainable spaghetti',
                body: 'Teams ship fast initially, then spend months untangling AI-generated chaos.',
                color: 'text-red-400',
              },
            ].map((card) => (
              <div key={card.title} className="card-subtle space-y-4 p-6">
                <card.icon className={`${card.color}`} size={24} />
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="text-muted-foreground text-sm">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding border-border from-background to-muted/40 border-b bg-gradient-to-b">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-4 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500 uppercase">
              The Solution
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              ContractSpec: The safety layer for AI-coded systems
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              Define contracts once. Generate consistent code across all
              surfaces. Regenerate safely anytime. No lock-in.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileCode,
                title: 'Canonical Source of Truth',
                body: 'Contracts define what the system should do, not just what it does. AI agents read specs, not implementations.',
                color: 'text-emerald-400',
              },
              {
                icon: Layers,
                title: 'Multi-Surface Consistency',
                body: 'One spec generates API, DB, UI, events, and MCP tools. All surfaces stay in sync because they share the same source.',
                color: 'text-blue-400',
              },
              {
                icon: RefreshCw,
                title: 'Safe Regeneration',
                body: 'Regenerate code anytime without fear. Specs enforce invariants. Breaking changes caught at compile time.',
                color: 'text-violet-400',
              },
              {
                icon: Shield,
                title: 'AI Governance',
                body: 'Constrain what AI agents can change. Enforce contracts they must respect. Flag violations automatically.',
                color: 'text-pink-400',
              },
            ].map((card) => (
              <div key={card.title} className="card-subtle space-y-4 p-6">
                <card.icon className={`${card.color}`} size={24} />
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="text-muted-foreground text-sm">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Fears Addressed */}
      <section className="section-padding border-border border-b bg-muted/20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-4 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-violet-500 uppercase">
              We Get It
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Your fears, addressed
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              We know what you're thinking. Here's why those concerns don't
              apply to ContractSpec.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                fear: '"I already have an app"',
                reality:
                  'ContractSpec works with existing codebases. You don\'t start over — you stabilize incrementally, one module at a time. Start with one API endpoint, one data model, one contract.',
                icon: CheckCircle,
              },
              {
                fear: '"Vendor lock-in / losing ownership"',
                reality:
                  'You own the generated code. It\'s standard TypeScript, standard SQL, standard GraphQL. ContractSpec is a compiler — like TypeScript itself. You can eject anytime.',
                icon: Unlock,
              },
              {
                fear: '"Adoption cost / learning curve"',
                reality:
                  'Specs are just TypeScript. If you can write z.object({ name: z.string() }), you can write a ContractSpec. No new language, no magic DSL, no YAML.',
                icon: Code,
              },
              {
                fear: '"Forced migrations / magical runtime"',
                reality:
                  'ContractSpec generates plain code you can read, debug, and modify. There\'s no proprietary runtime. Migrations are explicit, reversible, and in your control.',
                icon: Zap,
              },
            ].map((item) => (
              <div key={item.fear} className="card-subtle space-y-4 p-6">
                <div className="flex items-start gap-4">
                  <item.icon
                    className="flex-shrink-0 text-violet-400"
                    size={24}
                  />
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-violet-300">
                      {item.fear}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.reality}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Positioning */}
      <section className="section-padding border-border bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-blue-500/5 border-b">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            You keep your app.
            <br />
            We stabilize it, one module at a time.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            You own the code. It's standard tech.
            <br />
            <span className="font-semibold text-violet-400">
              We're the compiler, not the prison.
            </span>
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="btn-primary inline-flex items-center gap-2"
            >
              Start stabilizing <ChevronRight size={16} />
            </Link>
            <Link href="/product" className="btn-ghost">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-4 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-blue-500 uppercase">
              Who It's For
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Built for teams drowning in AI-generated code
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-subtle space-y-4 p-6">
              <div className="text-sm font-semibold text-blue-400">
                Tier 1: Priority
              </div>
              <h3 className="text-xl font-bold">
                AI-Native Startups & Technical Founders
              </h3>
              <p className="text-muted-foreground text-sm">
                Solo founders or small teams using Cursor, Copilot, Claude, or
                AI agents heavily. Messy AI-generated backends and frontends,
                inconsistent APIs, code that's hard to refactor.
              </p>
              <p className="text-sm text-violet-400">
                Need: A way to stabilize AI-generated code without rewriting it.
              </p>
            </div>
            <div className="card-subtle space-y-4 p-6">
              <div className="text-sm font-semibold text-blue-400">
                Tier 1: Priority
              </div>
              <h3 className="text-xl font-bold">
                Small Teams with AI-Generated Chaos
              </h3>
              <p className="text-muted-foreground text-sm">
                2-10 person teams that shipped fast with AI and now have tech
                debt. Multiple surfaces out of sync, no source of truth, afraid
                to touch AI-generated code.
              </p>
              <p className="text-sm text-violet-400">
                Need: Incremental stabilization, safe regeneration, contracts as
                guardrails.
              </p>
            </div>
            <div className="card-subtle space-y-4 p-6">
              <div className="text-sm font-semibold text-emerald-400">
                Tier 2: Growth
              </div>
              <h3 className="text-xl font-bold">AI Dev Agencies</h3>
              <p className="text-muted-foreground text-sm">
                Agencies building many projects for clients using AI-assisted
                development. Repeating the same patterns, inconsistent quality
                across projects, handoff nightmares.
              </p>
              <p className="text-sm text-violet-400">
                Need: Reusable templates, consistent contracts, professional
                handoff artifacts.
              </p>
            </div>
            <div className="card-subtle space-y-4 p-6">
              <div className="text-sm font-semibold text-emerald-400">
                Tier 2: Growth
              </div>
              <h3 className="text-xl font-bold">
                Scaleups with Compliance Needs
              </h3>
              <p className="text-muted-foreground text-sm">
                Growing companies that need audit trails, API governance, or
                regulatory compliance. AI-generated code doesn't meet compliance
                requirements.
              </p>
              <p className="text-sm text-violet-400">
                Need: Governance layer, change tracking, contract enforcement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-padding border-border border-b bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              What ContractSpec generates
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              One contract, multiple outputs. All in sync. All standard tech.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'REST API',
                description:
                  'Type-safe endpoints with validation. Standard Express/Hono/Elysia handlers.',
                icon: '🔌',
              },
              {
                title: 'GraphQL Schema',
                description:
                  'Automatically generated resolvers. Standard Pothos/Apollo output.',
                icon: '📊',
              },
              {
                title: 'Database Schema',
                description:
                  'Prisma migrations and types. Standard SQL underneath.',
                icon: '🗄️',
              },
              {
                title: 'MCP Tools',
                description:
                  'AI agent tool definitions. Works with Claude, GPT, and any MCP client.',
                icon: '🤖',
              },
              {
                title: 'Client SDKs',
                description:
                  'Type-safe API clients. Standard fetch/axios underneath.',
                icon: '📦',
              },
              {
                title: 'UI Components',
                description:
                  'React forms and views from specs. Standard JSX output.',
                icon: '🎨',
              },
            ].map((item) => (
              <div key={item.title} className="card-subtle space-y-4 p-6">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Adoption Works */}
      <section className="section-padding border-border border-b">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            How incremental adoption works
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: 1,
                title: 'Pick one module',
                description:
                  'Start with one API endpoint, one entity, one surface. No big-bang migration.',
              },
              {
                step: 2,
                title: 'Define the contract',
                description:
                  'Write a spec in TypeScript. Just types and Zod schemas you already know.',
              },
              {
                step: 3,
                title: 'Generate & compare',
                description:
                  'See what ContractSpec generates. Compare to your existing code. Keep what works.',
              },
              {
                step: 4,
                title: 'Expand gradually',
                description:
                  'Add more contracts as you see value. No pressure. No lock-in. Your pace.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-subtle fade-in space-y-4 p-6"
                style={{ animationDelay: `${item.step * 100}ms` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                  <div className="font-bold text-violet-400">{item.step}</div>
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Experience */}
      <section className="section-padding border-border border-b bg-muted/20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Built for developers
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Standard Tech Stack</h3>
              <ul className="text-muted-foreground space-y-3">
                {[
                  'TypeScript & Zod — schemas you already know',
                  'Prisma — standard database access',
                  'GraphQL or REST — your choice',
                  'React or any UI framework',
                  'Bun, Node, Deno — all supported',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-violet-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">No Magic, No Lock-in</h3>
              <ul className="text-muted-foreground space-y-3">
                {[
                  'Generated code is readable & modifiable',
                  'No proprietary runtime dependencies',
                  'Eject anytime, keep everything',
                  'Works with your existing CI/CD',
                  'Open spec format',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-violet-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/docs" className="btn-primary">
              Read the docs <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Ready to stabilize your codebase?
          </h2>
          <p className="text-muted-foreground text-lg">
            Start with one module. See the difference. Expand at your own pace.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/docs/quickstart" className="btn-primary">
              Get started free
            </Link>
            <Link href="/contact" className="btn-ghost">
              Book 15-min demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
