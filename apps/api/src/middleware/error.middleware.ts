import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  console.error("Weather request failed");

  res.status(500).json({
    error: "Internal Server Error",
  });
};
