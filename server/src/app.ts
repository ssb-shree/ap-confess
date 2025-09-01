import express from "express";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const origin = process.env.STATUS! === "DEV" ? "http://localhost:3000" : process.env.CLIENT_URL!;

app.use(
  cors({
    origin,
    credentials: true,
  })
);



app.use(cookieParser());

app.use(
  morgan(
    "\x1b[36m:date[web]\x1b[0m \x1b[33m:method\x1b[0m (\x1b[34m:url\x1b[0m) Status[\x1b[32m:status\x1b[0m] - [\x1b[35m:response-time ms\x1b[0m]"
  )
);

import { errorHandler } from "./middlewares/errorHandler";

import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import ConfessRouter from "./routes/confession.routes";
import CommentRouter from "./routes/comment.routes";

app.use("/auth", AuthRouter);

app.use("/user", UserRouter);

app.use("/confess", ConfessRouter);

app.use("/comments", CommentRouter);

app.use(errorHandler);

export default app;
