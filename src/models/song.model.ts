import mongoose, { Document, Schema } from "mongoose";

export interface SongDocument extends Document {
  title: string;
  artist: mongoose.Types.ObjectId;
  album: string;
  genre: mongoose.Types.ObjectId;
  duration: number;
  url: string;
}

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    album: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model<SongDocument>("Song", songSchema);
