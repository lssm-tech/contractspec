import { StabilityEnum } from '../ownership';

export const DOCS_DOMAIN = 'docs';
export const DOCS_OWNERS = ['docs-platform'];
export const DOCS_TAGS = ['docs', 'documentation'];
export const DOCS_STABILITY = StabilityEnum.Experimental;

export const DOCS_CAPABILITY_KEY = 'docs.system';
export const DOCS_CAPABILITY_VERSION = '1.0.0';

export const DOCS_CAPABILITY_REF = {
  key: DOCS_CAPABILITY_KEY,
  version: DOCS_CAPABILITY_VERSION,
};

export const DOCS_LAYOUT_PRESENTATION_KEY = 'docs.layout';
export const DOCS_REFERENCE_PRESENTATION_KEY = 'docs.reference.page';
