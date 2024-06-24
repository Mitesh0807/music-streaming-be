import { Request, Response } from "express";
import { Song } from "@/models/song.model";
import asynHandler from "express-async-handler";
import logger from "@/utils/logger.utils";

/**
 * Create a new song
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const createSong = asynHandler(async (req, res) => {
  try {
    const image = (req.files as unknown as { image: any[] })?.["image"][0];
    const url = (req.files as unknown as { url: any[] })?.["url"][0];
    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      genre: req.body.genre,
      duration: req.body.duration,
      url: url?.location,
      image: image?.location,
    });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(400).json({ error: "Failed to create song" });
  }
});

/**
 * Get all songs
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const getSongs = asynHandler(async (req, res) => {
  try {
    const songs = await Song.find().populate("artist genre");
    res.status(200).json(songs);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch songs" });
  }
});

/**
 * Get a song by its ID
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
export const getSongById = asynHandler(async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate("artist genre");
    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch song" });
  }
});
