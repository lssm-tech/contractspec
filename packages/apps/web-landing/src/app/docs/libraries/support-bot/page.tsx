import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Bot Library | ContractSpec',
  description:
    'Resolve tickets with classification, RAG, auto-response, and feedback loops.',
};

export default function SupportBotLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.support-bot</h1>
        <p className="text-muted-foreground text-lg">
          Build AI-first support flows using drop-in classifiers,
          knowledge-grounded resolvers, and tone-aware responders—all wired into
          the agent runner.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Wire the primitives</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { TicketClassifier, TicketResolver, AutoResponder } from '@lssm/lib.support-bot';

const classifier = new TicketClassifier();
const resolver = new TicketResolver({ knowledge });
const responder = new AutoResponder();

const classification = await classifier.classify(ticket);
const resolution = await resolver.resolve(ticket);
const draft = await responder.draft(ticket, resolution, classification);`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Expose as agent tools</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { createSupportTools } from '@lssm/lib.support-bot/bot';
import { ToolExecutor } from '@lssm/lib.ai-agent';

const tools = createSupportTools({ resolver, classifier, responder });
const executor = new ToolExecutor({ tools });`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Included modules</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>TicketClassifier</strong>: heuristics + optional LLM
            validation for category/priority.
          </li>
          <li>
            <strong>TicketResolver</strong>: RAG resolver that can plug into any
            knowledge retriever.
          </li>
          <li>
            <strong>AutoResponder</strong>: generates drafts, citations, and
            tone-aware copy.
          </li>
          <li>
            <strong>SupportFeedbackLoop</strong>: track auto-resolution rates
            and sentiment trends.
          </li>
        </ul>
      </div>
    </div>
  );
}
