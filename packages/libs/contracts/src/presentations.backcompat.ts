import type { PresentationSpec } from './presentations';
import type { PresentationDescriptorV2 } from './presentations.v2';

export function toV2FromV1(v1: PresentationSpec): PresentationDescriptorV2 {
  if (v1.content.kind === 'web_component') {
    return {
      meta: { ...v1.meta },
      policy: v1.policy,
      source: {
        type: 'component',
        framework: v1.content.framework,
        componentKey: v1.content.componentKey,
        props: v1.content.props,
      },
      targets: ['react', 'application/json', 'application/xml'],
    };
  }
  if (v1.content.kind === 'markdown') {
    return {
      meta: { ...v1.meta },
      policy: v1.policy,
      source: {
        type: 'blocknotejs',
        docJson: v1.content.content ?? v1.content.resourceUri ?? '',
      },
      targets: ['markdown', 'application/json', 'application/xml'],
    };
  }
  return {
    meta: { ...v1.meta },
    policy: v1.policy,
    source: {
      type: 'blocknotejs',
      docJson: { kind: 'data', mimeType: v1.content.mimeType, model: 'schema' },
    },
    targets: ['application/json', 'application/xml'],
  };
}
