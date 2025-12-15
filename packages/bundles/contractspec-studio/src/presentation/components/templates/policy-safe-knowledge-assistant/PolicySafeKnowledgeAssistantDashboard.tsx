'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  ErrorState,
  LoaderBlock,
  StatCard,
  StatCardGroup,
} from '@lssm/lib.design-system';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Input } from '@lssm/lib.ui-kit-web/ui/input';
import { Textarea } from '@lssm/lib.ui-kit-web/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';

import { usePolicySafeKnowledgeAssistant } from './hooks/usePolicySafeKnowledgeAssistant';

type AllowedScope = 'education_only' | 'generic_info' | 'escalation_required';

export function PolicySafeKnowledgeAssistantDashboard() {
  const { state, actions } = usePolicySafeKnowledgeAssistant();
  const [question, setQuestion] = useState('reporting obligations');
  const [content, setContent] = useState(
    'EU: Reporting obligations v2 (updated)'
  );
  const [locale, setLocale] = useState('en-GB');
  const [jurisdiction, setJurisdiction] = useState('EU');
  const [allowedScope, setAllowedScope] =
    useState<AllowedScope>('education_only');

  const snapshotId =
    state.context?.kbSnapshotId ?? state.lastSnapshotId ?? null;

  const stats = useMemo(() => {
    return [
      { label: 'Locale', value: state.context?.locale ?? '—' },
      { label: 'Jurisdiction', value: state.context?.jurisdiction ?? '—' },
      { label: 'Scope', value: state.context?.allowedScope ?? '—' },
      { label: 'KB Snapshot', value: snapshotId ?? '—' },
    ];
  }, [
    snapshotId,
    state.context?.allowedScope,
    state.context?.jurisdiction,
    state.context?.locale,
  ]);

  const handleSetContext = useCallback(async () => {
    await actions.setContext({ locale, jurisdiction, allowedScope });
  }, [actions, allowedScope, jurisdiction, locale]);

  const handleAsk = useCallback(async () => {
    await actions.askAssistant(question);
  }, [actions, question]);

  const handleAdminPublishFlow = useCallback(async () => {
    const ruleId = state.lastRuleId ?? (await actions.createDemoRule());
    const rvId = await actions.upsertRuleVersion({ ruleId, content });
    await actions.approveRuleVersion(rvId);
    await actions.simulateHighRiskChangeAndApprove(rvId);
    await actions.publishSnapshot();
  }, [actions, content, state.lastRuleId]);

  if (state.loading && !state.context) {
    return <LoaderBlock label="Loading demo..." />;
  }

  if (state.error) {
    return (
      <ErrorState
        title="Failed to load demo"
        description={state.error.message}
        onRetry={actions.refreshContext}
        retryLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <StatCardGroup>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={String(s.value)} />
        ))}
      </StatCardGroup>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">
          1) Onboarding (explicit locale + jurisdiction)
        </h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
              Locale
            </div>
            <Input value={locale} onChange={(e) => setLocale(e.target.value)} />
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
              Jurisdiction
            </div>
            <Input
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
            />
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
              Allowed scope
            </div>
            <Select
              value={allowedScope}
              onValueChange={(v) => setAllowedScope(v as AllowedScope)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education_only">education_only</SelectItem>
                <SelectItem value="generic_info">generic_info</SelectItem>
                <SelectItem value="escalation_required">
                  escalation_required
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onPress={handleSetContext}>Save context</Button>
          <Button variant="outline" onPress={actions.refreshContext}>
            Refresh
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">
          2) Ask the assistant (must cite KB snapshot)
        </h3>
        <div className="mt-3 flex flex-col gap-3">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onPress={handleAsk}>Ask</Button>
          </div>
        </div>

        {state.lastAnswer ? (
          <div className="mt-4 space-y-3">
            {state.lastAnswer.refused ? (
              <div className="text-sm text-red-600">
                Refused: {state.lastAnswer.refusalReason ?? 'UNKNOWN'}
              </div>
            ) : null}
            {state.lastAnswer.sections.map((s, idx) => (
              <div key={`${s.heading}-${idx}`}>
                <div className="text-sm font-semibold">{s.heading}</div>
                <div className="text-muted-foreground text-sm">{s.body}</div>
              </div>
            ))}
            <div className="text-sm font-semibold">Citations</div>
            <ul className="text-muted-foreground list-disc pl-5 text-sm">
              {state.lastAnswer.citations.map((c) => (
                <li key={`${c.kbSnapshotId}-${c.sourceId}`}>
                  {c.kbSnapshotId} — {c.sourceId}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">
          3) Admin: publish a new snapshot (HITL)
        </h3>
        <div className="mt-3 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onPress={handleAdminPublishFlow}>
            Simulate change → review → approve → publish snapshot
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">4) Learning hub (patterns)</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          This template includes drills, ambient coach, and quests as reusable
          Learning Journey tracks. The interactive learning UI is demonstrated
          in dedicated Learning Journey examples.
        </p>
      </Card>
    </div>
  );
}

