import { Router } from "express";
import userRouter from "@/routes/user.routes";
import {
  createSong,
  getSongById,
  getSongs,
} from "@/controller/song.controllers";
import {
  createArtist,
  getArtistById,
  getArtists,
} from "@/controller/artist.controllers";
import { createGenre, getGenres } from "@/controller/genres.controllers";
import {
  addSongToPlaylist,
  createPlaylist,
  getPlaylists,
  getUserPlaylists,
} from "@/controller/playlist.controllers";
import { requireAdmin } from "@/middlewares/requireAdmin";
import requireUser from "@/middlewares/requireUser";

const router = Router();

router.use("/users", userRouter);

router.post("/songs", createSong);
router.get("/songs", getSongs);
router.get("/songs/:id", getSongById);

// Artist routes
router.post("/artists", requireAdmin, createArtist);
router.get("/artists", getArtists);
router.get("/artists/:id", getArtistById);

// Genre routes
router.post("/genres", requireAdmin, createGenre);
router.get("/genres", getGenres);

// Playlist routes
router.post("/playlists", requireUser, createPlaylist);
router.get("/playlists", getPlaylists);
router.get("/users/:userId/playlists", getUserPlaylists);
router.post("/playlists/:playlistId/songs", addSongToPlaylist);

export default router;
