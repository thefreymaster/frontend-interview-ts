import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PIXEL_QUERY_KEY, PIXELS_QUERY_KEY } from "../api/pixelQueryKeys";
import type { IPixel } from "../interfaces/pixels";
import { useSocketIO } from "./useSocketIO";

export const usePixelUpdates = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocketIO();

  useEffect(() => {
    const pendingUpdates = new Map<number, IPixel>();
    let currentPixels: IPixel[] | undefined;

    const onSnapshot = (pixels: IPixel[]) => {
      pendingUpdates.clear();
      currentPixels = pixels;
      queryClient.setQueryData<IPixel[]>(PIXELS_QUERY_KEY, pixels);
      const pixelsById = new Map(pixels.map((pixel) => [pixel.id, pixel]));
      queryClient.setQueriesData<IPixel>(
        { queryKey: PIXEL_QUERY_KEY },
        (pixel) => pixel && pixelsById.get(pixel.id),
      );
    };

    const onPixelUpdate = (pixel: IPixel) => {
      pendingUpdates.set(pixel.id, pixel);
    };

    const onPixelsUpdated = () => {
      if (!currentPixels || pendingUpdates.size === 0) return;

      // Apply the complete tick together instead of re-rendering for every pixel event.
      currentPixels = currentPixels.map(
        (pixel) => pendingUpdates.get(pixel.id) ?? pixel,
      );
      queryClient.setQueryData<IPixel[]>(PIXELS_QUERY_KEY, currentPixels);
      queryClient.setQueriesData<IPixel>(
        { queryKey: PIXEL_QUERY_KEY },
        (pixel) => pixel && (pendingUpdates.get(pixel.id) ?? pixel),
      );
      pendingUpdates.clear();
    };

    const onDisconnect = () => {
      pendingUpdates.clear();
    };

    socket.on("pixels:snapshot", onSnapshot);
    socket.on("pixel:update", onPixelUpdate);
    socket.on("pixels:updated", onPixelsUpdated);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("pixels:snapshot", onSnapshot);
      socket.off("pixel:update", onPixelUpdate);
      socket.off("pixels:updated", onPixelsUpdated);
      socket.off("disconnect", onDisconnect);
    };
  }, [queryClient, socket]);
};
