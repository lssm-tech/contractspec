import { describe, expect, it, vi, beforeEach } from 'bun:test';
import { StudioEvolutionModule } from './index';
import { prismaMock } from '../../__tests__/mocks/prisma';

const analyzerMock = {
  analyzeSpecUsage: vi.fn(),
  detectAnomalies: vi.fn(),
  toIntentPatterns: vi.fn(),
};

const generatorMock = {
  generateFromIntent: vi.fn(),
};

describe('StudioEvolutionModule', () => {
  beforeEach(() => {
    analyzerMock.analyzeSpecUsage.mockReset();
    analyzerMock.detectAnomalies.mockReset();
    analyzerMock.toIntentPatterns.mockReset();
    generatorMock.generateFromIntent.mockReset();
  });

  it('throws when analyzeProject receives no samples', async () => {
    const module = new StudioEvolutionModule({
      analyzer: analyzerMock as any,
      generator: generatorMock as any,
    });

    await expect(
      module.analyzeProject('project-1', {
        samples: [],
      } as any)
    ).rejects.toThrow(/requires at least one metric sample/);
  });

  it('analyzes project metrics and stores an evolution session', async () => {
    const module = new StudioEvolutionModule({
      analyzer: analyzerMock as any,
      generator: generatorMock as any,
    });
    analyzerMock.analyzeSpecUsage.mockReturnValue([{ id: 'spec', usage: 10 }]);
    analyzerMock.detectAnomalies.mockReturnValue([{ id: 'anomaly' }]);
    analyzerMock.toIntentPatterns.mockReturnValue([{ id: 'intent' }]);
    generatorMock.generateFromIntent.mockReturnValue({
      id: 'suggestion-1',
      proposal: { summary: 'do something' },
    });
    prismaMock.evolutionSession.create.mockResolvedValue({
      id: 'session-1',
    } as any);

    const result = await module.analyzeProject('project-99', {
      samples: [{ id: 'spec', metric: 10 } as any],
    });

    expect(prismaMock.evolutionSession.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          projectId: 'project-99',
        }),
      })
    );
    expect(result).toMatchObject({
      sessionId: 'session-1',
      suggestions: [expect.objectContaining({ id: 'suggestion-1' })],
    });
  });

  it('applies evolution suggestions and completes the session', async () => {
    const module = new StudioEvolutionModule({
      analyzer: analyzerMock as any,
      generator: generatorMock as any,
    });
    prismaMock.evolutionSession.update.mockResolvedValue({
      id: 'session-1',
    } as any);

    const suggestions = [
      {
        id: 'suggestion-1',
        proposal: { summary: 'adopt new schema' },
      },
    ] as any;

    const result = await module.applyEvolution(
      'project-1',
      'session-1',
      suggestions
    );

    expect(prismaMock.evolutionSession.update).toHaveBeenCalledTimes(2);
    expect(result.applied[0]).toMatchObject({
      suggestionId: 'suggestion-1',
      status: 'applied',
    });
  });
});
