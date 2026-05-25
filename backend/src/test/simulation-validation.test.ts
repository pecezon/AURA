import { simulationEventSchema } from '../modules/simulationAttempt/simuAttempt.validation';

describe('simulationEventSchema Validation', () => {
  it('should validate valid PLACE_PIN event', () => {
    const validPlacePin = {
      type: 'PLACE_PIN',
      id: 'pin-123',
      x: 10.5,
      y: 20.3,
      timestamp: 1000
    };
    const result = simulationEventSchema.safeParse(validPlacePin);
    expect(result.success).toBe(true);
  });

  it('should fail PLACE_PIN event with empty or missing id', () => {
    const invalidPlacePin = {
      type: 'PLACE_PIN',
      id: '',
      x: 10.5,
      y: 20.3,
      timestamp: 1000
    };
    const result = simulationEventSchema.safeParse(invalidPlacePin);
    expect(result.success).toBe(false);
  });

  it('should validate valid WRONG_CLICK event with empty id', () => {
    const validWrongClick = {
      type: 'WRONG_CLICK',
      id: '',
      x: 10.5,
      y: 20.3,
      expectedStep: 2,
      timestamp: 1000
    };
    const result = simulationEventSchema.safeParse(validWrongClick);
    expect(result.success).toBe(true);
  });

  it('should fail QUIZ_ERROR event with missing optionId', () => {
    const invalidQuizError = {
      type: 'QUIZ_ERROR',
      id: 'h1',
      timestamp: 1000
    };
    const result = simulationEventSchema.safeParse(invalidQuizError);
    expect(result.success).toBe(false);
  });
});
