// context/SocketContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/AuthProvider";

type SocketContextType = {
  socket: Socket | null;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true,
      auth: {
        user
      },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      socketInstance.emit("register-user");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("register-user");
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
