import { Request, Response } from "express";
import { Playlist } from "@/models/playlist.model";
import asynHandler from "express-async-handler";

/**
 * Creates a new playlist
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the playlist is created
 * @throws {Error} - If there's an error creating the playlist
 */
export const createPlaylist = asynHandler(
  async (req: Request, res: Response) => {
    try {
      const playlist = new Playlist(req.body);
      await playlist.save();
      res.status(201).json(playlist);
    } catch (error) {
      res.status(400).json({ error: "Failed to create playlist" });
    }
  }
);

/**
 * Fetches all public playlists
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the playlists are fetched
 * @throws {Error} - If there's an error fetching the playlists
 */
export const getPlaylists = asynHandler(async (req: Request, res: Response) => {
  try {
    const playlists = await Playlist.find({ isPublic: true }).populate(
      "user songs"
    );
    res.status(200).json(playlists);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch playlists" });
  }
});

/**
 * Fetches user playlists
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the playlists are fetched
 * @throws {Error} - If there's an error fetching the playlists
 */
export const getUserPlaylists = asynHandler(
  async (req: Request, res: Response) => {
    try {
      const playlists = await Playlist.find({
        user: req.params.userId,
      }).populate("songs");
      res.status(200).json(playlists);
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch user playlists" });
    }
  }
);

/**
 * Adds a song to a playlist
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the song is added
 * @throws {Error} - If there's an error adding the song to the playlist
 */
export const addSongToPlaylist = asynHandler(
  async (req: Request, res: Response) => {
    try {
      const playlist = await Playlist.findById(req.params.playlistId);
      if (!playlist) {
        res.status(404).json({ error: "Playlist not found" });
        return;
      }
      playlist.songs.push(req.body.songId);
      await playlist.save();
      res.status(200).json(playlist);
    } catch (error) {
      res.status(400).json({ error: "Failed to add song to playlist" });
    }
  }
);
