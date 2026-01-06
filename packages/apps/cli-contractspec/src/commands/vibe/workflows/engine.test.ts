
import { describe, it, expect, mock } from 'bun:test';
import { runWorkflow } from './engine';
import type { Workflow, WorkflowContext } from './types';

describe('runWorkflow', () => {
    // Mock select prompt
    mock.module('@inquirer/prompts', () => ({
        select: mock(() => Promise.resolve('proceed')),
        confirm: mock(() => Promise.resolve(true))
    }));
    
    const mockContext: WorkflowContext = {
        root: '/request',
        config: {},
        dryRun: false,
        track: 'product',
        json: false,
    };

    it('executes steps in order', async () => {
        const step1Execute = mock(() => Promise.resolve());
        const step2Execute = mock(() => Promise.resolve());

        const workflow: Workflow = {
            id: 'test',
            name: 'Test Workflow',
            description: 'A test workflow',
            steps: [
                { id: '1', label: 'Step 1', execute: step1Execute },
                { id: '2', label: 'Step 2', execute: step2Execute },
            ]
        };

        const result = await runWorkflow(workflow, mockContext);

        expect(result.success).toBe(true);
        expect(step1Execute).toHaveBeenCalled();
        expect(step2Execute).toHaveBeenCalled();
        expect(result.stepsExecuted).toEqual(['1', '2']);
    });

    it('skips steps based on track', async () => {
        const step1Execute = mock(() => Promise.resolve());
        const step2Execute = mock(() => Promise.resolve());

        const workflow: Workflow = {
            id: 'test-track',
            name: 'Test Track Workflow',
            description: '...',
            steps: [
                { id: '1', label: 'Step 1', execute: step1Execute, tracks: ['quick'] },
                { id: '2', label: 'Step 2', execute: step2Execute, tracks: ['product'] },
            ]
        };

        const result = await runWorkflow(workflow, { ...mockContext, track: 'quick' });

        expect(result.success).toBe(true);
        expect(step1Execute).toHaveBeenCalled();
        expect(step2Execute).not.toHaveBeenCalled();
        expect(result.stepsExecuted).toEqual(['1']);
    });

    it('fails if a step fails', async () => {
         const step1Execute = mock(() => Promise.reject(new Error('Fail')));
         const step2Execute = mock(() => Promise.resolve());

         const workflow: Workflow = {
            id: 'test-fail',
            name: 'Test Fail Workflow',
            description: '...',
            steps: [
                { id: '1', label: 'Step 1', execute: step1Execute },
                { id: '2', label: 'Step 2', execute: step2Execute },
            ]
        };

        const result = await runWorkflow(workflow, mockContext);
        expect(result.success).toBe(false);
        expect(step1Execute).toHaveBeenCalled();
        expect(step2Execute).not.toHaveBeenCalled();
    });
});
