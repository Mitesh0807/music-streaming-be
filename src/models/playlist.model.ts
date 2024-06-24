import mongoose, { Document, Schema } from "mongoose";

export interface PlaylistDocument extends Document {
  name: string;
  user: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  isPublic: boolean;
  image: string;
}

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model<PlaylistDocument>(
  "Playlist",
  playlistSchema
);
