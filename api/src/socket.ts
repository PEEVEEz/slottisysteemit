import { isValidObjectId } from "mongoose";
import { getHuntDataByUserId } from "./lib/hunt";
import { Server as HttpServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export var socket: SocketServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export const setupSocketServer = (server: HttpServer) => {
  socket = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });

  socket.on("connection", async (socket) => {
    const id = socket.handshake.query.id;
    if (!id || !isValidObjectId(id)) {
      socket.client._disconnect();
      return;
    }

    console.log("Socket connected room:", id);

    try {
      socket.join(id);

      socket.emit("hunt", await getHuntDataByUserId(id.toString()));
    } catch (e) {
      console.error(e);
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected room:", id);
    });
  });
};
