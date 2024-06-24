import mongoose, { Document, Schema } from "mongoose";

export interface ArtistDocument extends Document {
  name: string;
  bio: string;
  image: string;
}

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    bio: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Artist = mongoose.model<ArtistDocument>("Artist", artistSchema);
