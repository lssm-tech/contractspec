
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { vibeInitCommand } from './init';

// Mock dependencies
const mockMkdir = mock(() => Promise.resolve(undefined));
const mockWriteFile = mock(() => Promise.resolve(undefined));
const mockExistsSync = mock(() => false);
const mockProcessExit = mock(() => undefined);

// We need to mock module imports. In Bun test we can mock modules.
// However, since we are importing the command object which *uses* the modules inside the action,
// mocking `node:fs` globally might be tricky depending on how bun test handles it.
// For now, I'll write a simple test that checks the command configuration.

describe('vibe init command', () => {
    it('has correct name and description', () => {
        expect(vibeInitCommand.name()).toBe('init');
        expect(vibeInitCommand.description()).toBe('Initialize ContractSpec Vibe in your project');
    });

    it('has force option', () => {
        const forceOption = vibeInitCommand.options.find(o => o.attributeName() === 'force');
        expect(forceOption).toBeDefined();
        expect(forceOption?.flags).toContain('-f, --force');
    });
});
