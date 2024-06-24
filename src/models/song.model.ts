import mongoose, { Document, Schema } from "mongoose";

export interface SongDocument extends Document {
  title: string;
  artist: mongoose.Types.ObjectId;
  album: string;
  genre: mongoose.Types.ObjectId;
  duration: number;
  url: string;
  image: string;
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
    },
    album: {
      type: String,
      trim: true,
    },
    genre: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
    duration: {
      type: Number,
    },
    url: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model<SongDocument>("Song", songSchema);
