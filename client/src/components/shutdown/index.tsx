'use client';
import { socket } from '@/socket';
import { useEffect } from 'react';

export function Shutdown() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  
  return <button onClick={() => socket.emit('shutdown')}>Desligar</button>;
}
