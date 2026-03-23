import express from "express";

import { ZodError } from "zod";
// Error handling middleware
export const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);  // Log for debugging
  // Handle Zod validation errors explicitly as 400 with safe details
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
    return res.status(400).json({
      error: "Validation error",
      details,
    });
  }
  const statusCode =
    Number.isInteger(err?.statusCode) && err.statusCode >= 400 && err.statusCode <= 599
      ? err.statusCode
      : 500;
  // For client / known application errors, surface the message; for server errors, keep it generic
  const message =
    statusCode >= 500
      ? "Internal server error"
      : err?.message || "An error occurred";
  res.status(statusCode).json({ error: message });
};