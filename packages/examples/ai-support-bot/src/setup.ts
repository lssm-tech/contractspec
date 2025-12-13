import { TicketResolver } from '@lssm/lib.support-bot/rag';
import { TicketClassifier } from '@lssm/lib.support-bot/tickets';
import { AutoResponder } from '@lssm/lib.support-bot/bot';
import type { KnowledgeAnswer } from '@lssm/lib.knowledge/query/service';
import type { SupportTicket } from '@lssm/lib.support-bot/types';
import { Logger, LogLevel } from '@lssm/lib.logger';
import type { LoggerConfig } from '@lssm/lib.logger/types';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment:
    (process.env.NODE_ENV as LoggerConfig['environment']) || 'development',
  enableColors: process.env.NODE_ENV !== 'production',
});

export async function runAiSupportBotExample(): Promise<void> {
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

  logger.info('Support bot run completed', {
    ticketId: ticket.id,
    classification,
    resolution,
    emailDraft: { subject: draft.subject, body: draft.body },
  });
}
