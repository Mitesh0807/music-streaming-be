import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import "module-alias/register";

import logger from "@/utils/logger.utils";
import cors from "cors";

import cookieParser from "cookie-parser";
import connectDB from "@/database/connection.db";
import deserializeUser from "@/middlewares/deserializeUser";
import router from "@/routes";
import upload from "@/utils/storage.utils";

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

app.use(deserializeUser);
app.use((req, res, next) => {
  logger.info(`[middleware]: ${req.method} ${req.path}`);
  next();
});

app.get("/healthcheck", (req: Request, res: Response) => {
  res.send("OK");
});

//TODO : need to remove this it was testing purpose only
app.post("/api", upload.single("file"), async (req, res) => {
  logger.info("test");
  const file = req?.file;
  const files = req?.files;
  logger.info(file);
  logger.info(files);

  res.send("OK");
});
app.use(router);

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
