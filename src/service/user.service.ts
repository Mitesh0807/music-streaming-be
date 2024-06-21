import { FilterQuery, UpdateQuery } from "mongoose";
import { User, UserDocument } from "../models/user.model";
import axios from "axios";
import qs from "qs";

export async function createUser(input: UserDocument): Promise<UserDocument> {
  try {
    const user = await User.create(input);
    return user.toObject();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("Something went wrong");
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserDocument | false> {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) return false;

  return user.toObject();
}

export async function findUser(
  query: FilterQuery<UserDocument>
): Promise<UserDocument | null> {
  return User.findOne(query).lean();
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<{ id_token: string; access_token: string }> {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);

    throw new Error("Something went wrong");
  }
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<any> {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Something went wrong");
  }
}

export async function findAndUpdateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options = {}
): Promise<UserDocument | null> {
  return User.findOneAndUpdate(query, update, options);
}
