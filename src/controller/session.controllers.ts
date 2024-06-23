import { CookieOptions, Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "@/service/session.service";
import {
  findAndUpdateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  validatePassword,
} from "@/service/user.service";
import { signJwt } from "@/utils/jwt.utils";
import asynHandler from "express-async-handler";

/**
 * Options for the access token cookie
 */
const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  path: "/",
  secure: true,
  sameSite: "none" as const,
};

/**
 * Options for the refresh token cookie
 */
const refreshTokenCookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10,
};

/**
 * Create a session for a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves to void
 */
export const createUserSessionHandler = asynHandler(
  async (req: Request, res: Response) => {
    const user = await validatePassword(req.body);

    if (!user) {
      res.status(401).send("Invalid email or password");
      return;
    }

    const session = await createSession(
      String(user._id),
      req.get("user-agent") || ""
    );

    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.send({ accessToken, refreshToken });
    return;
  }
);

/**
 * Get all sessions for a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves to void
 */
export const getUserSessionsHandler = asynHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user._id;
    const sessions = await findSessions({ user: userId, valid: true });
    res.send(sessions);
  }
);

/**
 * Delete a session for a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves to void
 */
export const deleteSessionHandler = asynHandler(
  async (req: Request, res: Response) => {
    const sessionId = res.locals.user.session;
    await updateSession({ _id: sessionId }, { valid: false });
    res.send({
      accessToken: null,
      refreshToken: null,
    });
  }
);

/**
 * Handle Google OAuth authentication
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves to void
 */
export const googleOauthHandler = asynHandler(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;

    try {
      const { id_token, access_token } = await getGoogleOAuthTokens({ code });

      const googleUser = await getGoogleUser({ id_token, access_token });

      if (!googleUser.verified_email) {
        res.status(403).send("Google account is not verified");
        return;
      }

      const user = await findAndUpdateUser(
        { email: googleUser.email },
        {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          userName: googleUser.email.split("@")[0],
        },
        { upsert: true, new: true }
      );

      if (!user) {
        res.status(403).send("User not found");
        return;
      }

      const session = await createSession(
        String(user._id),
        req.get("user-agent") || ""
      );

      const accessToken = signJwt(
        { ...user.toObject(), session: session._id },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      const refreshToken = signJwt(
        { ...user.toObject(), session: session._id },
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      const cookieData = {
        accessToken,
        refreshToken,
        accessTokenOptions: accessTokenCookieOptions,
        refreshTokenOptions: refreshTokenCookieOptions,
      };

      res.redirect(
        `${process.env.CORS_ORIGIN}/set-cookies?data=${encodeURIComponent(
          JSON.stringify(cookieData)
        )}`
      );
    } catch (error) {
      res.redirect(`${process.env.CORS_ORIGIN}/api/v1/users/oauth/error`);
      return;
    }
  }
);
