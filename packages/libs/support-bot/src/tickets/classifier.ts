import type { LLMProvider } from '@contractspec/lib.contracts-integrations';
import type {
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketSentiment,
  TicketClassification,
} from '../types';
import { createSupportBotI18n } from '../i18n';

// ============================================================================
// Locale-keyed keyword dictionaries
// ============================================================================

type LocaleKeywords = Record<TicketCategory, string[]>;
type LocalePriorityHints = Record<TicketPriority, string[]>;
type LocaleSentimentHints = Record<TicketSentiment, string[]>;

const CATEGORY_KEYWORDS: Record<string, LocaleKeywords> = {
  en: {
    billing: ['invoice', 'payout', 'refund', 'charge', 'billing', 'payment'],
    technical: ['bug', 'error', 'crash', 'issue', 'failed', 'timeout'],
    product: ['feature', 'roadmap', 'idea', 'request', 'feedback'],
    account: ['login', 'password', '2fa', 'account', 'profile', 'email change'],
    compliance: ['kyc', 'aml', 'compliance', 'regulation', 'gdpr'],
    other: [],
  },
  fr: {
    billing: [
      'facture',
      'versement',
      'remboursement',
      'frais',
      'facturation',
      'paiement',
    ],
    technical: [
      'bogue',
      'erreur',
      'plantage',
      'problème',
      'échoué',
      'délai dépassé',
    ],
    product: [
      'fonctionnalité',
      'feuille de route',
      'idée',
      'demande',
      'retour',
    ],
    account: [
      'connexion',
      'mot de passe',
      '2fa',
      'compte',
      'profil',
      'changement email',
    ],
    compliance: ['kyc', 'aml', 'conformité', 'réglementation', 'rgpd'],
    other: [],
  },
  es: {
    billing: [
      'factura',
      'desembolso',
      'reembolso',
      'cargo',
      'facturación',
      'pago',
    ],
    technical: [
      'error',
      'fallo',
      'caída',
      'problema',
      'fallido',
      'tiempo agotado',
    ],
    product: [
      'funcionalidad',
      'hoja de ruta',
      'idea',
      'solicitud',
      'comentario',
    ],
    account: [
      'inicio de sesión',
      'contraseña',
      '2fa',
      'cuenta',
      'perfil',
      'cambio de email',
    ],
    compliance: ['kyc', 'aml', 'cumplimiento', 'regulación', 'rgpd'],
    other: [],
  },
};

const PRIORITY_HINTS: Record<string, LocalePriorityHints> = {
  en: {
    urgent: ['urgent', 'asap', 'immediately', 'today', 'right away'],
    high: ['high priority', 'blocking', 'major', 'critical'],
    medium: ['soon', 'next few days'],
    low: ['nice to have', 'when possible', 'later'],
  },
  fr: {
    urgent: [
      'urgent',
      'dès que possible',
      'immédiatement',
      "aujourd'hui",
      'tout de suite',
    ],
    high: ['haute priorité', 'bloquant', 'majeur', 'critique'],
    medium: ['bientôt', 'prochains jours'],
    low: ['ce serait bien', 'quand possible', 'plus tard'],
  },
  es: {
    urgent: [
      'urgente',
      'lo antes posible',
      'inmediatamente',
      'hoy',
      'ahora mismo',
    ],
    high: ['alta prioridad', 'bloqueante', 'mayor', 'crítico'],
    medium: ['pronto', 'próximos días'],
    low: ['sería bueno', 'cuando sea posible', 'más tarde'],
  },
};

const SENTIMENT_HINTS: Record<string, LocaleSentimentHints> = {
  en: {
    positive: ['love', 'great', 'awesome', 'thank you'],
    neutral: ['question', 'wonder', 'curious'],
    negative: ['unhappy', 'bad', 'terrible', 'awful', 'angry'],
    frustrated: ['furious', 'frustrated', 'fed up', 'ridiculous'],
  },
  fr: {
    positive: ['adore', 'super', 'formidable', 'merci'],
    neutral: ['question', 'demande', 'curieux'],
    negative: ['mécontent', 'mauvais', 'terrible', 'affreux', 'en colère'],
    frustrated: ['furieux', 'frustré', 'ras le bol', 'ridicule'],
  },
  es: {
    positive: ['encanta', 'genial', 'increíble', 'gracias'],
    neutral: ['pregunta', 'duda', 'curioso'],
    negative: ['descontento', 'malo', 'terrible', 'horrible', 'enojado'],
    frustrated: ['furioso', 'frustrado', 'harto', 'ridículo'],
  },
};

/** Intent keywords per locale */
const INTENT_KEYWORDS: Record<string, { keyword: string; intent: string }[]> = {
  en: [
    { keyword: 'refund', intent: 'refund' },
    { keyword: 'chargeback', intent: 'refund' },
    { keyword: 'payout', intent: 'payout' },
    { keyword: 'login', intent: 'login-help' },
    { keyword: 'feature', intent: 'feature-request' },
    { keyword: 'bug', intent: 'bug-report' },
    { keyword: 'error', intent: 'bug-report' },
  ],
  fr: [
    { keyword: 'remboursement', intent: 'refund' },
    { keyword: 'rétrofacturation', intent: 'refund' },
    { keyword: 'versement', intent: 'payout' },
    { keyword: 'connexion', intent: 'login-help' },
    { keyword: 'fonctionnalité', intent: 'feature-request' },
    { keyword: 'bogue', intent: 'bug-report' },
    { keyword: 'erreur', intent: 'bug-report' },
  ],
  es: [
    { keyword: 'reembolso', intent: 'refund' },
    { keyword: 'contracargo', intent: 'refund' },
    { keyword: 'desembolso', intent: 'payout' },
    { keyword: 'inicio de sesión', intent: 'login-help' },
    { keyword: 'funcionalidad', intent: 'feature-request' },
    { keyword: 'error', intent: 'bug-report' },
    { keyword: 'fallo', intent: 'bug-report' },
  ],
};

