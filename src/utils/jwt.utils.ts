import jwt from "jsonwebtoken";
import logger from "@/utils/logger";
interface JwtPayload {
  [key: string]: any;
}

const privateKey = process.env.JWT_PRIVATE_KEY || "";
const publicKey = process.env.JWT_PUBLIC_KEY || "";

function signJwt(
  object: JwtPayload,
  options?: jwt.SignOptions
): string | undefined {
  try {
    return jwt.sign(object, privateKey, {
      ...(options || {}),
      algorithm: "RS256",
    });
  } catch (error) {
    logger.error("Error signing JWT:", error);
    return undefined;
  }
}

function verifyJwt(token: string): {
  valid: boolean;
  expired: boolean;
  decoded: JwtPayload | null;
} {
  try {
    const decoded = jwt.verify(token, publicKey) as JwtPayload;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    logger.error("Error verifying JWT:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        expired: error.message === "jwt expired",
        decoded: null,
      };
    } else {
      return {
        valid: false,
        expired: false,
        decoded: null,
      };
    }
  }
}

export { signJwt, verifyJwt };
