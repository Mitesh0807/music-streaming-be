import { Request, Response } from "express";
import { createUser } from "@/service/user.service";
import { UserDocument } from "@/models/user.model";

async function createUserHandler(
  req: Request<{}, UserDocument>,
  res: Response
): Promise<void> {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(409).send(error.message);
    }
    res.status(500).send("Something went wrong");
  }
}

async function getCurrentUser(req: Request, res: Response): Promise<void> {
  res.send(res.locals.user);
}

export { createUserHandler, getCurrentUser };
