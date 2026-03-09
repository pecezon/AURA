import { NextFunction, Request, Response } from "express";
import { supabase } from "../../config/supabase";
import { updateProfile, searchProfiles, getProfileById } from "../../services/profile.service";
import { updateProfileSchema, profileIdParamsSchema } from "./profile.validation";

export async function getMyProfile(
  req: Request & { user?: any },
  res: Response,
) {
  const userId = req.user?.id;

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return res.status(400).json({ error });

  res.json(data);
}

export async function updateProfileController(
  req: Request & { user?: any },
  res: Response, next: NextFunction
) {
  try {
    const parsed = updateProfileSchema.parse(req.body);
    const parsedParams = profileIdParamsSchema.parse(req.params);
    const profileId = parsedParams.id;    
    const updated = await updateProfile(profileId, parsed);
    res.json(updated);
  } catch (err: any) {
    return next(err);
  }
}

export async function searchProfilesController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Name query parameter is required" });
    }
    const profiles = await searchProfiles(name);
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
