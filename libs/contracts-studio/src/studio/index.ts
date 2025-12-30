import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

const OWNERS = ['platform.contractspec-studio'] as const;

export const StudioProjectCapability = defineCapability({
  meta: {
    key: 'studio.project',
    version: '1.0.0',
    kind: 'api',
    title: 'Studio Project Lifecycle',
    description:
      'Create, update, archive, and deploy Studio projects across shared or dedicated infrastructure.',
    domain: 'studio',
    owners: [...OWNERS],
    tags: ['studio', 'projects', 'deployment'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'studio.project.create',
      version: '1.0.0',
      description: 'Create a new Studio project scoped to an organization.',
    },
    {
      surface: 'operation',
      key: 'studio.project.update',
      version: '1.0.0',
      description: 'Update core metadata, tier, and BYOK settings.',
    },
    {
      surface: 'operation',
      key: 'studio.project.delete',
      version: '1.0.0',
      description: 'Archive or delete a Studio project safely.',
    },
    {
      surface: 'operation',
      key: 'studio.project.deploy',
      version: '1.0.0',
      description: 'Trigger shared or dedicated deployment workflows.',
    },
  ],
});

export const SpecEditorCapability = defineCapability({
  meta: {
    key: 'studio.spec-editor',
    version: '1.0.0',
    kind: 'api',
    title: 'Studio Spec Authoring',
    description:
      'Manage capability, workflow, policy, and component specs with validation and preview services.',
    domain: 'studio',
    owners: [...OWNERS],
    tags: ['studio', 'specs', 'editor'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'studio.spec.create',
      version: '1.0.0',
      description:
        'Create a spec for capabilities, workflows, policies, or components.',
    },
    {
      surface: 'operation',
      key: 'studio.spec.update',
      version: '1.0.0',
      description: 'Update spec metadata, content, or overlays.',
    },
    {
      surface: 'operation',
      key: 'studio.spec.validate',
      version: '1.0.0',
      description: 'Run structural and contract validation on a spec draft.',
    },
    {
      surface: 'operation',
      key: 'studio.spec.preview',
      version: '1.0.0',
      description: 'Produce a runnable preview state from a spec draft.',
    },
  ],
  requires: [{ key: 'studio.project', version: '1.0.0' }],
});

export const VisualBuilderCapability = defineCapability({
  meta: {
    key: 'studio.visual-builder',
    version: '1.0.0',
    kind: 'ui',
    title: 'Studio Visual Builder',
    description:
      'Drag-and-drop canvas, component palette, and code generation for Studio experiences.',
    domain: 'studio',
    owners: [...OWNERS],
    tags: ['studio', 'visual-builder', 'ui'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'studio.canvas.render',
      version: '1.0.0',
      description: 'Render a canvas state from project specs and overlays.',
    },
    {
      surface: 'operation',
      key: 'studio.canvas.component.add',
      version: '1.0.0',
      description: 'Add a component to the visual builder canvas.',
    },
    {
      surface: 'operation',
      key: 'studio.canvas.component.update',
      version: '1.0.0',
      description: 'Update properties or bindings for a canvas component.',
    },
    {
      surface: 'operation',
      key: 'studio.canvas.generateCode',
      version: '1.0.0',
      description:
        'Generate production-ready code artifacts from a canvas snapshot.',
    },
  ],
  requires: [
    { key: 'studio.project', version: '1.0.0' },
    { key: 'studio.spec-editor', version: '1.0.0' },
  ],
});
