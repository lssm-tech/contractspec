import type { ChannelInboundEvent, ChannelPolicyDecision } from './types';

export interface MessagingPolicyConfig {
  autoResolveMinConfidence: number;
  assistMinConfidence: number;
  blockedSignals: string[];
  highRiskSignals: string[];
  mediumRiskSignals: string[];
  safeAckTemplate: string;
}

export const DEFAULT_MESSAGING_POLICY_CONFIG: MessagingPolicyConfig = {
  autoResolveMinConfidence: 0.85,
  assistMinConfidence: 0.65,
  blockedSignals: [
    'ignore previous instructions',
    'reveal secret',
    'api key',
    'password',
    'token',
    'drop table',
    'delete repository',
  ],
  highRiskSignals: [
    'refund',
    'delete account',
    'cancel subscription',
    'permission',
    'admin access',
    'wire transfer',
    'bank account',
  ],
  mediumRiskSignals: [
    'urgent',
    'legal',
    'compliance',
    'frustrated',
    'escalate',
    'outage',
  ],
  safeAckTemplate:
    'Thanks for your message. We received it and are preparing the next step.',
};

export interface PolicyEvaluationInput {
  event: ChannelInboundEvent;
}

export class MessagingPolicyEngine {
  private readonly config: MessagingPolicyConfig;

  constructor(config?: Partial<MessagingPolicyConfig>) {
    this.config = {
      ...DEFAULT_MESSAGING_POLICY_CONFIG,
      ...(config ?? {}),
    };
  }

  evaluate(input: PolicyEvaluationInput): ChannelPolicyDecision {
    const text = (input.event.message?.text ?? '').toLowerCase();

    if (containsAny(text, this.config.blockedSignals)) {
      return {
        confidence: 0.2,
        riskTier: 'blocked',
        verdict: 'blocked',
        reasons: ['blocked_signal_detected'],
        responseText: this.config.safeAckTemplate,
        requiresApproval: true,
      };
    }

    if (containsAny(text, this.config.highRiskSignals)) {
      return {
        confidence: 0.55,
        riskTier: 'high',
        verdict: 'assist',
        reasons: ['high_risk_topic_detected'],
        responseText: this.config.safeAckTemplate,
        requiresApproval: true,
      };
    }

    const mediumRiskDetected = containsAny(text, this.config.mediumRiskSignals);
    const confidence = mediumRiskDetected ? 0.74 : 0.92;
    const riskTier = mediumRiskDetected ? 'medium' : 'low';

    if (
      confidence >= this.config.autoResolveMinConfidence &&
      riskTier === 'low'
    ) {
      return {
        confidence,
        riskTier,
        verdict: 'autonomous',
        reasons: ['low_risk_high_confidence'],
        responseText: this.defaultResponseText(input.event),
        requiresApproval: false,
      };
    }

    if (confidence >= this.config.assistMinConfidence) {
      return {
        confidence,
        riskTier,
        verdict: 'assist',
        reasons: ['needs_human_review'],
        responseText: this.config.safeAckTemplate,
        requiresApproval: true,
      };
    }

    return {
      confidence,
      riskTier: 'blocked',
      verdict: 'blocked',
      reasons: ['low_confidence'],
      responseText: this.config.safeAckTemplate,
      requiresApproval: true,
    };
  }

  private defaultResponseText(event: ChannelInboundEvent): string {
    if (!event.message?.text) {
      return this.config.safeAckTemplate;
    }
    return `Acknowledged: ${event.message.text.slice(0, 240)}`;
  }
}

function containsAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) => text.includes(candidate));
}
