import { useContext } from "react";
import { SocketIOContext } from "../providers/SocketIOContext";

export const useSocketIO = () => {
  const context = useContext(SocketIOContext);

  if (!context) {
    throw new Error("useSocketIO must be used within SocketIOProvider");
  }

  return context;
};
