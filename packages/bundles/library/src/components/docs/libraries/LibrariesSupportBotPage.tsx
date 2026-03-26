import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesSupportBotPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">@contractspec/lib.support-bot</h1>
				<p className="text-lg text-muted-foreground">
					Build AI-first support flows using drop-in classifiers,
					knowledge-grounded resolvers, and tone-aware responders—all wired into
					the agent runner.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand package="@contractspec/lib.support-bot" />
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Wire the primitives</h2>
				<CodeBlock
					language="typescript"
					code={`import { TicketClassifier, TicketResolver, AutoResponder } from '@contractspec/lib.support-bot';

const classifier = new TicketClassifier();
const resolver = new TicketResolver({ knowledge });
const responder = new AutoResponder();

const classification = await classifier.classify(ticket);
const resolution = await resolver.resolve(ticket);
const draft = await responder.draft(ticket, resolution, classification);`}
				/>
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Expose as agent tools</h2>
				<CodeBlock
					language="typescript"
					code={`import { createSupportTools } from '@contractspec/lib.support-bot/bot';

const tools = createSupportTools({ resolver, classifier, responder });
// Pass these tools into your host runtime or agent adapter.`}
				/>
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Included modules</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
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

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries" className="btn-ghost">
					Back to Libraries
				</Link>
				<Link href="/docs/libraries/growth" className="btn-primary">
					Next: Growth <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
