export default function PrivacyPage() {
  return (
    <main className="pt-24 flex flex-col grow items-center justify-center">
      <section className="section-padding">
        <div className="max-w-2xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-muted-foreground">
            <p>Last updated: December 2025</p>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
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
              <h2 className="text-2xl font-bold text-foreground">
                Information Collection and Use
              </h2>
              <p>
                We collect several different types of information for various
                purposes to provide and improve our service to you.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
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
