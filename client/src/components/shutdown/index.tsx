'use client';

import { useSocket } from '@/hook/socket-connection';
import { Button } from '../ui/button';

export function Shutdown() {
  const { socket } = useSocket();

  return (
    <Button className='mt-5 ml-3' onClick={() => socket.emit('shutdown')}>
      Desligar
    </Button>
  );
}
