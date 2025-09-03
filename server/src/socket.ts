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
  time?: string;
};
const previousMessages: sendMessagePayload[] = [];

io.on("connection", (socket) => {
  socket.on("join-chat", ({ username }: { username: string }) => {
    socket.emit("get-chats", { previousMessages });

    io.emit("user-joined", { username });

    logger.info(`user joined with socket id ${socket.id}`);

    io.emit("connected-users", { activeUsers: io.sockets.sockets.size });
  });

  socket.on("send-message", async (payload: sendMessagePayload) => {
    try {
      const { message, username } = z
        .object({ username: z.string().max(9), message: z.string().min(1) })
        .parse(payload);
      logger.info(`${socket.id} wrote a message`);

      payload.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
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

  socket.on("disconnect", () => {
    io.emit("connected-users", { activeUsers: io.sockets.sockets.size });
  });
});
