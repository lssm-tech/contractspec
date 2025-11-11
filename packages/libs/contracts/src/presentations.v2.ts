import type { AnySchemaModel } from '@lssm/lib.schema';
import type { OwnerShipMeta } from './ownership';
import type { BlockConfig } from '@blocknote/core';

/** Supported render targets for the transform engine and descriptors. */
export type PresentationTarget =
  | 'react'
  | 'markdown'
  | 'application/json'
  | 'application/xml';

export interface PresentationV2Meta extends Partial<OwnerShipMeta> {
  /** Fully-qualified presentation name (e.g., "sigil.auth.webauth_tabs_v2"). */
  name: string;
  /** Version of this descriptor. Increment on breaking changes. */
  version: number;
  /** Human-readable description for docs/a11y. Required by validators. */
  description?: string;
}

/** React component presentation source. */
export interface PresentationSourceComponentReact {
  /** Source marker for React component presentations. */
  type: 'component';
  /** Framework for the component source (currently only 'react'). */
  framework: 'react';
  /** Component key resolved by host `componentMap`. */
  componentKey: string;
  /** Optional props schema to validate against. */
  props?: AnySchemaModel;
}

/** BlockNoteJS document presentation source. */
export interface PresentationSourceBlocknotejs {
  /** Source marker for BlockNoteJS document presentations. */
  type: 'blocknotejs';
  /** BlockNoteJS JSON document. */
  docJson: unknown;
  /** Optional BlockNote config to guide rendering. */
  blockConfig?: BlockConfig;
}

export type PresentationSource =
  | PresentationSourceComponentReact
  | PresentationSourceBlocknotejs;

/**
 * Normalized presentation descriptor decoupled from framework/adapters.
 * Renderers and validators are provided via TransformEngine.
 */
export interface PresentationDescriptorV2 {
  meta: PresentationV2Meta;
  policy?: { flags?: string[]; pii?: string[] };
  source: PresentationSource;
  targets: PresentationTarget[]; // which outputs are supported by transforms
}

export interface RenderContext {
  /** Optional locale hint (i18n). */
  locale?: string;
  /** Enabled feature flags to drive conditional rendering. */
  featureFlags?: string[];
  /** Redaction hook for custom PII handling. */
  redact?: (path: string, value: unknown) => unknown;
}

export interface PresentationRenderer<TOut> {
  target: PresentationTarget;
  render: (
    desc: PresentationDescriptorV2,
    ctx?: RenderContext
  ) => Promise<TOut>;
}

export interface PresentationValidator {
  validate: (
    desc: PresentationDescriptorV2,
    target: PresentationTarget,
    ctx?: RenderContext
  ) => Promise<void> | void;
}

/**
 * Pluggable transform engine that renders descriptors to various targets
 * and runs validators (e.g., basic metadata checks, PII redaction policies).
 */
export class TransformEngine {
  private renderers = new Map<
    PresentationTarget,
    PresentationRenderer<any>[]
  >();
  private validators: PresentationValidator[] = [];

  register<TOut>(renderer: PresentationRenderer<TOut>): this {
    const arr = this.renderers.get(renderer.target) ?? [];
    arr.push(renderer);
    this.renderers.set(renderer.target, arr);
    return this;
  }

  addValidator(v: PresentationValidator): this {
    this.validators.push(v);
    return this;
  }

  async render<TOut = unknown>(
    target: PresentationTarget,
    desc: PresentationDescriptorV2,
    ctx?: RenderContext
  ): Promise<TOut> {
    if (!desc.targets.includes(target))
      throw new Error(
        `Target ${target} not declared for ${desc.meta.name}.v${desc.meta.version}`
      );
    for (const v of this.validators) await v.validate(desc, target, ctx);
    const arr = this.renderers.get(target) ?? [];
    for (const r of arr) {
      try {
        const out = await r.render(desc, ctx);
        // first successful renderer wins
        return out as TOut;
      } catch (_e) {
        // try next
      }
    }
    throw new Error(`No renderer available for ${target}`);
  }
}

