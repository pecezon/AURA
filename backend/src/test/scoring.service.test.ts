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

  it('should calculate perfect score for guided sequence simulation with zero errors', async () => {
    const hotspots: Hotspot[] = [
      { id: 'h1', x: 17.0, y: 42.0, radius: 8, riskType: 'Libranza' },
      { id: 'h2', x: 34.0, y: 42.0, radius: 8, riskType: 'LOTO' },
      { id: 'h3', x: 48.0, y: 39.0, radius: 8, riskType: 'Measurement' },
      { id: 'h4', x: 50.0, y: 88.0, radius: 12, riskType: 'Boundary' }
    ];

    const events: SimulationEvent[] = [
      { type: 'PLACE_PIN', id: 'h1', x: 17.0, y: 42.0, timestamp: 1000 },
      { type: 'PLACE_PIN', id: 'h2', x: 34.0, y: 42.0, timestamp: 2000 },
      { type: 'PLACE_PIN', id: 'h3', x: 48.0, y: 39.0, timestamp: 3000 },
      { type: 'PLACE_PIN', id: 'h4', x: 50.0, y: 88.0, timestamp: 4000 }
    ];

    // Config passed dynamically or mocked in the service, let's test it.
    // We pass config or specify parameters. Wait! How does ScoringService know the simulation type?
    // Let's pass simulationType: 'GUIDED_SEQUENCE' as part of the hotspots config or extend calculateScore?
    // Wait, let's see calculateScore signature:
    // async calculateScore(hotspots: Hotspot[], events: SimulationEvent[], timeLimitSeconds: number, timeTakenSeconds: number, simulationType?: string)
    // Ah! Let's check how simuAttempt.service.ts calls it:
    // const config = simulation.configuration as any;
    // const hotspots = config?.hotspots || [];
    // const timeLimit = config?.timeLimitSeconds || config?.timeLimit || 120;
    // const result = await scoringService.calculateScore(hotspots, dto.events, timeLimit, dto.timeTakenSeconds);
    // So the config is in the DB. But calculateScore only receives hotspots, events, timeLimit, timeTakenSeconds!
    // Wait, how can calculateScore know the simulation type?
    // We can pass the simulationType as an optional 5th parameter to calculateScore! Or we can check if any hotspots contain stepOrder or if the event list contains WRONG_CLICK/QUIZ_ERROR.
    // Wait, passing simulationType as a 5th parameter is MUCH cleaner and explicit!
    // Let's modify calculateScore's signature:
    // calculateScore(hotspots: Hotspot[], events: SimulationEvent[], timeLimitSeconds: number, timeTakenSeconds: number, simulationType?: string)
    // Yes! Let's write the test assuming we pass 'GUIDED_SEQUENCE' as the 5th parameter.
    const result = await scoringService.calculateScore(hotspots, events, 180, 100, 'GUIDED_SEQUENCE');

    expect(result.riskScore).toBe(100);
    expect(result.foundHotspots).toEqual(['h1', 'h2', 'h3', 'h4']);
    expect(result.missedHotspots).toEqual([]);
  });

  it('should apply correct penalties for guided sequence simulation mistakes', async () => {
    const hotspots: Hotspot[] = [
      { id: 'h1', x: 17.0, y: 42.0, radius: 8, riskType: 'Libranza' },
      { id: 'h2', x: 34.0, y: 42.0, radius: 8, riskType: 'LOTO' },
      { id: 'h3', x: 48.0, y: 39.0, radius: 8, riskType: 'Measurement' },
      { id: 'h4', x: 50.0, y: 88.0, radius: 12, riskType: 'Boundary' }
    ];

    const events: SimulationEvent[] = [
      { type: 'WRONG_CLICK', id: '', x: 10, y: 10, expectedStep: 1, timestamp: 500 }, // -5
      { type: 'PLACE_PIN', id: 'h1', x: 17.0, y: 42.0, timestamp: 1000 },
      { type: 'QUIZ_ERROR', id: 'h2', optionId: 'o1', timestamp: 1500 }, // -10
      { type: 'PLACE_PIN', id: 'h2', x: 34.0, y: 42.0, timestamp: 2000 },
      { type: 'WRONG_CLICK', id: '', x: 10, y: 10, expectedStep: 3, timestamp: 2500 }, // -5
      { type: 'PLACE_PIN', id: 'h3', x: 48.0, y: 39.0, timestamp: 3000 },
      { type: 'PLACE_PIN', id: 'h4', x: 50.0, y: 88.0, timestamp: 4000 }
    ];

    // Score = 100 - (2 * 5) - (1 * 10) = 80
    const result = await scoringService.calculateScore(hotspots, events, 180, 100, 'GUIDED_SEQUENCE');

    expect(result.riskScore).toBe(80);
    expect(result.foundHotspots).toEqual(['h1', 'h2', 'h3', 'h4']);
    expect(result.missedHotspots).toEqual([]);
  });
});
