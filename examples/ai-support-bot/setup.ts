import { TicketResolver } from '@lssm/lib.support-bot/rag';
import { TicketClassifier } from '@lssm/lib.support-bot/tickets';
import { AutoResponder } from '@lssm/lib.support-bot/bot';
import type { KnowledgeAnswer } from '@lssm/lib.contracts/knowledge/query/service';
import type { SupportTicket } from '@lssm/lib.support-bot/types';

async function main() {
  const knowledge = {
    async query(question: string): Promise<KnowledgeAnswer> {
      return {
        answer: `The payout will retrigger automatically. (${question.slice(0, 40)}…)`,
        references: [],
      };
    },
  };

  const resolver = new TicketResolver({ knowledge });
  const classifier = new TicketClassifier();
  const responder = new AutoResponder();

  const ticket: SupportTicket = {
    id: 'TIC-42',
    subject: 'Payout failed',
    body: 'Hello, our supplier payout failed twice yesterday. Can you confirm status? It is urgent.',
    channel: 'email',
    customerName: 'Ivy',
    metadata: { accountId: 'acct_789' },
  };

  const classification = await classifier.classify(ticket);
  const resolution = await resolver.resolve(ticket);
  const draft = await responder.draft(ticket, resolution, classification);

  console.log('Classification', classification);
  console.log('Resolution', resolution);
  console.log('Email draft', draft.body);
}

main();
