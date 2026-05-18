import { OpenAIService } from './openai.service';

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  radius: number;
  riskType: string;
}

export interface SimulationEvent {
  type: 'PLACE_PIN' | 'REMOVE_PIN';
  id: string;
  x?: number;
  y?: number;
  timestamp: number;
}

export interface ScoringResult {
  riskScore: number;
  foundHotspots: string[];
  missedHotspots: string[];
  feedback: string;
}

export class ScoringService {
  constructor(private openAiService: OpenAIService) {}

  async calculateScore(
    hotspots: Hotspot[], 
    events: SimulationEvent[], 
    timeLimitSeconds: number, 
    timeTakenSeconds: number
  ): Promise<ScoringResult> {
    let baseScore = 100;
    
    // Process final pins placed
    const placedPins = new Map<string, {x: number, y: number}>();
    let indecisionCount = 0;

    for (const event of events) {
      if (event.type === 'PLACE_PIN' && event.x !== undefined && event.y !== undefined) {
        placedPins.set(event.id, { x: event.x, y: event.y });
      } else if (event.type === 'REMOVE_PIN') {
        placedPins.delete(event.id);
        indecisionCount++;
      }
    }

    const foundHotspots: string[] = [];
    const missedHotspots: string[] = [];

    // Evaluate each hotspot against placed pins
    for (const hotspot of hotspots) {
      let found = false;
      for (const [pinId, pinCoords] of placedPins.entries()) {
        const dx = hotspot.x - pinCoords.x;
        const dy = hotspot.y - pinCoords.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= hotspot.radius) {
          found = true;
          break;
        }
      }

      if (found) {
        foundHotspots.push(hotspot.id);
      } else {
        missedHotspots.push(hotspot.id);
        baseScore -= 20; // -20 penalty for omissions
      }
    }

    // Apply indecision penalty
    baseScore -= (indecisionCount * 5); // -5 per REMOVE_PIN

    // Apply time penalty
    if (timeTakenSeconds > timeLimitSeconds) {
      const extraSeconds = timeTakenSeconds - timeLimitSeconds;
      baseScore -= (extraSeconds * 2); // -2 per extra second
    }

    // Clamp score to 0
    baseScore = Math.max(0, baseScore);

    const feedback = await this.openAiService.analyzeBehavior(JSON.stringify(events));

    return {
      riskScore: baseScore,
      foundHotspots,
      missedHotspots,
      feedback
    };
  }
}
