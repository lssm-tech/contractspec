import type {
	CalendarEvent,
	CalendarEventInput,
	CalendarEventUpdateInput,
	CalendarListEventsQuery,
	CalendarListEventsResult,
	CalendarProvider,
} from '../calendar';
import type {
	EmailOutboundMessage,
	EmailOutboundProvider,
	EmailOutboundResult,
} from '../email';
import type {
	MessagingProvider,
	MessagingSendInput,
	MessagingSendResult,
	MessagingUpdateInput,
} from '../messaging';
import type {
	CapturePaymentInput,
	CreateCustomerInput,
	CreatePaymentIntentInput,
	ListInvoicesQuery,
	ListTransactionsQuery,
	PaymentCustomer,
	PaymentIntent,
	PaymentInvoice,
	PaymentRefund,
	PaymentsProvider,
	PaymentTransaction,
	RefundPaymentInput,
} from '../payments';
import type {
	ProjectManagementProvider,
	ProjectManagementWorkItem,
	ProjectManagementWorkItemInput,
} from '../project-management';
import type { ComposioToolProxy, ComposioToolResult } from './composio-types';

function composioToolName(toolkit: string, action: string): string {
	return `${toolkit.toUpperCase()}_${action.toUpperCase()}`;
}

function unwrapResult<T>(result: ComposioToolResult, fallback: T): T {
	if (!result.success) {
		throw new Error(`Composio tool execution failed: ${result.error}`);
	}
	return (result.data as T) ?? fallback;
}

export class ComposioMessagingProxy implements MessagingProvider {
	constructor(
		private readonly proxy: ComposioToolProxy,
		private readonly toolkit: string
	) {}

	async sendMessage(input: MessagingSendInput): Promise<MessagingSendResult> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'SEND_MESSAGE'),
			{
				channel: input.channelId,
				thread_ts: input.threadId,
				text: input.text,
				recipient: input.recipientId,
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? data.ts ?? crypto.randomUUID()),
			providerMessageId: data.ts as string | undefined,
			status: 'sent',
			sentAt: new Date(),
		};
	}

	async updateMessage(
		messageId: string,
		input: MessagingUpdateInput
	): Promise<MessagingSendResult> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'UPDATE_MESSAGE'),
			{
				message_id: messageId,
				channel: input.channelId,
				text: input.text,
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? messageId),
			status: 'sent',
			sentAt: new Date(),
		};
	}
}

export class ComposioEmailProxy implements EmailOutboundProvider {
	constructor(
		private readonly proxy: ComposioToolProxy,
		private readonly toolkit: string
	) {}

	async sendEmail(message: EmailOutboundMessage): Promise<EmailOutboundResult> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'SEND_EMAIL'),
			{
				to: message.to.map((a) => a.email).join(','),
				cc: message.cc?.map((a) => a.email).join(','),
				bcc: message.bcc?.map((a) => a.email).join(','),
				subject: message.subject,
				body: message.htmlBody ?? message.textBody ?? '',
				from: message.from.email,
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? data.messageId ?? crypto.randomUUID()),
			providerMessageId: data.messageId as string | undefined,
			queuedAt: new Date(),
		};
	}
}

export class ComposioPaymentsProxy implements PaymentsProvider {
	constructor(
		private readonly proxy: ComposioToolProxy,
		private readonly toolkit: string
	) {}

	async createCustomer(input: CreateCustomerInput): Promise<PaymentCustomer> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'CREATE_CUSTOMER'),
			{ email: input.email, name: input.name, description: input.description }
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? crypto.randomUUID()),
			email: (data.email as string) ?? input.email,
			name: (data.name as string) ?? input.name,
		};
	}

	async getCustomer(customerId: string): Promise<PaymentCustomer | null> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'GET_CUSTOMER'),
			{ customer_id: customerId }
		);
		if (!result.success) return null;
		const data = result.data as Record<string, unknown> | undefined;
		if (!data) return null;
		return {
			id: String(data.id ?? customerId),
			email: data.email as string | undefined,
			name: data.name as string | undefined,
		};
	}

	async createPaymentIntent(
		input: CreatePaymentIntentInput
	): Promise<PaymentIntent> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'CREATE_PAYMENT_INTENT'),
			{
				amount: input.amount.amount,
				currency: input.amount.currency,
				customer_id: input.customerId,
				description: input.description,
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? crypto.randomUUID()),
			amount: input.amount,
			status:
				(data.status as PaymentIntent['status']) ?? 'requires_payment_method',
			customerId: input.customerId,
			clientSecret: data.client_secret as string | undefined,
		};
	}

	async capturePayment(
		paymentIntentId: string,
		input?: CapturePaymentInput
	): Promise<PaymentIntent> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'CAPTURE_PAYMENT'),
			{ payment_intent_id: paymentIntentId, amount: input?.amount?.amount }
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: paymentIntentId,
			amount: input?.amount ?? { amount: 0, currency: 'usd' },
			status: (data.status as PaymentIntent['status']) ?? 'succeeded',
		};
	}

	async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'CANCEL_PAYMENT_INTENT'),
			{ payment_intent_id: paymentIntentId }
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: paymentIntentId,
			amount: { amount: 0, currency: 'usd' },
			status: (data.status as PaymentIntent['status']) ?? 'canceled',
		};
	}

	async refundPayment(input: RefundPaymentInput): Promise<PaymentRefund> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'REFUND_PAYMENT'),
			{
				payment_intent_id: input.paymentIntentId,
				amount: input.amount?.amount,
				reason: input.reason,
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? crypto.randomUUID()),
			paymentIntentId: input.paymentIntentId,
			amount: input.amount ?? { amount: 0, currency: 'usd' },
			status: 'succeeded',
		};
	}

	async listInvoices(_query?: ListInvoicesQuery): Promise<PaymentInvoice[]> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'LIST_INVOICES'),
			{ customer_id: _query?.customerId, limit: _query?.limit }
		);
		if (!result.success) return [];
		const items = (result.data as Record<string, unknown>[]) ?? [];
		return items.map((i) => ({
			id: String(i.id),
			status: (i.status as PaymentInvoice['status']) ?? 'open',
			amountDue: {
				amount: Number(i.amount_due ?? 0),
				currency: String(i.currency ?? 'usd'),
			},
		}));
	}

	async listTransactions(
		_query?: ListTransactionsQuery
	): Promise<PaymentTransaction[]> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'LIST_TRANSACTIONS'),
			{ customer_id: _query?.customerId, limit: _query?.limit }
		);
		if (!result.success) return [];
		const items = (result.data as Record<string, unknown>[]) ?? [];
		return items.map((i) => ({
			id: String(i.id),
			amount: {
				amount: Number(i.amount ?? 0),
				currency: String(i.currency ?? 'usd'),
			},
			type: 'capture' as const,
			status: 'succeeded' as const,
			createdAt: new Date(),
		}));
	}
}

