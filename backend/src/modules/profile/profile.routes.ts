import { Router } from "express";
import { requireCompleteProfile } from "../../middleware/auth.middleware";
import { prisma } from "../../config/prisma";
import { updateProfileController, searchProfilesController, getProfileByIdController } from "./profile.controller";

const router = Router();

router.put("/update", updateProfileController);
router.get("/search", searchProfilesController);
router.get("/:id", getProfileByIdController);

router.post("/complete-profile", async (req, res) => {
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
  requireCompleteProfile,
  async (req, res) => {
    res.json({ message: "Welcome to dashboard" });
  },
);

export default router;
