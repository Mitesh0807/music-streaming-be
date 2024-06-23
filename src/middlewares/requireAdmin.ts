import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "Access denied. Admin role required." });
    return;
  }

  next();
}
