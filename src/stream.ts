import { io, type Socket } from "socket.io-client";
import type { PixelServerEvents } from "./interfaces/pixelEvents.js";
import type { IPixel } from "./interfaces/pixels.js";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface PixelStreamOptions {
  baseUrl: string;
  onPixels: (pixels: readonly IPixel[]) => void;
  onStatus?: (status: ConnectionStatus) => void;
  onError?: (error: Error) => void;
}

export const subscribeToPixelUpdates = ({
  baseUrl,
  onPixels,
  onStatus,
  onError,
}: PixelStreamOptions): (() => void) => {
  const socket: Socket<PixelServerEvents, Record<string, never>> = io(baseUrl, {
    autoConnect: false,
  });
  const pendingUpdates = new Map<number, IPixel>();
  let currentPixels: IPixel[] | undefined;

  const onSnapshot = (pixels: IPixel[]) => {
    pendingUpdates.clear();
    currentPixels = pixels;
    onPixels(currentPixels);
  };

  const onPixelUpdate = (pixel: IPixel) => {
    pendingUpdates.set(pixel.id, pixel);
  };

  const onPixelsUpdated = () => {
    if (!currentPixels) return;

    // Publish once per completed tick, not once per individual pixel event.
    currentPixels = currentPixels.map(
      (pixel) => pendingUpdates.get(pixel.id) ?? pixel,
    );
    pendingUpdates.clear();
    onPixels(currentPixels);
  };

  const onConnect = () => onStatus?.("connected");
  const onDisconnect = () => {
    pendingUpdates.clear();
    currentPixels = undefined;
    onStatus?.("disconnected");
  };
  const onConnectError = (error: Error) => {
    onStatus?.("error");
    onError?.(error);
  };
  const onReconnectAttempt = () => onStatus?.("connecting");

  socket.on("pixels:snapshot", onSnapshot);
  socket.on("pixel:update", onPixelUpdate);
  socket.on("pixels:updated", onPixelsUpdated);
  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("connect_error", onConnectError);
  socket.io.on("reconnect_attempt", onReconnectAttempt);
  onStatus?.("connecting");
  socket.connect();

  return () => {
    socket.off("pixels:snapshot", onSnapshot);
    socket.off("pixel:update", onPixelUpdate);
    socket.off("pixels:updated", onPixelsUpdated);
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("connect_error", onConnectError);
    socket.io.off("reconnect_attempt", onReconnectAttempt);
    pendingUpdates.clear();
    socket.disconnect();
  };
};
