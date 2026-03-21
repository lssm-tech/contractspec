import type {
	PresentationSpec,
	PresentationTarget,
} from '@contractspec/lib.contracts-spec/presentations';
import { schemaToMarkdown } from '@contractspec/lib.contracts-spec/schema-to-markdown';
import {
	blockNoteToMarkdown,
	htmlToMarkdown,
} from './transform-engine.markdown';

export interface RenderContext {
	locale?: string;
	featureFlags?: string[];
	redact?: (path: string, value: unknown) => unknown;
	data?: unknown;
	fetchData?: () => Promise<unknown>;
}

export interface PresentationRenderer<TOut> {
	target: PresentationTarget;
	render: (desc: PresentationSpec, ctx?: RenderContext) => Promise<TOut>;
}

export interface PresentationValidator {
	validate: (
		desc: PresentationSpec,
		target: PresentationTarget,
		ctx?: RenderContext
	) => Promise<void> | void;
}

function applyPii(desc: PresentationSpec, obj: unknown): unknown {
	let clone: unknown;
	try {
		clone = JSON.parse(JSON.stringify(obj));
	} catch {
		clone = obj;
	}

	const paths = desc.policy?.pii ?? [];
	const setAtPath = (root: unknown, path: string) => {
		const segments = path
			.replace(/^\//, '')
			.replace(/\[(\d+)\]/g, '.$1')
			.split('.')
			.filter(Boolean);

		let current = root;
		for (let i = 0; i < segments.length - 1; i++) {
			const key = segments[i];
			if (
				!key ||
				!current ||
				typeof current !== 'object' ||
				!(key in (current as Record<string, unknown>))
			) {
				return;
			}
			current = (current as Record<string, unknown>)[key];
		}

		const last = segments[segments.length - 1];
		if (
			current &&
			typeof current === 'object' &&
			last &&
			last in (current as Record<string, unknown>)
		) {
			(current as Record<string, unknown>)[last] = '[REDACTED]';
		}
	};

	for (const path of paths) {
		setAtPath(clone, path);
	}
	return clone;
}

export class TransformEngine {
	private renderers = new Map<
		PresentationTarget,
		PresentationRenderer<unknown>[]
	>();
	private validators: PresentationValidator[] = [];

	register<TOut>(renderer: PresentationRenderer<TOut>): this {
		const renderers = this.renderers.get(renderer.target) ?? [];
		renderers.push(renderer as PresentationRenderer<unknown>);
		this.renderers.set(renderer.target, renderers);
		return this;
	}

	prependRegister<TOut>(renderer: PresentationRenderer<TOut>): this {
		const renderers = this.renderers.get(renderer.target) ?? [];
		renderers.unshift(renderer as PresentationRenderer<unknown>);
		this.renderers.set(renderer.target, renderers);
		return this;
	}

	addValidator(validator: PresentationValidator): this {
		this.validators.push(validator);
		return this;
	}

	async render<TOut = unknown>(
		target: PresentationTarget,
		desc: PresentationSpec,
		ctx?: RenderContext
	): Promise<TOut> {
		if (!desc.targets.includes(target)) {
			throw new Error(
				`Target ${target} not declared for ${desc.meta.key}.v${desc.meta.version}`
			);
		}

		for (const validator of this.validators) {
			await validator.validate(desc, target, ctx);
		}

		const renderers = this.renderers.get(target) ?? [];
		for (const renderer of renderers) {
			try {
				return (await renderer.render(desc, ctx)) as TOut;
			} catch {
				// Try the next renderer in the chain.
			}
		}

		throw new Error(`No renderer available for ${target}`);
	}
}

export function createDefaultTransformEngine(): TransformEngine {
	const engine = new TransformEngine();

	engine.register<{ mimeType: 'text/markdown'; body: string }>({
		target: 'markdown',
		async render(desc, ctx) {
			let data = ctx?.data;
			if (!data && ctx?.fetchData) {
				data = await ctx.fetchData();
			}

			if (
				desc.source.type === 'component' &&
				desc.source.props &&
				data !== undefined
			) {
				const isArray = Array.isArray(data);
				const isSimpleObject =
					!isArray &&
					typeof data === 'object' &&
					data !== null &&
					!Object.values(data).some(
						(value) =>
							Array.isArray(value) ||
							(typeof value === 'object' && value !== null)
					);

				if (isArray || isSimpleObject) {
					return {
						mimeType: 'text/markdown',
						body: schemaToMarkdown(desc.source.props, data, {
							title: desc.meta.description ?? desc.meta.key,
							description: `${desc.meta.key} v${desc.meta.version}`,
						}),
					};
				}

				throw new Error(
					`Complex data structure for ${desc.meta.key} - expecting custom renderer`
				);
			}

			if (desc.source.type === 'blocknotejs') {
				const redacted = applyPii(desc, {
					text: blockNoteToMarkdown(desc.source.docJson),
				}) as { text?: string };
				return {
					mimeType: 'text/markdown',
					body: String(redacted.text ?? ''),
				};
			}

			if (desc.source.type === 'component' && data !== undefined) {
				throw new Error(
					`No schema (source.props) available for ${desc.meta.key} - expecting custom renderer`
				);
			}

			if (desc.source.type !== 'component') {
				throw new Error('unsupported');
			}

			const header = `# ${desc.meta.key} v${desc.meta.version}`;
			const about = desc.meta.description ? `\n\n${desc.meta.description}` : '';
			const tags =
				desc.meta.tags && desc.meta.tags.length
					? `\n\nTags: ${desc.meta.tags.join(', ')}`
					: '';
			const owners =
				desc.meta.owners && desc.meta.owners.length
					? `\n\nOwners: ${desc.meta.owners.join(', ')}`
					: '';
			const component = `\n\nComponent: \`${desc.source.componentKey}\``;
			const policy = desc.policy?.pii?.length
				? `\n\nRedacted paths: ${desc.policy.pii.map((path) => `\`${path}\``).join(', ')}`
				: '';
			return {
				mimeType: 'text/markdown',
				body: `${header}${about}${tags}${owners}${component}${policy}`,
			};
		},
	});

	engine.register<{ mimeType: 'application/json'; body: string }>({
		target: 'application/json',
		async render(desc) {
			const payload = applyPii(desc, { meta: desc.meta, source: desc.source });
			let body: string;
			try {
				body = JSON.stringify(payload, null, 2);
			} catch {
				body = JSON.stringify(
					{
						meta: { key: desc.meta.key, version: desc.meta.version },
						source: '[non-serializable]',
					},
					null,
					2
				);
			}
			return { mimeType: 'application/json', body };
		},
	});

	engine.register<{ mimeType: 'application/xml'; body: string }>({
		target: 'application/xml',
		async render(desc) {
			const payload = applyPii(desc, { meta: desc.meta, source: desc.source });
			let json: string;
			try {
				json = JSON.stringify(payload);
			} catch {
				json = JSON.stringify({
					meta: { key: desc.meta.key, version: desc.meta.version },
					source: '[non-serializable]',
				});
			}
			return {
				mimeType: 'application/xml',
				body: `<presentation name="${desc.meta.key}" version="${desc.meta.version}"><json>${encodeURIComponent(json)}</json></presentation>`,
			};
		},
	});

	return engine;
}

export function registerBasicValidation(
	engine: TransformEngine
): TransformEngine {
	engine.addValidator({
		validate(desc) {
			if (!desc.meta.description || desc.meta.description.length < 3) {
				throw new Error(
					`Presentation ${desc.meta.key}.v${desc.meta.version} missing meta.description`
				);
			}
		},
	});
	return engine;
}

export { blockNoteToMarkdown, htmlToMarkdown };
