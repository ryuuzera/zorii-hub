'use client';
import { socket } from '@/socket';
import { useEffect } from 'react';
import { Button } from '../ui/button';

export function Shutdown() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <Button className='mt-5 ml-3' onClick={() => socket.emit('shutdown')}>Desligar</Button>;
}
