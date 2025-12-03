// export const metadata: Metadata = {
//   title: 'Studio – BYOK Setup',
//   description:
//     'Configure Bring Your Own Key for ContractSpec Studio. Secure credentials, rotate keys, and audit access.',
// };

const steps = [
  {
    title: '1. Provide vault endpoint',
    body: 'Enter your Vault/HSM URL and the key identifier. Studio only stores the reference.',
  },
  {
    title: '2. Verify encryption',
    body: 'Studio runs a test by encrypting a dummy payload and asking you to decrypt it.',
  },
  {
    title: '3. Store credentials',
    body: 'When integrations are connected, secrets get encrypted client side before landing in the database.',
  },
  {
    title: '4. Rotate keys',
    body: 'Trigger rotation from the BYOK manager. Studio fetches existing secrets, decrypts with the old key, and re-encrypts with the new one.',
  },
];

export default function StudioByokDocs() {
  return (
    <main className="space-y-12 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase">
          BYOK
        </p>
        <h1 className="text-4xl font-bold">Bring your own key to Studio</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Keep secrets under your control. Studio never touches plaintext
          credentials; everything is encrypted with tenant-specific material.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <article key={step.title} className="card-subtle space-y-2 p-6">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="text-muted-foreground text-sm">{step.body}</p>
          </article>
        ))}
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Audit trail</h2>
        <p className="text-muted-foreground text-sm">
          Every decrypt operation logs who requested it, what integration was
          involved, and the purpose (sync, deploy, manual action).
        </p>
        <p className="text-muted-foreground text-sm">
          You can stream audit logs to your SIEM via webhooks or export CSVs for
          compliance reviews.
        </p>
      </section>
    </main>
  );
}
