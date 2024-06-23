import { Request, Response } from "express";
import { Artist } from "@/models/artist.model";
import asynHandler from "express-async-handler";

/**
 * Creates a new artist
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the artist is created
 * @throws {Error} - If there's an error creating the artist
 */
export const createArtist = asynHandler(async (req: Request, res: Response) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: "Failed to create artist" });
  }
});

/**
 * Fetches all artists
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the artists are fetched
 * @throws {Error} - If there's an error fetching the artists
 */
export const getArtists = asynHandler(async (req: Request, res: Response) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch artists" });
  }
});

/**
 * Fetches an artist by ID
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the artist is fetched
 * @throws {Error} - If there's an error fetching the artist or if the artist is not found
 */
export const getArtistById = asynHandler(
  async (req: Request, res: Response) => {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) {
        res.status(404).json({ error: "Artist not found" });
        return;
      }
      res.status(200).json(artist);
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch artist" });
    }
  }
);
