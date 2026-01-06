import { describe, it, expect } from 'bun:test';
import {
  generateHandlerTemplate,
  generateComponentTemplate,
  generateTestTemplate,
} from './handler.template';

describe('Handler Template', () => {
  describe('generateHandlerTemplate', () => {
    it('should generate a command handler', () => {
      const code = generateHandlerTemplate('my.awesome.command', 'command');
      expect(code).toContain(
        "import { CommandSpec } from '../contracts/my-awesome-command.contracts'"
      );
      expect(code).toContain(
        'export const commandHandler: ContractHandler<typeof CommandSpec>'
      );
      expect(code).toContain('// TODO: Implement command logic');
    });

    it('should generate a query handler', () => {
      const code = generateHandlerTemplate('my.awesome.query', 'query');
      expect(code).toContain('// TODO: Implement query logic');
    });
  });

  describe('generateComponentTemplate', () => {
    it('should generate a component', () => {
      const code = generateComponentTemplate('MyComponent', 'A nice component');
      expect(code).toContain('interface MyComponentProps');
      expect(code).toContain(
        'export const MyComponent: React.FC<MyComponentProps>'
      );
      expect(code).toContain(' * A nice component');
    });
  });

  describe('generateTestTemplate', () => {
    it('should generate a handler test', () => {
      const code = generateTestTemplate('my.handler', 'handler');
      expect(code).toContain(
        "import { MyHandler } from '../handlers/my-handler'"
      );
      expect(code).toContain("describe('MyHandler'");
      expect(code).toContain('should handle valid input');
    });

    it('should generate a component test', () => {
      const code = generateTestTemplate('MyComponent', 'component');
      expect(code).toContain(
        "import { MyComponent } from '../components/my-component'"
      );
      expect(code).toContain('should render correctly');
      expect(code).toContain('should be accessible');
    });
  });
});
