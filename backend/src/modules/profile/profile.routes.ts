import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { prisma } from "../../config/prisma";
import { requireCompleteProfile } from "../../middleware/auth.middleware";

const router = Router();

router.post("/complete-profile", requireAuth, async (req, res) => {
  const { firstName, lastName, birthDate, employeeId, area } = req.body;

  const parsedBirthDate = new Date(birthDate);
  if (!birthDate || isNaN(parsedBirthDate.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid birthDate. Please provide a valid date." });
  }

  const updated = await prisma.profile.update({
    where: { id: req.user.id },
    data: {
      firstName,
      lastName,
      birthDate: parsedBirthDate,
      employeeId,
      area,
      isProfileComplete: true,
    },
  });

  res.json(updated);
});

router.get(
  "/dashboard-data",
  requireAuth,
  requireCompleteProfile,
  async (req, res) => {
    res.json({ message: "Welcome to dashboard" });
  },
);

export default router;
