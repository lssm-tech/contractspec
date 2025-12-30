import Image from 'next/image';

// export const metadata: Metadata = {
//   title: 'Studio – Visual Builder Guide',
//   description:
//     'Understand the Studio visual builder: canvas controls, component palette, bindings, and validation.',
// };

const tips = [
  'Use two-finger drag on touch devices to pan the canvas.',
  'Tap a component to open the spec sidebar and edit props.',
  'The timeline records every change; tap a dot to roll back.',
  'Validation runs automatically before deploy. Errors show inline.',
];

export function StudioVisualBuilderPage() {
  return (
    <main className="space-y-12 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          Visual builder
        </p>
        <h1 className="text-4xl font-bold">Canvas, palette, and spec editor</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Studio’s builder keeps designers, operators, and engineers in sync.
          Every action updates the underlying spec and can be undone.
        </p>
      </header>
      <section className="border-border bg-card rounded-2xl border p-6">
        <Image
          src="/assets/images/studio/visual-builder.png"
          alt="Studio visual builder overview"
          width={1024}
          height={576}
          className="border-border rounded-xl border"
        />
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="card-subtle space-y-2 p-6">
          <h2 className="text-2xl font-semibold">Canvas controls</h2>
          <p className="text-muted-foreground text-sm">
            Drag to pan, scroll/ pinch to zoom. The right panel shows a tree
            view.
          </p>
        </article>
        <article className="card-subtle space-y-2 p-6">
          <h2 className="text-2xl font-semibold">Component palette</h2>
          <p className="text-muted-foreground text-sm">
            Search by intent (“capture payment”) or category. Drag components or
            tap to add.
          </p>
        </article>
        <article className="card-subtle space-y-2 p-6">
          <h2 className="text-2xl font-semibold">Spec editor</h2>
          <p className="text-muted-foreground text-sm">
            Toggle between visual and code views. Changes stay in sync and
            include diff previews.
          </p>
        </article>
        <article className="card-subtle space-y-2 p-6">
          <h2 className="text-2xl font-semibold">Deploy panel</h2>
          <p className="text-muted-foreground text-sm">
            Choose environment, review validations, and deploy with one button.
            Rollback is one tap away.
          </p>
        </article>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Tips</h2>
        <ul className="space-y-2 text-sm">
          {tips.map((tip) => (
            <li key={tip}>• {tip}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
