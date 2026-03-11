import { Router } from "express";
import { requireCompleteProfile } from "../../middleware/auth.middleware";
import { prisma } from "../../config/prisma";
import { updateProfileController, searchProfilesController, getProfileByIdController, getMyProfile } from "./profile.controller";
import { get } from "node:http";

const router = Router();

router.get(
  "/dashboard-data/:id",
  requireCompleteProfile,
  getProfileByIdController
);


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


export default router;
