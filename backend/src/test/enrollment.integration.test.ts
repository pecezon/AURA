import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma";
import { supabase } from "../config/supabase";
import { Prisma } from "../../generated/prisma";

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
    courseEnrollment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Enrollment API Integration", () => {
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

    // Mock ensureProfile (which is used in auth.middleware)
    (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
      id: "profile-123",
      firstName: "Test",
      lastName: "User",
      isProfileComplete: true,
    });
  });

  describe("POST /api/enrollments/course-enrollment", () => {
    it("should successfully enroll a profile in a course (Happy Path)", async () => {
      const mockCourseId = "course-456";
      const mockProfileId = "profile-123";

      // Mock the Prisma create response
      (prisma.courseEnrollment.create as jest.Mock).mockResolvedValue({
        courseId: mockCourseId,
        profileId: mockProfileId,
        profile: { firstName: "Test" },
        course: { title: "Test Course" }
      });

      const response = await request(app)
        .post("/api/enrollments/course-enrollment")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ courseId: mockCourseId, profileId: mockProfileId });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        profileName: "Test",
        courseTitle: "Test Course"
      });
      
      expect(prisma.courseEnrollment.create).toHaveBeenCalledWith({
        data: {
          courseId: mockCourseId,
          profileId: mockProfileId,
        },
        include: {
          course: true,
          profile: true,
        },
      });
    });

    it("should return 409 Conflict if profile is already enrolled (Edge Case)", async () => {
      const mockCourseId = "course-456";
      const mockProfileId = "profile-123";

      const conflictError = new Prisma.PrismaClientKnownRequestError(
        "Profile is already enrolled in this course",
        { code: "P2002", clientVersion: "4.0.0", meta: {}, batchRequestIdx: 1 }
      );
      
      // Override create mock for this specific test
      (prisma.courseEnrollment.create as jest.Mock).mockRejectedValue(conflictError);

      const response = await request(app)
        .post("/api/enrollments/course-enrollment")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ courseId: mockCourseId, profileId: mockProfileId });

      expect(response.status).toBe(409);
    });
  });

  describe("GET /api/enrollments/all", () => {
    it("should return all enrollments (Happy Path)", async () => {
      (prisma.courseEnrollment.findMany as jest.Mock).mockResolvedValue([
        {
          profileId: "profile-123",
          courseId: "course-456",
          enrolledAt: new Date("2026-01-01T00:00:00.000Z"),
          status: "ACTIVE",
          progress: 50,
          profile: { firstName: "Test" },
          course: { title: "Test Course" }
        }
      ]);

      const response = await request(app)
        .get("/api/enrollments/all")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        profileId: "profile-123",
        courseId: "course-456",
        profileName: "Test",
        courseTitle: "Test Course",
        enrolledAt: "2026-01-01T00:00:00.000Z",
        status: "ACTIVE",
        progress: 50
      });
    });
  });
});
