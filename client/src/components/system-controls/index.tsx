'use client';
import { useSocket } from '@/hook/socket-connection';
import { useEffect, useState } from 'react';

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

  return (
    <>
      <div className='flex flex-row h-[280px] w-full gap-2'>
        <div
          className='h-full w-full border-2'
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}></div>

        <div className='h-full w-full border-2'>{JSON.stringify(lastPosition)}</div>
      </div>
    </>
  );
}
