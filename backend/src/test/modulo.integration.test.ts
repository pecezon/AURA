import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma";
import { supabase } from "../config/supabase";

// Mock Supabase
jest.mock("../config/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

// Mock Prisma
jest.mock("../config/prisma", () => ({
  prisma: {
    module: {
      findUnique: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
    },
  },
}));

describe("Module API Integration", () => {
  const mockToken = "fake-jwt-token";

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful authentication
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: {
        user: { id: "user-123", email: "test@example.com" },
      },
      error: null,
    });

    (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
      id: "profile-123",
      firstName: "Test",
      lastName: "User",
      isProfileComplete: true,
    });
  });

  describe("GET /api/modules/get-module-by-id/:moduleId", () => {
    it("should successfully return a module by id with its contents and quizzes (Happy Path)", async () => {
      const mockModuleId = "module-123";
      
      const mockModuleData = {
        id: mockModuleId,
        title: "Test Module",
        order: 1,
        courseId: "course-123",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        contents: [
          { id: "content-1", type: "READING", title: "Read this", content: "Some text", order: 1 }
        ],
        quizzes: [
          {
            id: "quiz-1",
            title: "Test Quiz",
            isGeneratedByAI: false,
            questions: [
              {
                id: "question-1",
                text: "What is 2+2?",
                reactives: [
                  { id: "reactive-1", text: "4", isCorrect: true }
                ]
              }
            ]
          }
        ],
        simulation: null
      };

      (prisma.module.findUnique as jest.Mock).mockResolvedValue(mockModuleData);

      const response = await request(app)
        .get(`/api/modules/get-module-by-id/${mockModuleId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: mockModuleId,
        title: "Test Module",
        order: 1,
        courseId: "course-123",
        createdAt: "2026-01-01T00:00:00.000Z",
        contents: mockModuleData.contents,
        quizzes: mockModuleData.quizzes,
        simulation: null
      });

      expect(prisma.module.findUnique).toHaveBeenCalledWith({
        where: { id: mockModuleId },
        include: {
          contents: {
            orderBy: { order: "asc" }
          },
          quizzes: {
            include: {
              questions: {
                include: {
                  reactives: true
                }
              }
            }
          },
          simulation: true
        }
      });
    });

    it("should return 404 if module is not found", async () => {
      const mockModuleId = "module-404";
      (prisma.module.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/modules/get-module-by-id/${mockModuleId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
    });
  });
});
