import { describe, expect, it } from 'bun:test';
import {
  generateHandlerTemplate,
  generateComponentTemplate,
  generateTestTemplate,
} from './handler';

describe('Handler Templates', () => {
  describe('generateHandlerTemplate', () => {
    it('generates a handler template', () => {
      const code = generateHandlerTemplate('test.op', 'command');
      expect(code).toContain("import type { ContractHandler } from '@contractspec/lib.contracts'");
      expect(code).toContain('export const testOpHandler: ContractHandler<typeof TestOpSpec>');
      expect(code).toContain('// TODO: Implement command logic');
    });
  });

  describe('generateComponentTemplate', () => {
    it('generates a component template', () => {
      const code = generateComponentTemplate('MyComponent', 'A test component');
      expect(code).toContain("import React from 'react'");
      expect(code).toContain('interface MyComponentProps');
      expect(code).toContain('export const MyComponent: React.FC<MyComponentProps>');
      expect(code).toContain('A test component');
    });
  });

  describe('generateTestTemplate', () => {
    it('generates a handler test', () => {
      const code = generateTestTemplate('test.op', 'handler');
      expect(code).toContain("import { TestOp } from '../handlers/test-op'");
      expect(code).toContain("describe('TestOp'");
      expect(code).toContain("it('should handle valid input'");
    });

    it('generates a component test', () => {
      const code = generateTestTemplate('MyComponent', 'component');
      expect(code).toContain("import { MyComponent } from '../components/my-component'");
      expect(code).toContain("describe('MyComponent'");
      expect(code).toContain("it('should render correctly'");
    });
  });
});
