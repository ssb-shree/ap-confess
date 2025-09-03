import { Server } from "socket.io";
import http from "http";

import app from "./app";
import z from "zod";
import logger from "./utils/logger";

export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.STATUS !== "DEV" ? process.env.CLIENT_URL : "http://localhost:3000",
    credentials: true,
  },
});

type sendMessagePayload = {
  username: string;
  message: string;
};
const previousMessages: sendMessagePayload[] = [];

io.on("connection", (socket) => {
  socket.on("join-chat", ({ username }: { username: string }) => {
    socket.emit("get-chats", { previousMessages });
    io.emit("user-joined", { username });
    logger.info(`user joined with socket id ${socket.id}`);
  });

  socket.on("send-message", async (payload: sendMessagePayload) => {
    try {
      const { message, username } = z
        .object({ username: z.string().max(9), message: z.string().min(1) })
        .parse(payload);
      logger.info(`${socket.id} wrote a message`);

      if (message && username) {
        if (previousMessages.length > 20) {
          previousMessages.shift();
          previousMessages.push(payload);
        } else {
          previousMessages.push(payload);
        }

        io.emit("receive-message", payload);
        logger.info(`${socket.id} sent a message`);
      }
    } catch (error) {
      socket.emit("error", { message: "failed to send a message" });
    }
  });
});
