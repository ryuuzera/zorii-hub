'use client';
import { useSocket } from '@/hook/socket-connection';
import { Fullscreen, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export default function SystemControls() {
  const { socket } = useSocket();
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    socket.on('lastpos', (data) => {
      setLastPosition(data);
    });
  }, []);

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;

    var bounds = e.target.getBoundingClientRect();
    var deltaX = e.clientX - bounds.left;
    var deltaY = e.clientY - bounds.top;

    socket.emit('mousepos', { x: deltaX, y: deltaY });

    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: any) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: any) => {
    if (!isDragging) return;

    const touch = e.touches[0];

    const deltaX = touch.clientX - lastPosition.x;
    const deltaY = touch.clientY - lastPosition.y;

    socket.emit('mousepos', { x: deltaX, y: deltaY });

    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: any) => {
    const touch = e.changedTouches[0];

    socket.emit('mousestop', { x: touch.clientX, y: touch.clientY });

    setIsDragging(false);
  };

  const sendMessage = (message: string) => {
    socket.emit(message);
  };

  return (
    <>
      <div className='flex flex-row h-[260px] w-full'>
        <div
          className='h-full w-[80%] border-[1px] rounded-md flex flex-row-reverse ml-3'
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <div className='h-full w-32 flex flex-col p-1 gap-1'>
          <Button
            className='h-full border-[1px] rounded-md bg-transparent text-white'
            onClick={() => sendMessage('left-click')}>
            L
          </Button>
          <Button
            className='h-full border-[1px] rounded-md bg-transparent text-white'
            onClick={() => sendMessage('right-click')}>
            R
          </Button>
        </div>

        <div className='h-full w-full flex flex-row items-center justify-center'>
          <Button
            className='h-24 w-24 border-2 m-2 bg-transparent text-white'
            onClick={() => sendMessage('volumeDown')}>
            <Volume1 />
          </Button>
          <Button className='h-24 w-24 border-2 m-2 bg-transparent text-white' onClick={() => sendMessage('volumeUp')}>
            <Volume2 />
          </Button>
          <Button
            className='h-24 w-24 border-2 m-2 bg-transparent text-white'
            onClick={() => sendMessage('volumeMute')}>
            <VolumeX />
          </Button>
          <Button
            className='h-24 w-24 border-2 m-2 bg-transparent text-white'
            onClick={() => sendMessage('printscreen')}>
            <Fullscreen />
          </Button>
        </div>
      </div>
    </>
  );
}
