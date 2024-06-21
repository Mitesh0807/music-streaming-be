import mongoose, { Schema, Document } from "mongoose";

export interface Session extends Document {
  user: mongoose.Schema.Types.ObjectId;
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<Session>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

export const SessionModel = mongoose.model<Session>("Session", sessionSchema);
