export default function TermsPage() {
  return (
    <main className="flex grow flex-col items-center justify-center pt-24">
      <section className="section-padding">
        <div className="prose prose-invert mx-auto max-w-2xl">
          <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
          <div className="text-muted-foreground space-y-6">
            <p>Last updated: December 2025</p>
            <section className="space-y-4">
              <h2 className="text-foreground text-2xl font-bold">
                Agreement to Terms
              </h2>
              <p>
                By accessing and using ContractSpec, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-foreground text-2xl font-bold">
                Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on ContractSpec for
                personal, non-commercial transitory viewing only.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-foreground text-2xl font-bold">Disclaimer</h2>
              <p>
                The materials on ContractSpec's website are provided on an 'as
                is' basis. ContractSpec makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties.
              </p>
            </section>
            <p className="pt-8 text-sm">
              For questions about these terms, please contact us at
              legal@contractspec.io
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
