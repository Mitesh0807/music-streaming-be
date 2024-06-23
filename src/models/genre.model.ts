import mongoose, { Document, Schema } from "mongoose";

export interface GenreDocument extends Document {
  name: string;
}

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Genre = mongoose.model<GenreDocument>("Genre", genreSchema);
