'use client';

import Link from 'next/link';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { Button } from '@contractspec/lib.design-system';
import { LearningTrackDetail } from '@contractspec/bundle.studio/presentation/components/learning';

export default function TrackDetailClient({ trackKey }: { trackKey: string }) {
  return (
    <main className="section-padding py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Learning journey</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/studio/learning">Back</Link>
            </Button>
          </div>
        </Card>

        <LearningTrackDetail trackKey={trackKey} />
      </div>
    </main>
  );
}
