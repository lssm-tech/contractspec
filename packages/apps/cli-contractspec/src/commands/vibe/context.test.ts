
import { describe, it, expect } from 'bun:test';
import { vibeContextCommand } from './context';

describe('vibe context command', () => {
    it('has export subcommand', () => {
        const found = vibeContextCommand.commands.find(c => c.name() === 'export');
        expect(found).toBeDefined();
        expect(found?.description()).toContain('Export a safe context bundle');
    });
});
