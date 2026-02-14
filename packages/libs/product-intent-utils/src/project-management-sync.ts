import type {
  ContractPatchIntent,
  ImpactReport,
  Ticket,
  TicketPriority,
} from '@contractspec/lib.contracts/product-intent/types';
import type {
  ProjectManagementWorkItemInput,
  ProjectManagementWorkItemPriority,
} from '@contractspec/lib.contracts-integrations';

export interface ProjectManagementSyncOptions {
  includeSummary?: boolean;
  summaryTitle?: string;
  defaultPriority?: ProjectManagementWorkItemPriority;
  baseTags?: string[];
}

export interface ProjectManagementSyncPayload {
  summary?: ProjectManagementWorkItemInput;
  items: ProjectManagementWorkItemInput[];
}

export function buildProjectManagementSyncPayload(params: {
  question: string;
  tickets: Ticket[];
  patchIntent?: ContractPatchIntent;
  impact?: ImpactReport;
  options?: ProjectManagementSyncOptions;
}): ProjectManagementSyncPayload {
  const options = params.options ?? {};
  const items = buildWorkItemsFromTickets(params.tickets, options);
  const summary = options.includeSummary
    ? buildSummaryWorkItem({
        question: params.question,
        tickets: params.tickets,
        patchIntent: params.patchIntent,
        impact: params.impact,
        title: options.summaryTitle,
        baseTags: options.baseTags,
      })
    : undefined;

  return { summary, items };
}

export function buildWorkItemsFromTickets(
  tickets: Ticket[],
  options: ProjectManagementSyncOptions = {}
): ProjectManagementWorkItemInput[] {
  return tickets.map((ticket) => ({
    title: ticket.title,
    description: renderTicketDescription(ticket),
    type: 'task',
    priority: mapPriority(ticket.priority, options.defaultPriority),
    tags: mergeTags(options.baseTags, ticket.tags),
    externalId: ticket.ticketId,
  }));
}

function buildSummaryWorkItem(params: {
  question: string;
  tickets: Ticket[];
  patchIntent?: ContractPatchIntent;
  impact?: ImpactReport;
  title?: string;
  baseTags?: string[];
}): ProjectManagementWorkItemInput {
  return {
    title: params.title ?? 'Product Intent Summary',
    description: renderSummaryMarkdown(params),
    type: 'summary',
    tags: mergeTags(params.baseTags, ['product-intent', 'summary']),
  };
}

function renderTicketDescription(ticket: Ticket): string {
  const lines = [
    ticket.summary,
    '',
    'Acceptance Criteria:',
    ...ticket.acceptanceCriteria.map((criterion) => `- ${criterion}`),
  ];

  if (ticket.evidenceIds.length > 0) {
    lines.push('', `Evidence: ${ticket.evidenceIds.join(', ')}`);
  }

  return lines.join('\n');
}

function renderSummaryMarkdown(params: {
  question: string;
  tickets: Ticket[];
  patchIntent?: ContractPatchIntent;
  impact?: ImpactReport;
}): string {
  const lines: string[] = [`# ${params.question}`, '', '## Top Tickets'];

  for (const ticket of params.tickets) {
    lines.push(`- ${ticket.title}`);
  }

  if (params.patchIntent) {
    lines.push(
      '',
      '## Patch Intent',
      `Feature: ${params.patchIntent.featureKey}`
    );
    params.patchIntent.changes.forEach((change) => {
      lines.push(`- ${change.type}: ${change.target}`);
    });
  }

  if (params.impact) {
    lines.push('', '## Impact Summary', params.impact.summary);
  }

  return lines.join('\n');
}

function mapPriority(
  priority: TicketPriority | undefined,
  fallback?: ProjectManagementWorkItemPriority
): ProjectManagementWorkItemPriority | undefined {
  if (!priority) return fallback;
  switch (priority) {
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return fallback;
  }
}

function mergeTags(baseTags?: string[], tags?: string[]): string[] | undefined {
  const merged = new Set<string>();
  (baseTags ?? []).forEach((tag) => merged.add(tag));
  (tags ?? []).forEach((tag) => merged.add(tag));
  const result = [...merged];
  return result.length > 0 ? result : undefined;
}
