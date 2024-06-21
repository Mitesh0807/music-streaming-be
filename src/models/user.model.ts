import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
export interface User extends Document {
  userName?: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<User>(
  {
    userName: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<User>("User", userSchema);
