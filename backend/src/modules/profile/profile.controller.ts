import { Request, Response } from "express";
import { supabase } from "../../config/supabase";

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
