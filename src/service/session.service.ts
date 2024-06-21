import { SessionModel } from "@/models/session.model";
import { User } from "@/models/user.model";
import { signJwt, verifyJwt } from "@/utils/jwt.utils";
import get from "lodash/get";

interface CreateSessionInput {
  userId: string;
  userAgent: string;
}

export async function createSession({ userId, userAgent }: CreateSessionInput) {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}

export async function findSessions(query: Record<string, any>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: Record<string, any>,
  update: Record<string, any>
) {
  return SessionModel.updateOne(query, update);
}

interface ReIssueAccessTokenInput {
  refreshToken: string;
}

export async function reIssueAccessToken({
  refreshToken,
}: ReIssueAccessTokenInput) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await User.findById(session.user);

  if (!user) return false;

  const accessToken = signJwt(
    { ...user.toJSON(), session: session._id },
    { expiresIn: "30m" }
  );

  return accessToken;
}
