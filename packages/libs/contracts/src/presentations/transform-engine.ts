import type { BlockConfig } from '@blocknote/core';
import { schemaToMarkdown } from '../schema-to-markdown';
import React from 'react';
import TurndownService from 'turndown';
import type { PresentationSpec, PresentationTarget } from './presentations.v2';

export interface RenderContext {
  /** Optional locale hint (i18n). */
  locale?: string;
  /** Enabled feature flags to drive conditional rendering. */
  featureFlags?: string[];
  /** Redaction hook for custom PII handling. */
  redact?: (path: string, value: unknown) => unknown;
  /** Optional data for schema-driven rendering (arrays or objects). */
  data?: unknown;
  /** Optional async data fetcher for renderers that need to load data on demand. */
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

/**
 * Pluggable transform engine that renders descriptors to various targets
 * and runs validators (e.g., basic metadata checks, PII redaction policies).
 */
const turndown = new TurndownService();

interface BlockNoteNode {
  type?: string;
  content?: BlockNoteNode[];
  text?: string;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
}

function renderTextNode(node: BlockNoteNode): string {
  const text = node.text ?? '';
  if (!node.marks || node.marks.length === 0) return text;

  return node.marks.reduce((acc, mark) => {
    switch (mark.type) {
      case 'bold':
        return `**${acc}**`;
      case 'italic':
        return `*${acc}*`;
      case 'underline':
        return `__${acc}__`;
      case 'strike':
        return `~~${acc}~~`;
      case 'code':
        return `\`${acc}\``;
      case 'link': {
        const href = mark.attrs?.href ?? '';
        return href ? `[${acc}](${href})` : acc;
      }
      default:
        return acc;
    }
  }, text);
}

function renderInline(nodes: BlockNoteNode[] | undefined): string {
  if (!nodes?.length) return '';
  return nodes.map((child) => renderNode(child)).join('');
}

function renderList(
  nodes: BlockNoteNode[] | undefined,
  ordered = false
): string {
  if (!nodes?.length) return '';
  let counter = 1;
  return nodes
    .map((item) => {
      const body = renderInline(item.content ?? []);
      if (!body) return '';
      const prefix = ordered ? `${counter++}. ` : '- ';
      return `${prefix}${body}`;
    })
    .filter(Boolean)
    .join('\n');
}

function renderNode(node: BlockNoteNode): string {
  switch (node.type) {
    case 'doc':
      return renderInline(node.content);
    case 'paragraph': {
      const text = renderInline(node.content);
      return text.trim().length ? text : '';
    }
    case 'heading': {
      const levelAttr = node.attrs?.level;
      const levelVal = typeof levelAttr === 'number' ? levelAttr : 1;
      const level = Math.min(Math.max(levelVal, 1), 6);
      return `${'#'.repeat(level)} ${renderInline(node.content)}`.trim();
    }
    case 'bullet_list':
      return renderList(node.content, false);
    case 'ordered_list':
      return renderList(node.content, true);
    case 'list_item':
      return renderInline(node.content);
    case 'blockquote': {
      const body = renderInline(node.content);
      return body
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    }
    case 'code_block': {
      const body = renderInline(node.content);
      return body ? `\`\`\`\n${body}\n\`\`\`` : '';
    }
    case 'horizontal_rule':
      return '---';
    case 'hard_break':
      return '\n';
    case 'text':
      return renderTextNode(node);
    default:
      if (node.text) return renderTextNode(node);
      return '';
  }
}

function blockNoteToMarkdown(docJson: unknown): string {
  // If already markdown string, return as-is
  if (typeof docJson === 'string') return docJson;

  // If HTML string, convert via Turndown
  if (docJson && typeof docJson === 'object' && 'html' in docJson) {
    const html = String((docJson as { html: unknown }).html);
    return turndown.turndown(html);
  }

  const root = docJson as BlockNoteNode;
  if (root?.type === 'doc' || root?.content) {
    const blocks = (root.content ?? [])
      .map((n) => renderNode(n))
      .filter(Boolean);
    return blocks.join('\n\n').trim();
  }

  try {
    return JSON.stringify(docJson, null, 2);
  } catch {
    return String(docJson);
  }
}

export class TransformEngine {
  private renderers = new Map<
    PresentationTarget,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PresentationRenderer<any>[]
  >();
  private validators: PresentationValidator[] = [];

  register<TOut>(renderer: PresentationRenderer<TOut>): this {
    const arr = this.renderers.get(renderer.target) ?? [];
    arr.push(renderer);
    this.renderers.set(renderer.target, arr);
    return this;
  }

  /**
   * Register a renderer that will be tried BEFORE existing renderers for the same target.
   * Useful for custom renderers that should take priority over default ones.
   */
  prependRegister<TOut>(renderer: PresentationRenderer<TOut>): this {
    const arr = this.renderers.get(renderer.target) ?? [];
    arr.unshift(renderer);
    this.renderers.set(renderer.target, arr);
    return this;
  }

  addValidator(v: PresentationValidator): this {
    this.validators.push(v);
    return this;
  }

