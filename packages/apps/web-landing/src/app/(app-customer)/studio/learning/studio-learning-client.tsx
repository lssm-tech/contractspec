'use client';

import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import {
  LearningTrackList,
  LearningTrackProgressWidget,
} from '@lssm/bundle.contractspec-studio/presentation/components';

export default function StudioLearningClient() {
  return (
    <main className="section-padding py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="space-y-1">
          <p className="text-sm font-semibold">Learning</p>
          <p className="text-muted-foreground text-sm">
            Your learning journeys and onboarding progress (per organization).
          </p>
        </header>

        <Card className="p-6">
          <LearningTrackProgressWidget />
        </Card>

        <LearningTrackList />
      </div>
    </main>
  );
}



