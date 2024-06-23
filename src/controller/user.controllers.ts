import { Request, Response } from "express";
import { createUser } from "@/service/user.service";
import { UserDocument } from "@/models/user.model";
import logger from "@/utils/logger.utils";
import asynHandler from "express-async-handler";

/**
 * Handles creating a new user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the user is created
 * @throws {Error} - If there's an error creating the user
 */
const createUserHandler = asynHandler(
  async (req: Request<{}, UserDocument>, res: Response): Promise<void> => {
    try {
      if (req?.body?.role === "ADMIN") {
        logger.error("Cannot create admin user");
        throw new Error("Cannot create admin user");
      }
      const user = await createUser(req.body);
      res.status(201).send(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(409).send(error.message);
        return;
      }
      res.status(500).send("Something went wrong");
    }
  }
);

/**
 * Gets the current user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the current user is fetched
 */
const getCurrentUser = asynHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.send(res.locals.user);
  }
);

export { createUserHandler, getCurrentUser };