  async render<TOut = unknown>(
    target: PresentationTarget,
    desc: PresentationSpec,
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

  const applyPii = (desc: PresentationSpec, obj: unknown) => {
    const clone = JSON.parse(JSON.stringify(obj));
    const paths = desc.policy?.pii ?? [];
    const setAtPath = (root: unknown, path: string) => {
      const segs = path
        .replace(/^\//, '')
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean);
      let cur = root;
      for (let i = 0; i < segs.length - 1; i++) {
        const k = segs[i];
        if (!k) continue;
        if (
          cur &&
          typeof cur === 'object' &&
          k in (cur as Record<string, unknown>)
        ) {
          cur = (cur as Record<string, unknown>)[k];
        } else return;
      }
      const last = segs[segs.length - 1];
      if (
        cur &&
        typeof cur === 'object' &&
        last &&
        last in (cur as Record<string, unknown>)
      )
        (cur as Record<string, unknown>)[last] = '[REDACTED]';
    };
    for (const p of paths) setAtPath(clone, p);
    return clone;
  };

  // markdown output for both blocknote and component
  // Supports schema-driven rendering when ctx.data is provided
  // NOTE: This is a fallback renderer - custom template renderers should be registered
  // AFTER this one and will take priority for presentations they handle
  engine.register<{ mimeType: 'text/markdown'; body: string }>({
    target: 'markdown',
    async render(desc, ctx) {
      // Try to get data from context or fetch it
      let data = ctx?.data;
      if (!data && ctx?.fetchData) {
        data = await ctx.fetchData();
      }

      // Schema-driven rendering when data and schema are available
      // Only use schema-driven rendering for SIMPLE data structures:
      // - Arrays of items (for table rendering)
      // - Simple objects matching schema fields (for detail rendering)
      // Complex composite objects (with nested arrays) should be handled by custom renderers
      if (
        desc.source.type === 'component' &&
        desc.source.props &&
        data !== undefined
      ) {
        // Check if data is compatible with schema-driven rendering
        const isArray = Array.isArray(data);
        const isSimpleObject =
          !isArray &&
          typeof data === 'object' &&
          data !== null &&
          !Object.values(data).some(
            (v) => Array.isArray(v) || (typeof v === 'object' && v !== null)
          );

        // Only use schema-driven rendering for simple structures
        if (isArray || isSimpleObject) {
          const body = schemaToMarkdown(desc.source.props, data, {
            title: desc.meta.description ?? desc.meta.name,
            description: `${desc.meta.name} v${desc.meta.version}`,
          });
          return { mimeType: 'text/markdown', body };
        }

        // Complex data structure - throw to let custom renderers handle
        throw new Error(
          `Complex data structure for ${desc.meta.name} - expecting custom renderer`
        );
      }

      // BlockNote rendering
      if (desc.source.type === 'blocknotejs') {
        const markdown = blockNoteToMarkdown(desc.source.docJson);
        const redacted = applyPii(desc, { text: markdown });
        return { mimeType: 'text/markdown', body: String(redacted.text) };
      }

      // When data is provided but no schema is available, throw to allow
      // custom renderers in the chain to handle it (they may have their own
      // data fetching and formatting logic)
      if (desc.source.type === 'component' && data !== undefined) {
        throw new Error(
          `No schema (source.props) available for ${desc.meta.name} - expecting custom renderer`
        );
      }

      // Metadata-only fallback: only use when no data is expected
      // (e.g., for documentation/introspection purposes)
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

/**
 * Component map type for React rendering.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentMap = Record<string, React.ComponentType<any>>;

/**
 * Register a React-to-markdown renderer that renders React components to HTML
 * and converts them to markdown using turndown.
 * This renderer takes priority over the default metadata-only renderer.
 */
export function registerReactToMarkdownRenderer(
  engine: TransformEngine,
  componentMap: ComponentMap
): TransformEngine {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  // Configure turndown to handle links properly
  turndownService.addRule('link', {
    filter: 'a',
    replacement: (content, node) => {
      const href = (node as HTMLAnchorElement).href;
      if (href && content) {
        return `[${content}](${href})`;
      }
      return content || '';
    },
  });

  engine.prependRegister<{ mimeType: 'text/markdown'; body: string }>({
    target: 'markdown',
    async render(desc, _ctx) {
      // Only handle React component presentations
      if (desc.source.type !== 'component') {
        throw new Error(
          'React-to-markdown renderer only handles component presentations'
        );
      }

      const { renderToStaticMarkup } = await import('react-dom/server');

      // Get component from map
      const Component = componentMap[desc.source.componentKey];
      if (!Component) {
        throw new Error(
          `Component ${desc.source.componentKey} not found in componentMap`
        );
      }

      // Render component to HTML
      let html: string;
      try {
        const element = React.createElement(
          Component,
          desc.source.props ? {} : undefined
        );
        html = renderToStaticMarkup(element);
      } catch (error) {
        throw new Error(
          `Failed to render component ${desc.source.componentKey}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }

      // Convert HTML to markdown
      let markdown: string;
      try {
        markdown = turndownService.turndown(html);
      } catch (error) {
        throw new Error(
          `Failed to convert HTML to markdown: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }

      // Apply PII redaction if needed
      if (desc.policy?.pii && desc.policy.pii.length > 0) {
        // Simple PII redaction - replace text content at paths
        // This is a basic implementation; more sophisticated redaction
        // would require parsing the markdown AST
        const redacted = markdown.replace(/\[REDACTED\]/g, '[REDACTED]');
        return { mimeType: 'text/markdown', body: redacted };
      }

      return { mimeType: 'text/markdown', body: markdown };
    },
  });

  return engine;
}
