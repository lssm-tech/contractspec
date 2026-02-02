// import { describe, expect, it } from 'bun:test';
// import { validateSpecStructure } from './spec-structure';
//
// describe('validateSpecStructure', () => {
//   it('should validate operation with numeric version', () => {
//     const code = `
//             import { defineCommand } from '@contractspec/lib.contracts';
//             export const MyCommand = defineCommand({
//                 meta: {
//                     key: 'my.command',
//                     version: 1,
//                     description: 'desc'
//                 },
//                 io: {},
//                 policy: {}
//             });
//         `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.valid).toBe(true);
//     expect(result.errors).toHaveLength(0);
//   });
//
//   it('should validate operation with string version', () => {
//     const code = `
//             import { defineCommand } from '@contractspec/lib.contracts';
//             export const MyCommand = defineCommand({
//                 meta: {
//                     key: 'my.command',
//                     version: '1.0.0',
//                     description: 'desc'
//                 },
//                 io: {},
//                 policy: {}
//             });
//         `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.valid).toBe(true);
//     expect(result.errors).toHaveLength(0);
//   });
//
//   it('should detect missing defineCommand call', () => {
//     const code = `
//       export const op = {
//         meta: { key: 'op', version: '1.0.0' }
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.valid).toBe(false);
//     expect(result.errors).toContain(
//       'Missing defineCommand or defineQuery call'
//     );
//   });
//
//   it('should detect missing meta section', () => {
//     const code = `
//       export const op = defineCommand({
//         io: {},
//         policy: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.valid).toBe(false);
//     expect(result.errors).toContain('Missing meta section');
//   });
//
//   it('should detect missing io section', () => {
//     const code = `
//       export const op = defineCommand({
//         meta: { key: 'op', version: '1.0.0' },
//         policy: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.valid).toBe(false);
//     expect(result.errors).toContain('Missing io section');
//   });
//
//   it('should detect missing policy section', () => {
//     const code = `
//       export const op = defineCommand({
//         meta: { key: 'op', version: '1.0.0' },
//         io: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.valid).toBe(false);
//     expect(result.errors).toContain('Missing policy section');
//   });
//
//   it('should detect missing imports', () => {
//     const code = `
//       export const op = defineCommand({
//         meta: { key: 'op', version: '1.0.0' },
//         io: { inputs: [{ name: 'f', type: SchemaModel.String }] },
//         policy: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.valid).toBe(false);
//     expect(result.errors).toContain(
//       'Missing import for SchemaModel from @contractspec/lib.schema'
//     );
//     expect(result.errors).toContain(
//       'Missing import from @contractspec/lib.contracts'
//     );
//   });
//
//   it('should warning on missing acceptance criteria', () => {
//     const code = `
//       import { defineCommand } from '@contractspec/lib.contracts';
//       export const op = defineCommand({
//         meta: { key: 'op', version: '1' },
//         io: {},
//         policy: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.warnings).toContain('No acceptance scenarios defined');
//   });
//
//   it('should detect TODOs', () => {
//     const code = `
//       import { defineCommand } from '@contractspec/lib.contracts';
//       export const op = defineCommand({
//         meta: { key: 'op', version: '1' }, // TODO: fix version
//         io: {},
//         policy: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.warnings).toContain(
//       'Contains TODO items that need completion'
//     );
//   });
//
//   it('should validate owners format', () => {
//     const code = `
//       import { defineCommand } from '@contractspec/lib.contracts';
//       export const op = defineCommand({
//         meta: {
//           key: 'op',
//           version: '1',
//           owners: ['john']
//         },
//         io: {},
//         policy: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.operation.ts');
//     expect(result.warnings).toContain(
//       'Owners should start with @ or use an Enum/Constant'
//     );
//   });
//
//   it('should validate event with string version', () => {
//     const code = `
//             import { defineEvent } from '@contractspec/lib.contracts';
//             export const MyEvent = defineEvent({
//                 meta: {
//                     key: 'my.event.created',
//                     version: '1.0.0'
//                 },
//                 payload: {}
//             });
//         `;
//     const result = validateSpecStructure(code, 'my.event.ts');
//     expect(result.valid).toBe(true);
//     expect(result.errors).toHaveLength(0);
//   });
//
//   it('should detect improper event names', () => {
//     const code = `
//       import { defineEvent } from '@contractspec/lib.contracts';
//       export const e = defineEvent({
//         meta: { key: 'k', version: '1', name: 'User.save' },
//         payload: {}
//       });
//     `;
//     const result = validateSpecStructure(code, 'my.event.ts');
//     expect(result.warnings).toContain(
//       'Event name should use past tense (e.g., "created", "updated")'
//     );
//   });
//
//   it('should validate migration with string version', () => {
//     const code = `
//             import { defineMigration } from '@contractspec/lib.contracts';
//             export const MyMigration: MigrationSpec = {
//                 name: 'my-migration',
//                 version: '1.0.0',
//                 plan: { up: [] }
//             };
//         `;
//     const result = validateSpecStructure(code, 'my.migration.ts');
//     expect(result.valid).toBe(true);
//     expect(result.errors).toHaveLength(0);
//   });
//
//   it('should validate telemetry specs', () => {
//     const code = `
//       import { TelemetrySpec } from '@contractspec/lib.contracts';
//       export const t: TelemetrySpec = {
//         meta: { name: 't' },
//         privacy: 'public',
//         events: []
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.telemetry.ts');
//     expect(result.valid).toBe(true);
//   });
//
//   it('should ignore telemetry spec missing type annotation', () => {
//     const code = `
//       export const t = {};
//     `;
//     const result = validateSpecStructure(code, 'my.telemetry.ts');
//     expect(result.errors).toContain('Missing TelemetrySpec type annotation');
//   });
//
//   it('should validate experiment specs', () => {
//     const code = `
//       import { ExperimentSpec } from '@contractspec/lib.contracts';
//       export const e: ExperimentSpec = {
//         controlVariant: 'a',
//         variants: {},
//         allocation: {}
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.experiment.ts');
//     expect(result.valid).toBe(true);
//   });
//
//   it('should detect missing experiment fields', () => {
//     const code = `
//       import { ExperimentSpec } from '@contractspec/lib.contracts';
//       export const e: ExperimentSpec = {
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.experiment.ts');
//     expect(result.errors).toContain(
//       'ExperimentSpec must declare controlVariant'
//     );
//     expect(result.errors).toContain('ExperimentSpec must declare variants');
//     expect(result.warnings).toContain(
//       'ExperimentSpec missing allocation configuration'
//     );
//   });
//
//   it('should validate app config specs', () => {
//     const code = `
//       import { AppBlueprintSpec } from '@contractspec/lib.contracts';
//       export const a: AppBlueprintSpec = {
//         meta: { appId: '1' },
//         capabilities: {}
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.app-config.ts');
//     expect(result.valid).toBe(true);
//   });
//
//   it('should detect missing app config fields', () => {
//     const code = `
//       import { AppBlueprintSpec } from '@contractspec/lib.contracts';
//       export const a: AppBlueprintSpec = {
//         meta: {}
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.app-config.ts');
//     expect(result.warnings).toContain(
//       'AppBlueprint meta missing appId assignment'
//     );
//     expect(result.warnings).toContain(
//       'App blueprint spec does not declare capabilities'
//     );
//   });
//
//   it('should validate data view specs', () => {
//     const code = `
//       import { DataViewSpec } from '@contractspec/lib.contracts';
//       export const v: DataViewSpec = {
//         meta: {},
//         source: {},
//         view: { kind: 'list' },
//         fields: []
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.data-view.ts');
//     expect(result.valid).toBe(true);
//   });
//
//   it('should detect missing data view fields', () => {
//     const code = `
//       import { DataViewSpec } from '@contractspec/lib.contracts';
//       export const v: DataViewSpec = {
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.data-view.ts');
//     expect(result.errors).toContain('Missing meta section');
//     expect(result.errors).toContain('Missing source section');
//     expect(result.errors).toContain('Missing view section');
//     expect(result.errors).toContain(
//       'Missing or invalid view.kind (list/table/detail/grid)'
//     );
//     expect(result.warnings).toContain('No fields defined for data view');
//   });
//
//   it('should validate workflow specs', () => {
//     const code = `
//       import { WorkflowSpec } from '@contractspec/lib.contracts';
//       export const w: WorkflowSpec = {
//         meta: { title: 'w', domain: 'd' },
//         definition: {
//           steps: {},
//           transitions: {}
//         }
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.workflow.ts');
//     expect(result.valid).toBe(true);
//   });
//
//   it('should detect missing workflow fields', () => {
//     const code = `
//       import { WorkflowSpec } from '@contractspec/lib.contracts';
//       export const w: WorkflowSpec = {
//         meta: {},
//         definition: {}
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.workflow.ts');
//     expect(result.errors).toContain('Workflow must declare steps');
//     expect(result.warnings).toContain(
//       'No transitions declared; workflow will complete after first step.'
//     );
//     expect(result.warnings).toContain('Missing workflow title');
//     expect(result.warnings).toContain('Missing domain field');
//   });
//
//   it('should validate presentation specs', () => {
//     const code = `
//       import { PresentationSpec } from '@contractspec/lib.contracts';
//       export const p: PresentationSpec = {
//         meta: {},
//         source: { type: 'component' },
//         targets: {}
//       };
//     `;
//     const result = validateSpecStructure(code, 'my.presentation.ts');
//     expect(result.valid).toBe(true);
//   });
//
//   it('should detect missing presentation fields', () => {
//     const code = `
//       import { PresentationSpec } from '@contractspec/lib.contracts';
//       export const p: PresentationSpec = {};
//     `;
//     const result = validateSpecStructure(code, 'my.presentation.ts');
//     expect(result.errors).toContain('Missing meta section');
//     expect(result.errors).toContain('Missing source section');
//     expect(result.errors).toContain('Missing targets section');
//   });
// });
