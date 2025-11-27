'use client';

export default function ContactClient() {
  return (
    <section className="section-padding hero-gradient w-full">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-5xl font-bold">Book a 20-min call</h1>
        <p className="text-muted-foreground text-lg">
          Schedule a walkthrough with our team.
        </p>

        <object
          data="https://meet.reclaimai.com/e/f863cb29-caac-44b6-972b-1407dd9545a3"
          width="100%"
          height="700px"
          style={{ outline: 'none' }}
        />
      </div>
    </section>
  );
}