function resolveBaseLocale(locale?: string): string {
  if (!locale) return 'en';
  const base = locale.split('-')[0]?.toLowerCase() ?? 'en';
  return base in CATEGORY_KEYWORDS ? base : 'en';
}

export interface TicketClassifierOptions {
  keywords?: Partial<Record<TicketCategory, string[]>>;
  llm?: LLMProvider;
  llmModel?: string;
  /** Locale for keyword matching + LLM prompts (BCP 47). Falls back to 'en'. */
  locale?: string;
}

export class TicketClassifier {
  private readonly keywords: Record<TicketCategory, string[]>;
  private readonly priorityHints: Record<TicketPriority, string[]>;
  private readonly sentimentHints: Record<TicketSentiment, string[]>;
  private readonly intentKeywords: { keyword: string; intent: string }[];
  private readonly llm?: LLMProvider;
  private readonly llmModel?: string;
  private readonly locale: string;

  constructor(options?: TicketClassifierOptions) {
    this.locale = resolveBaseLocale(options?.locale);
    this.keywords = {
      ...CATEGORY_KEYWORDS[this.locale],
      ...(options?.keywords ?? {}),
    } as Record<TicketCategory, string[]>;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- 'en' is guaranteed to exist
    this.priorityHints = PRIORITY_HINTS[this.locale] ?? PRIORITY_HINTS['en']!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- 'en' is guaranteed to exist
    this.sentimentHints =
      SENTIMENT_HINTS[this.locale] ?? SENTIMENT_HINTS['en']!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- 'en' is guaranteed to exist
    this.intentKeywords =
      INTENT_KEYWORDS[this.locale] ?? INTENT_KEYWORDS['en']!;
    this.llm = options?.llm;
    this.llmModel = options?.llmModel;
  }

  async classify(ticket: SupportTicket): Promise<TicketClassification> {
    const heuristics = this.heuristicClassification(ticket);
    if (!this.llm) return heuristics;

    try {
      const llmResult = await this.llm.chat(
        [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: createSupportBotI18n(this.locale).t(
                  'prompt.classifier.system'
                ),
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  subject: ticket.subject,
                  body: ticket.body,
                  channel: ticket.channel,
                }),
              },
            ],
          },
        ],
        {
          responseFormat: 'json',
          model: this.llmModel,
        }
      );
      const content = llmResult.message.content.find((part) => 'text' in part);
      if (content && 'text' in content) {
        const parsed = JSON.parse(
          content.text
        ) as Partial<TicketClassification>;
        return {
          ...heuristics,
          ...parsed,
          intents: parsed.intents ?? heuristics.intents,
          tags: parsed.tags ?? heuristics.tags,
        };
      }
    } catch {
      // fallback to heuristics
    }

    return heuristics;
  }

  private heuristicClassification(ticket: SupportTicket): TicketClassification {
    const text = `${ticket.subject}\n${ticket.body}`.toLowerCase();
    const category = this.detectCategory(text);
    const priority = this.detectPriority(text);
    const sentiment = this.detectSentiment(text);
    const intents = this.extractIntents(text);
    const tags = intents.slice(0, 3);
    const confidence = this.estimateConfidence(category, priority, sentiment);

    return {
      ticketId: ticket.id,
      category,
      priority,
      sentiment,
      intents,
      tags,
      confidence,
      escalationRequired: priority === 'urgent' || category === 'compliance',
    };
  }

  private detectCategory(text: string): TicketCategory {
    for (const [category, keywords] of Object.entries(this.keywords) as [
      TicketCategory,
      string[],
    ][]) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return category;
      }
    }
    return 'other';
  }

  private detectPriority(text: string): TicketPriority {
    for (const priority of [
      'urgent',
      'high',
      'medium',
      'low',
    ] as TicketPriority[]) {
      const hints = this.priorityHints[priority];
      if (hints?.some((word: string) => text.includes(word))) {
        return priority;
      }
    }
    return 'medium';
  }

  private detectSentiment(text: string): TicketSentiment {
    for (const sentiment of [
      'frustrated',
      'negative',
      'neutral',
      'positive',
    ] as TicketSentiment[]) {
      const hints = this.sentimentHints[sentiment];
      if (hints?.some((word: string) => text.includes(word))) {
        return sentiment;
      }
    }
    return 'neutral';
  }

  private extractIntents(text: string): string[] {
    const intents = new Set<string>();
    for (const { keyword, intent } of this.intentKeywords) {
      if (text.includes(keyword)) {
        intents.add(intent);
      }
    }
    return intents.size > 0 ? [...intents] : ['general'];
  }

  private estimateConfidence(
    category: TicketCategory,
    priority: TicketPriority,
    sentiment: TicketSentiment
  ): number {
    let base = 0.6;
    if (category !== 'other') base += 0.1;
    if (priority === 'urgent' || priority === 'low') base += 0.05;
    if (sentiment === 'frustrated') base -= 0.05;
    return Math.min(0.95, Math.max(0.4, Number(base.toFixed(2))));
  }
}
