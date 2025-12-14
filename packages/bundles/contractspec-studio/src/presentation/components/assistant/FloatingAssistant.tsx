import * as React from 'react';
import { MessageSquare, Terminal, Wand2 } from 'lucide-react';
import { Button, Input } from '@lssm/lib.design-system';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Separator } from '@lssm/lib.ui-kit-web/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@lssm/lib.ui-kit-web/ui/sheet';
import { useLifecycleProfile } from '../../hooks/studio/queries/useLifecycleProfile';
import { useEvolution } from '../templates/shared/hooks/useEvolution';
import type { TemplateId } from '../../../templates/registry';
import { recordLearningEvent } from '../learning/learning-events';

export interface FloatingAssistantContext {
  mode: 'studio' | 'sandbox';
  /**
   * Used for lifecycle data (Studio).
   * Omit in sandbox to avoid auth-protected queries.
   */
  lifecycleEnabled?: boolean;
  /**
   * Used for evolution insights (local in-browser).
   * Defaults to a safe template id.
   */
  templateId?: TemplateId;
}

export function FloatingAssistant({ context }: { context: FloatingAssistantContext }) {
  const [open, setOpen] = React.useState(false);
  const templateId = context.templateId ?? 'todos-app';
  const evolution = useEvolution(templateId);
  const lifecycle = useLifecycleProfile({
    enabled: Boolean(context.lifecycleEnabled),
  });

  const lifecycleStage =
    context.lifecycleEnabled && lifecycle.data?.lifecycleProfile
      ? `${lifecycle.data.lifecycleProfile.currentStage} (${Math.round(
          lifecycle.data.lifecycleProfile.confidence * 100
        )}%)`
      : context.mode === 'studio'
        ? 'Sign in to see lifecycle insights'
        : 'Not available in sandbox';

  const pendingSuggestions = evolution.suggestions.filter(
    (s) => s.status === 'pending'
  );

  const [chatDraft, setChatDraft] = React.useState('');
  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard may be unavailable (non-secure context); noop
    }
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            recordLearningEvent({
              name: `${context.mode}.assistant.opened`,
              ts: Date.now(),
            });
          }
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant="default"
            className="shadow-lg"
            aria-label="Open AI assistant"
          >
            <MessageSquare className="h-4 w-4" />
            Assistant
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[420px] max-w-[90vw]">
          <SheetHeader>
            <SheetTitle>AI Assistant</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <Card className="p-4">
              <p className="text-sm font-semibold">Suggestions</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Evolution + lifecycle + workspace signals (typed, auditable).
              </p>
              <Separator className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Lifecycle</span>
                  <span className="text-right">{lifecycleStage}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Evolution</span>
                  <span className="text-right">
                    {pendingSuggestions.length} pending / {evolution.anomalies.length}{' '}
                    anomalies
                  </span>
                </div>
              </div>

              {pendingSuggestions.length ? (
                <div className="mt-3 space-y-2">
                  {pendingSuggestions.slice(0, 2).map((s) => (
                    <div
                      key={s.id}
                      className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3"
                    >
                      <p className="text-sm font-medium">
                        {s.proposal.summary}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {s.proposal.rationale}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          onPress={() => evolution.approveSuggestion(s.id)}
                        >
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onPress={() => evolution.rejectSuggestion(s.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>

            <Card className="p-4">
              <p className="text-sm font-semibold">Quick actions (typed)</p>
              <p className="text-muted-foreground mt-1 text-sm">
                These actions don’t mutate your repo. They validate / analyze and
                produce diffs or commands.
              </p>
              <Separator className="my-3" />

              <div className="grid gap-2">
                <Button
                  variant="outline"
                  onPress={() => copy('contractspec validate')}
                >
                  <Terminal className="h-4 w-4" />
                  Copy: contractspec validate
                </Button>
                <Button variant="outline" onPress={() => copy('contractspec deps')}>
                  <Terminal className="h-4 w-4" />
                  Copy: contractspec deps
                </Button>
                <Button
                  variant="outline"
                  onPress={() => copy('contractspec diff --baseline main')}
                >
                  <Terminal className="h-4 w-4" />
                  Copy: contractspec diff --baseline main
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-sm font-semibold">Chat-based editing (v0)</p>
              <p className="text-muted-foreground mt-1 text-sm">
                You can describe a change; next iteration will wire this into
                actions (repo ops + spec updates).
              </p>
              <Separator className="my-3" />
              <Input
                aria-label="Assistant message"
                placeholder="Ask: “Add a staging environment deploy checklist…”"
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  onPress={() => {
                    setChatDraft('');
                  }}
                >
                  <Wand2 className="h-4 w-4" />
                  Create suggestion
                </Button>
                <Button variant="ghost" onPress={() => copy(chatDraft)}>
                  Copy prompt
                </Button>
              </div>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}


