'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import {
  ViewTabs,
  useLearningProgress,
  type LearningView,
  type LearningMiniAppProps,
} from '@contractspec/example.learning-journey-ui-shared';
import { Overview } from './views/Overview';
import { Steps } from './views/Steps';
import { Progress } from './views/Progress';
import { Timeline } from './views/Timeline';

type OnboardingMiniAppProps = Omit<LearningMiniAppProps, 'progress'> & {
  progress?: LearningMiniAppProps['progress'];
};

export function OnboardingMiniApp({
  track,
  progress: externalProgress,
  onStepComplete: externalOnStepComplete,
  onViewChange,
  initialView = 'overview',
}: OnboardingMiniAppProps) {
  const [currentView, setCurrentView] = useState<LearningView>(initialView);

  // Use internal progress if not provided externally
  const { progress: internalProgress, completeStep: internalCompleteStep } =
    useLearningProgress(track);

  const progress = externalProgress ?? internalProgress;

  const handleViewChange = useCallback(
    (view: LearningView) => {
      setCurrentView(view);
      onViewChange?.(view);
    },
    [onViewChange]
  );

  const handleStepComplete = useCallback(
    (stepId: string) => {
      if (externalOnStepComplete) {
        externalOnStepComplete(stepId);
      } else {
        internalCompleteStep(stepId);
      }
    },
    [externalOnStepComplete, internalCompleteStep]
  );

  const handleStartFromOverview = useCallback(() => {
    setCurrentView('steps');
    onViewChange?.('steps');
  }, [onViewChange]);

  const renderView = () => {
    const viewProps = {
      track,
      progress,
      onStepComplete: handleStepComplete,
    };

    switch (currentView) {
      case 'overview':
        return <Overview {...viewProps} onStart={handleStartFromOverview} />;
      case 'steps':
        return <Steps {...viewProps} />;
      case 'progress':
        return <Progress {...viewProps} />;
      case 'timeline':
        return <Timeline {...viewProps} />;
      default:
        return <Overview {...viewProps} onStart={handleStartFromOverview} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <ViewTabs currentView={currentView} onViewChange={handleViewChange} />
        </CardContent>
      </Card>

      {/* Current View */}
      {renderView()}
    </div>
  );
}
