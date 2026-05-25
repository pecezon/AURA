import { OpenAIService } from './openai.service';

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  riskType: string;
}

export interface SimulationEvent {
  type: 'PLACE_PIN' | 'REMOVE_PIN' | 'WRONG_CLICK' | 'QUIZ_ERROR';
  id: string;
  x?: number;
  y?: number;
  timestamp: number;
  expectedStep?: number;
  optionId?: string;
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
    timeTakenSeconds: number,
    simulationType?: string
  ): Promise<ScoringResult> {
    let baseScore = 100;
    const foundHotspots: string[] = [];
    const missedHotspots: string[] = [];

    if (simulationType === 'GUIDED_SEQUENCE') {
      let wrongClicksCount = 0;
      let quizErrorsCount = 0;

      for (const event of events) {
        if (event.type === 'WRONG_CLICK') {
          wrongClicksCount++;
          baseScore -= 5;
        } else if (event.type === 'QUIZ_ERROR') {
          quizErrorsCount++;
          baseScore -= 10;
        } else if (event.type === 'PLACE_PIN') {
          if (event.id) {
            foundHotspots.push(event.id);
          }
        }
      }

      // Penalize for missing hotspots/steps
      for (const hotspot of hotspots) {
        if (!foundHotspots.includes(hotspot.id)) {
          missedHotspots.push(hotspot.id);
          baseScore -= 25; // -25 penalty for omissions in guided sequence
        }
      }
    } else {
      // Process final pins placed (existing free-pin simulation logic)
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

      // Evaluate each hotspot against placed pins
      for (const hotspot of hotspots) {
        let found = false;
        for (const [pinId, pinCoords] of placedPins.entries()) {
          let isHit = false;
          if (hotspot.width !== undefined && hotspot.height !== undefined) {
            isHit = pinCoords.x >= hotspot.x && 
                    pinCoords.x <= hotspot.x + hotspot.width && 
                    pinCoords.y >= hotspot.y && 
                    pinCoords.y <= hotspot.y + hotspot.height;
          } else {
            const dx = hotspot.x - pinCoords.x;
            const dy = hotspot.y - pinCoords.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const rad = hotspot.radius !== undefined ? hotspot.radius : 8;
            isHit = distance <= rad;
          }
          
          if (isHit) {
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
    }

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