// Minimal built-ins (stubs). Host apps can register concrete adapters.
/** Create a TransformEngine instance with default markdown/json/xml renderers. */
export function createDefaultTransformEngine() {
  const engine = new TransformEngine();

  const applyPii = (desc: PresentationDescriptorV2, obj: any) => {
    const clone = JSON.parse(JSON.stringify(obj));
    const paths = desc.policy?.pii ?? [];
    const setAtPath = (root: any, path: string) => {
      const segs = path
        .replace(/^\//, '')
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean);
      let cur = root;
      for (let i = 0; i < segs.length - 1; i++) {
        const k = segs[i]!;
        if (cur && typeof cur === 'object' && k in cur) cur = cur[k];
        else return;
      }
      const last = segs[segs.length - 1];
      if (cur && typeof cur === 'object' && last && last in cur)
        cur[last] = '[REDACTED]';
    };
    for (const p of paths) setAtPath(clone, p);
    return clone;
  };

  // markdown output for both blocknote and component
  engine.register<{ mimeType: 'text/markdown'; body: string }>({
    target: 'markdown',
    async render(desc) {
      if (desc.source.type === 'blocknotejs') {
        // TODO: convert BlockNote doc JSON → markdown (placeholder for now)
        const raw =
          typeof desc.source.docJson === 'string'
            ? desc.source.docJson
            : JSON.stringify(desc.source.docJson);
        const redacted = applyPii(desc, { text: raw });
        return { mimeType: 'text/markdown', body: String(redacted.text) };
      }
      if (desc.source.type === 'component') {
        const header = `# ${desc.meta.name} v${desc.meta.version}`;
        const about = desc.meta.description
          ? `\n\n${desc.meta.description}`
          : '';
        const tags =
          desc.meta.tags && desc.meta.tags.length
            ? `\n\nTags: ${desc.meta.tags.join(', ')}`
            : '';
        const owners =
          desc.meta.owners && desc.meta.owners.length
            ? `\n\nOwners: ${desc.meta.owners.join(', ')}`
            : '';
        const comp = `\n\nComponent: \`${desc.source.componentKey}\``;
        const policy = desc.policy?.pii?.length
          ? `\n\nRedacted paths: ${desc.policy.pii.map((p) => `\`${p}\``).join(', ')}`
          : '';
        const body = `${header}${about}${tags}${owners}${comp}${policy}`;
        return { mimeType: 'text/markdown', body };
      }
      throw new Error('unsupported');
    },
  });

  // json snapshot of source
  engine.register<{ mimeType: 'application/json'; body: string }>({
    target: 'application/json',
    async render(desc) {
      const payload = applyPii(desc, { meta: desc.meta, source: desc.source });
      return {
        mimeType: 'application/json',
        body: JSON.stringify(payload, null, 2),
      };
    },
  });

  // xml (simple wrapper around json for now)
  engine.register<{ mimeType: 'application/xml'; body: string }>({
    target: 'application/xml',
    async render(desc) {
      const json = applyPii(desc, { meta: desc.meta, source: desc.source });
      const body = `<presentation name="${desc.meta.name}" version="${desc.meta.version}"><json>${encodeURIComponent(
        JSON.stringify(json)
      )}</json></presentation>`;
      return { mimeType: 'application/xml', body };
    },
  });

  return engine;
}

// React target returns a serializable descriptor the host can render.
/** Serializable render descriptor for React hosts. */
export type ReactRenderDescriptor =
  | {
      kind: 'react_component';
      componentKey: string;
      props?: Record<string, unknown>;
    }
  | { kind: 'blocknotejs'; docJson: unknown; blockConfig?: BlockConfig };

/** Register a default React target renderer that returns a serializable descriptor. */
export function registerDefaultReactRenderer(engine: TransformEngine) {
  engine.register<ReactRenderDescriptor>({
    target: 'react',
    async render(desc) {
      if (desc.source.type === 'component') {
        const props = desc.source.props
          ? desc.source.props.getZod().safeParse({}).success
            ? {}
            : undefined
          : undefined;
        return {
          kind: 'react_component',
          componentKey: desc.source.componentKey,
          props,
        } as ReactRenderDescriptor;
      }
      // blocknote
      return {
        kind: 'blocknotejs',
        docJson: desc.source.docJson,
        blockConfig: desc.source.blockConfig,
      } as ReactRenderDescriptor;
    },
  });
  return engine;
}

/**
 * Add basic validators (e.g., meta.description presence) to the engine.
 */
export function registerBasicValidation(engine: TransformEngine) {
  // Ensure description is provided for a11y/i18n/docs
  engine.addValidator({
    validate(desc) {
      if (!desc.meta.description || desc.meta.description.length < 3)
        throw new Error(
          `Presentation ${desc.meta.name}.v${desc.meta.version} missing meta.description`
        );
    },
  });
  return engine;
}
