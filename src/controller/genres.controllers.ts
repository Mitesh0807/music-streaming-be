import { Request, Response } from "express";
import { Genre } from "@/models/genre.model";
import asynHandler from "express-async-handler";

/**
 * Creates a new genre
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the genre is created
 * @throws {Error} - If there's an error creating the genre
 */
export const createGenre = asynHandler(async (req: Request, res: Response) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).json(genre);
    return;
  } catch (error) {
    res.status(400).json({ error: "Failed to create genre" });
    return;
  }
});

/**
 * Fetches all genres
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the genres are fetched
 * @throws {Error} - If there's an error fetching the genres
 */
export const getGenres = asynHandler(async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch genres" });
  }
});
