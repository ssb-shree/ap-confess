import { Server } from "socket.io";
import http from "http";

import app from "./app";
import z from "zod";

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

io.on("connection", (socket) => {
  console.log(`user joined with socket id ${socket.id}`);

  socket.on("send-message", (payload: sendMessagePayload) => {
    const { message, username } = z.object({ username: z.string().max(9), message: z.string().min(1) }).parse(payload);

    if (message && username) {
      io.emit("receive-message", { username, message });
    } else {
      socket.emit("error", { message: "failed to send a message" });
    }
  });
});
