import { LifecycleStage } from './stages';
import type { LifecycleAxes } from './axes';
import type { LifecycleSignal, LifecycleScore } from './signals';

export type LifecycleMilestoneCategory =
  | 'product'
  | 'company'
  | 'capital'
  | 'operations';

export interface LifecycleMilestone {
  id: string;
  stage: LifecycleStage;
  category: LifecycleMilestoneCategory;
  title: string;
  description: string;
  priority: number;
  detectionCriteria?: Record<string, unknown>;
  guideContent?: string;
  actionItems?: string[];
}

export interface LifecycleAction {
  id: string;
  stage: LifecycleStage;
  title: string;
  description: string;
  priority: number;
  estimatedImpact: 'low' | 'medium' | 'high';
  effortLevel: 'xs' | 's' | 'm' | 'l';
  category: LifecycleMilestoneCategory | 'growth' | 'ops';
  recommendedLibraries?: string[];
}

export interface LifecycleAssessment {
  stage: LifecycleStage;
  confidence: number;
  axes: LifecycleAxes;
  signals: LifecycleSignal[];
  metrics?: Record<string, number | undefined>;
  gaps: string[];
  focusAreas: string[];
  scorecard: LifecycleScore[];
  generatedAt: string;
}

export interface LifecycleRecommendation {
  assessmentId: string;
  stage: LifecycleStage;
  actions: LifecycleAction[];
  upcomingMilestones: LifecycleMilestone[];
  ceremony?: {
    title: string;
    copy: string;
    cues: string[];
  };
}



