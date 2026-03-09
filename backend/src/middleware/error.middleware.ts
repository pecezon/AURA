import express from "express";

// Error handling middleware
export const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);  // Log for debugging
  res.status(err.statusCode || 500).json({ error: "Internal server error" });
};