import { getProfileById } from "../services/profile.service";
import { prisma } from "../config/prisma";

jest.mock("../config/prisma", () => ({
  prisma: {
    profile: {
      findUnique: jest.fn(),
    },
    simulationAttempt: {
      findMany: jest.fn(),
    },
    quizAttempt: {
      findMany: jest.fn(),
    },
  },
}));

describe("ProfileService - calculateBehavioralProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null behavioralProfile for a worker with no attempts", async () => {
    (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
      id: "profile-1",
      email: "worker@example.com",
      firstName: "Juan",
      lastName: "Perez",
      employeeId: "EMP001",
      area: "Sistemas",
      role: "EMPLOYEE",
      isProfileComplete: true,
      birthDate: new Date("1990-01-01"),
      createdAt: new Date(),
    });
    (prisma.simulationAttempt.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getProfileById("profile-1");
    expect(result).not.toBeNull();
    expect(result!.behavioralProfile).toBeNull();
  });

  it("should calculate correct behavioral metrics for a user with attempts", async () => {
    (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
      id: "profile-1",
      email: "worker@example.com",
      firstName: "Juan",
      lastName: "Perez",
      employeeId: "EMP001",
      area: "Sistemas",
      role: "EMPLOYEE",
      isProfileComplete: true,
      birthDate: new Date("1990-01-01"),
      createdAt: new Date(),
    });

    const mockSimulation = {
      id: "sim-1",
      title: "Electrical Safety",
      passingScore: 80,
      configuration: {
        timeLimitSeconds: 100,
        simulationType: "GUIDED_SEQUENCE",
        hotspots: [{ id: "h1" }, { id: "h2" }]
      }
    };

    (prisma.simulationAttempt.findMany as jest.Mock).mockResolvedValue([
      {
        simulationId: "sim-1",
        profileId: "profile-1",
        score: 100,
        passed: true,
        riskScore: 90, // Simulation Risk Score
        createdAt: new Date("2026-05-25T10:00:00.000Z"),
        events: [
          { type: "PLACE_PIN", id: "h1", timestamp: 1000 },
          { type: "WRONG_CLICK", timestamp: 2000 },
          { type: "QUIZ_ERROR", id: "h2", timestamp: 3000 },
          { type: "SUBMIT", timestamp: 4000, timeTakenSeconds: 30 } // 30 seconds taken
        ],
        simulation: mockSimulation
      }
    ]);

    (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue([
      {
        quizId: "quiz-1",
        profileId: "profile-1",
        score: 80, // Quiz Score
        passed: true,
        createdAt: new Date("2026-05-25T11:00:00.000Z")
      }
    ]);

    const result = await getProfileById("profile-1");
    expect(result).not.toBeNull();
    expect(result!.behavioralProfile).toEqual({
      riskScore: 87, // (0.7 * 90) + (0.3 * 80) = 63 + 24 = 87
      reactionIndex: 70, // ((100 - 30) / 100) * 100 = 70
      proceduralDiscipline: 68,
    });
  });
});
