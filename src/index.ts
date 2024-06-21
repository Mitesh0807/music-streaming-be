import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import "module-alias/register";

import logger from "@/utils/logger";
import cors from "cors";

import cookieParser from "cookie-parser";
import connectDB from "@/database/connection.db";

dotenv.config();
(async () => await connectDB())();

const app: Express = express();
const port = process.env.PORT || 4000;

//TODO: proper cors setup required
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  logger.info(`[middleware]: ${req.method} ${req.path}`);
  logger.info(req.body, "body");
  next();
});

app.get("/healthcheck", (req: Request, res: Response) => {
  res.send("OK");
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
