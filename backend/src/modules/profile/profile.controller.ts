import { NextFunction, Request, Response } from "express";
import { supabase } from "../../config/supabase";
import { updateProfile, searchProfiles, getProfileById } from "../../services/profile.service";
import { updateProfileSchema, profileIdParamsSchema,nameSchema } from "./profile.validation";

export async function getMyProfile(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await getProfileById(userId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.json(profile);
  } catch (err: any) {
    next(err);
  }
}


export async function updateProfileController(
  req: Request & { user?: any },
  res: Response, next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const parsed = updateProfileSchema.parse(req.body);
    const { id: _ignoredId, ...updateData } = parsed as any;
    const updated = await updateProfile(userId, updateData);
    res.json(updated);
  } catch (err: any) {
    return next(err);
  }
}

export async function searchProfilesController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.query;
    const safeName = nameSchema.parse(name)
    const profiles = await searchProfiles(safeName);
    res.json(profiles);
  } catch (err: any) {
    return next(err);
  }
}

export async function getProfileByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedParams = profileIdParamsSchema.parse(req.params);
    const { id } = parsedParams;
    const profile = await getProfileById(id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (err: any) {
    return next(err);
  }
}
