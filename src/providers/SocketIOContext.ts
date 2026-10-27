import { createContext } from "react";
import type { Socket } from "socket.io-client";
import type { PixelServerEvents } from "../interfaces/pixelEvents";

export type PixelSocket = Socket<PixelServerEvents, Record<string, never>>;
export type SocketIOStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface SocketIOContextValue {
  socket: PixelSocket;
  status: SocketIOStatus;
  error: string | null;
}

export const SocketIOContext = createContext<SocketIOContextValue | null>(null);
SocketIOContext.displayName = "SocketIOContext";