export class ComposioProjectManagementProxy
	implements ProjectManagementProvider
{
	constructor(
		private readonly proxy: ComposioToolProxy,
		private readonly toolkit: string
	) {}

	async createWorkItem(
		input: ProjectManagementWorkItemInput
	): Promise<ProjectManagementWorkItem> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'CREATE_ISSUE'),
			{
				title: input.title,
				description: input.description,
				priority: input.priority,
				assignee_id: input.assigneeId,
				project_id: input.projectId,
				labels: input.tags,
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? data.key ?? crypto.randomUUID()),
			title: input.title,
			url: data.url as string | undefined,
			status: data.status as string | undefined,
			priority: input.priority,
			tags: input.tags,
			projectId: input.projectId,
		};
	}

	async createWorkItems(
		items: ProjectManagementWorkItemInput[]
	): Promise<ProjectManagementWorkItem[]> {
		return Promise.all(items.map((item) => this.createWorkItem(item)));
	}
}

export class ComposioCalendarProxy implements CalendarProvider {
	constructor(
		private readonly proxy: ComposioToolProxy,
		private readonly toolkit: string
	) {}

	async listEvents(
		query: CalendarListEventsQuery
	): Promise<CalendarListEventsResult> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'LIST_EVENTS'),
			{
				calendar_id: query.calendarId,
				time_min: query.timeMin?.toISOString(),
				time_max: query.timeMax?.toISOString(),
				max_results: query.maxResults,
			}
		);
		if (!result.success) return { events: [] };
		const items = (result.data as Record<string, unknown>[]) ?? [];
		return {
			events: items.map((e) => ({
				id: String(e.id),
				calendarId: query.calendarId,
				title: String(e.summary ?? e.title ?? ''),
				start: new Date(String(e.start ?? Date.now())),
				end: new Date(String(e.end ?? Date.now())),
			})),
		};
	}

	async createEvent(input: CalendarEventInput): Promise<CalendarEvent> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'CREATE_EVENT'),
			{
				calendar_id: input.calendarId,
				summary: input.title,
				description: input.description,
				location: input.location,
				start: input.start.toISOString(),
				end: input.end.toISOString(),
				attendees: input.attendees?.map((a) => a.email),
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: String(data.id ?? crypto.randomUUID()),
			calendarId: input.calendarId,
			title: input.title,
			start: input.start,
			end: input.end,
		};
	}

	async updateEvent(
		calendarId: string,
		eventId: string,
		input: CalendarEventUpdateInput
	): Promise<CalendarEvent> {
		const result = await this.proxy.executeTool(
			composioToolName(this.toolkit, 'UPDATE_EVENT'),
			{
				calendar_id: calendarId,
				event_id: eventId,
				summary: input.title,
				description: input.description,
				start: input.start?.toISOString(),
				end: input.end?.toISOString(),
			}
		);
		const data = unwrapResult<Record<string, unknown>>(result, {});
		return {
			id: eventId,
			calendarId,
			title: String(data.summary ?? input.title ?? ''),
			start: input.start ?? new Date(),
			end: input.end ?? new Date(),
		};
	}

	async deleteEvent(calendarId: string, eventId: string): Promise<void> {
		await this.proxy.executeTool(
			composioToolName(this.toolkit, 'DELETE_EVENT'),
			{ calendar_id: calendarId, event_id: eventId }
		);
	}
}

/**
 * Generic catch-all proxy for domains without a typed interface.
 * Exposes raw tool execution and search capabilities.
 */
export class ComposioGenericProxy {
	constructor(
		private readonly proxy: ComposioToolProxy,
		private readonly toolkit: string
	) {}

	async executeTool(
		action: string,
		args: Record<string, unknown>
	): Promise<ComposioToolResult> {
		return this.proxy.executeTool(composioToolName(this.toolkit, action), args);
	}

	async searchTools(
		query: string
	): Promise<ReturnType<ComposioToolProxy['searchTools']>> {
		return this.proxy.searchTools(query);
	}

	getToolkit(): string {
		return this.toolkit;
	}
}
