import { ScoringService, Hotspot, SimulationEvent } from '../services/scoring.service';

describe('ScoringService', () => {
  let scoringService: ScoringService;

  beforeEach(() => {
    // We mock the OpenAI service dependency
    const mockOpenAiService = {
      analyzeBehavior: jest.fn().mockResolvedValue('Mocked behavioral feedback')
    } as any;
    scoringService = new ScoringService(mockOpenAiService);
  });

  it('should calculate perfect score when all hotspots are found without indecision', async () => {
    const hotspots: Hotspot[] = [
      { id: 'h1', x: 50, y: 50, radius: 10, riskType: 'Fire' },
      { id: 'h2', x: 80, y: 20, radius: 5, riskType: 'Electrical' }
    ];

    const events: SimulationEvent[] = [
      { type: 'PLACE_PIN', id: 'p1', x: 52, y: 48, timestamp: 1000 },
      { type: 'PLACE_PIN', id: 'p2', x: 81, y: 21, timestamp: 2000 }
    ];

    const result = await scoringService.calculateScore(hotspots, events, 100, 100);

    // 100 base score. 2/2 found. No indecision. Time is good.
    expect(result.riskScore).toBe(100);
    expect(result.feedback).toBe('Mocked behavioral feedback');
    expect(result.foundHotspots).toEqual(['h1', 'h2']);
    expect(result.missedHotspots).toEqual([]);
  });

  it('should apply penalty for omissions (-20) and indecision (-5)', async () => {
    const hotspots: Hotspot[] = [
      { id: 'h1', x: 50, y: 50, radius: 10, riskType: 'Fire' },
      { id: 'h2', x: 80, y: 20, radius: 5, riskType: 'Electrical' }
    ];

    const events: SimulationEvent[] = [
      { type: 'PLACE_PIN', id: 'p1', x: 10, y: 10, timestamp: 1000 }, // totally wrong
      { type: 'REMOVE_PIN', id: 'p1', timestamp: 1500 }, // indecision
      { type: 'PLACE_PIN', id: 'p2', x: 52, y: 48, timestamp: 2000 } // found h1
    ];

    const result = await scoringService.calculateScore(hotspots, events, 100, 100);

    // Score = 100 (base) - 20 (1 missed: h2) - 5 (1 remove) = 75
    expect(result.riskScore).toBe(75);
    expect(result.foundHotspots).toEqual(['h1']);
    expect(result.missedHotspots).toEqual(['h2']);
  });
});
