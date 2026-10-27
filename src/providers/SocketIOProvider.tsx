import { useEffect, useState, type ReactNode } from "react";
import { io } from "socket.io-client";
import {
  SocketIOContext,
  type PixelSocket,
  type SocketIOStatus,
} from "./SocketIOContext";

export const SocketIOProvider = ({ children }: { children: ReactNode }) => {
  const [socket] = useState<PixelSocket>(() => io({ autoConnect: false }));
  const [status, setStatus] = useState<SocketIOStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onConnect = () => {
      setStatus("connected");
      setError(null);
    };
    const onDisconnect = () => {
      setStatus("disconnected");
    };
    const onConnectError = (connectionError: Error) => {
      setStatus("error");
      setError(connectionError.message);
    };
    const onReconnectAttempt = () => {
      setStatus("connecting");
      setError(null);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketIOContext value={{ socket, status, error }}>
      {children}
    </SocketIOContext>
  );
};
