import * as React from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  url?: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socketRef: React.RefObject<Socket | null>;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

function useSocket({
  url = process.env.NEXT_PUBLIC_SOCKET_URL || "",
  autoConnect = false,
}: UseSocketOptions = {}): UseSocketReturn {
  const socketRef = React.useRef<Socket>(
    io(url, {
      autoConnect: false,
    }),
  );
  const [isConnected, setIsConnected] = React.useState(false);

  const connect = React.useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }
    socketRef.current?.connect();
  }, []);

  const disconnect = React.useCallback(() => {
    if (!socketRef.current?.connected) {
      return;
    }
    socketRef.current?.disconnect();
  }, []);

  React.useEffect(() => {
    if (!url) {
      console.warn(
        "Socket URL is not provided. Socket connection will not be established.",
      );
      return;
    }

    const socket = socketRef.current;

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    if (autoConnect) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, [url, autoConnect]);

  return {
    socketRef,
    isConnected,
    connect,
    disconnect,
  };
}

export default useSocket;
