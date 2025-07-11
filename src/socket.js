import { Server } from "socket.io";

let io;

export function initSocket(serverHttp) {
  io = new Server(serverHttp);
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO no inicializado. Primero llamar a initSocket(serverHttp)");
  }
  return io;
}
