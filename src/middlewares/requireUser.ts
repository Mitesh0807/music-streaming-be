import { Request, Response, NextFunction } from "express";

const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const user = res.locals.user;

  console.log("test", user);

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireUser;
