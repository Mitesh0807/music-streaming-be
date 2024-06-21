import express, { Router } from "express";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
  googleOauthHandler,
} from "@/controller/session.controllers.js";
import {
  createUserHandler,
  getCurrentUser,
} from "@/controller/user.controllers.js";
import requireUser from "@/middlewares/requireUser";

const router = Router();

router.get("/healthcheck", (req, res) => res.sendStatus(200));

router.post("/register", createUserHandler);

router.get("/me", requireUser, getCurrentUser);

router.post("/sessions", createUserSessionHandler);

router.get("/sessions", requireUser, getUserSessionsHandler);

router.delete("/sessions", requireUser, deleteSessionHandler);

router.get("/sessions/oauth/google", googleOauthHandler);

export default router;
