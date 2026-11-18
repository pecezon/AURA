import { requireSuperAdmin, getSuperAdminEmail } from "../middleware/requireSuperAdmin";
import { changeRoleSchema, userIdParamSchema } from "../modules/superadmin/superadmin.validation";
import { getSuperAdminUsersService, updateUserRoleService } from "../services/superadmin.service";
import {
  getSuperAdminUsersController,
  updateUserRoleController,
} from "../modules/superadmin/superadmin.controller";
import { prisma } from "../config/prisma";

jest.mock("../config/prisma", () => ({
  prisma: {
    profile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("SuperAdmin Unit Tests", () => {
  const superAdminEmail = "diego.lopez171205@gmail.com";
  const superAdminId = "c89b2512-8855-4e76-b639-64db9f96ce75";
  const targetUserId = "e9a0db13-68f7-4dc4-b789-9831c19b2222";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("requireSuperAdmin Middleware", () => {
    it("should allow access when user and profile match superadmin email", () => {
      const req: any = {
        user: { id: superAdminId, email: "DIEGO.LOPEZ171205@GMAIL.COM" },
        profile: { id: superAdminId, email: "diego.lopez171205@gmail.com" },
        ip: "127.0.0.1",
        socket: {},
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      requireSuperAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should block with 403 Forbidden when user email does not match", () => {
      const req: any = {
        user: { id: "user-2", email: "other@gmail.com" },
        profile: { id: "user-2", email: "other@gmail.com" },
        ip: "127.0.0.1",
        socket: {},
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      requireSuperAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("SuperAdmin privileges required") })
      );
    });

    it("should block with 403 Forbidden when user or profile is undefined", () => {
      const req: any = {
        user: undefined,
        profile: undefined,
        ip: "127.0.0.1",
        socket: {},
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      requireSuperAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("superadmin.validation", () => {
    it("should accept valid roles (EMPLOYEE, SUPERVISOR, ADMIN)", () => {
      expect(changeRoleSchema.safeParse({ role: "EMPLOYEE" }).success).toBe(true);
      expect(changeRoleSchema.safeParse({ role: "SUPERVISOR" }).success).toBe(true);
      expect(changeRoleSchema.safeParse({ role: "ADMIN" }).success).toBe(true);
    });

    it("should reject invalid role strings", () => {
      expect(changeRoleSchema.safeParse({ role: "HACKER" }).success).toBe(false);
      expect(changeRoleSchema.safeParse({ role: "" }).success).toBe(false);
      expect(changeRoleSchema.safeParse({}).success).toBe(false);
    });

    it("should validate proper UUID format for id parameter", () => {
      expect(userIdParamSchema.safeParse({ id: targetUserId }).success).toBe(true);
      expect(userIdParamSchema.safeParse({ id: "invalid-uuid" }).success).toBe(false);
    });
  });

  describe("superadmin.service", () => {
    it("should fetch all users ordered by createdAt desc", async () => {
      const mockList = [
        { id: superAdminId, email: superAdminEmail, role: "ADMIN" },
        { id: targetUserId, email: "user@example.com", role: "EMPLOYEE" },
      ];
      (prisma.profile.findMany as jest.Mock).mockResolvedValue(mockList);

      const result = await getSuperAdminUsersService();
      expect(result).toEqual(mockList);
      expect(prisma.profile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
        })
      );
    });

    it("should prevent self-demotion / self-modification with 400 error", async () => {
      await expect(
        updateUserRoleService(superAdminId, superAdminId, "EMPLOYEE")
      ).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringContaining("cannot modify their own role"),
      });
    });

    it("should throw 404 if target user profile does not exist", async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        updateUserRoleService(superAdminId, targetUserId, "SUPERVISOR")
      ).rejects.toMatchObject({
        statusCode: 404,
        message: expect.stringContaining("User not found"),
      });
    });

    it("should prevent modifying account with primary superadmin email", async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: "c89b2512-8855-4e76-b639-64db9f96ce99",
        email: superAdminEmail,
        role: "ADMIN",
      });

      await expect(
        updateUserRoleService(superAdminId, "c89b2512-8855-4e76-b639-64db9f96ce99", "EMPLOYEE")
      ).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringContaining("Cannot modify role of the primary SuperAdmin account"),
      });
    });

    it("should update user role successfully", async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: targetUserId,
        email: "target@example.com",
        role: "EMPLOYEE",
      });

      const updatedUser = {
        id: targetUserId,
        email: "target@example.com",
        role: "SUPERVISOR",
      };
      (prisma.profile.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await updateUserRoleService(superAdminId, targetUserId, "SUPERVISOR");
      expect(result).toEqual(updatedUser);
      expect(prisma.profile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: targetUserId },
          data: { role: "SUPERVISOR" },
        })
      );
    });
  });

  describe("superadmin.controller", () => {
    it("getSuperAdminUsersController should return users list", async () => {
      const mockList = [{ id: "c89b2512-8855-4e76-b639-64db9f96ce75", email: "test@example.com" }];
      (prisma.profile.findMany as jest.Mock).mockResolvedValue(mockList);

      const req: any = {};
      const res: any = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await getSuperAdminUsersController(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockList);
    });

    it("updateUserRoleController should return updated user", async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: targetUserId,
        email: "target@example.com",
        role: "EMPLOYEE",
      });

      const updatedUser = { id: targetUserId, email: "target@example.com", role: "ADMIN" };
      (prisma.profile.update as jest.Mock).mockResolvedValue(updatedUser);

      const req: any = {
        user: { id: superAdminId },
        params: { id: targetUserId },
        body: { role: "ADMIN" },
      };
      const res: any = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await updateUserRoleController(req, res, next);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it("updateUserRoleController should return 400 on self-modification", async () => {
      const req: any = {
        user: { id: superAdminId },
        params: { id: superAdminId },
        body: { role: "EMPLOYEE" },
      };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await updateUserRoleController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("cannot modify their own role") })
      );
    });
  });
});
