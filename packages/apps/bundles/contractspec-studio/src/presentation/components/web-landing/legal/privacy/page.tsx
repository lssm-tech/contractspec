export default function PrivacyPage() {
  return (
    <main className="flex grow flex-col items-center justify-center pt-24">
      <section className="section-padding">
        <div className="prose prose-invert mx-auto max-w-2xl">
          <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
          <div className="text-muted-foreground space-y-6">
            <p>Last updated: December 2025</p>
            <section className="space-y-4">
              <h2 className="text-foreground text-2xl font-bold">
                Introduction
              </h2>
              <p>
                ContractSpec ("we", "our", or "us") operates the ContractSpec
                website. This page informs you of our policies regarding the
                collection, use, and disclosure of personal data when you use
                our service.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-foreground text-2xl font-bold">
                Information Collection and Use
              </h2>
              <p>
                We collect several different types of information for various
                purposes to provide and improve our service to you.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-foreground text-2xl font-bold">
                Security of Data
              </h2>
              <p>
                The security of your data is important to us, but remember that
                no method of transmission over the Internet or method of
                electronic storage is 100% secure.
              </p>
            </section>
            <p className="pt-8 text-sm">
              For questions about this privacy policy, please contact us at
              privacy@contractspec.io
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
