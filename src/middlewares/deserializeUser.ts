import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "@/service/session.service";
import { get } from "lodash";
import logger from "@/utils/logger.utils";
import asynHandler from "express-async-handler";

const deserializeUser = asynHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken =
      get(req, "cookies.accessToken") ||
      get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    const refreshToken =
      get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

    if (!accessToken) {
      return next();
    }

    logger.info(accessToken, "accessToken");

    const { decoded, expired } = verifyJwt(accessToken);

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({ refreshToken });
      if (!newAccessToken) {
        return next();
      }

      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken as string);

        res.cookie("accessToken", newAccessToken, {
          maxAge: 18000000,
          httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "none",
        });
      }

      const result = verifyJwt(newAccessToken as string);

      res.locals.user = result.decoded;
      return next();
    }

    return next();
  }
);

export default deserializeUser;
