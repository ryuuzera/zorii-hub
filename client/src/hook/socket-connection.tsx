'use client';
import { socket } from '@/socket';
import { createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface GameInfoContext {
  socket: Socket;
}

const SocketConnectionContext = createContext<GameInfoContext | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return <SocketConnectionContext.Provider value={{ socket }}>{children}</SocketConnectionContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketConnectionContext);
  if (!context) {
    throw new Error(' must be used within a Provider');
  }
  return context;
}
