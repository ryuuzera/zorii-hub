'use client';
import { useSocket } from '@/hook/socket-connection';
import { Fullscreen, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Typography } from '@mui/material';

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
    <div className="bg-gray-900/70 rounded-xl p-4 backdrop-blur-lg border border-gray-700">
      <Typography variant="h6" component="div" className="text-white mb-4">
        System Controls
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mouse Control Area */}
        <div className="md:col-span-2">
          <div
            className="h-48 w-full rounded-lg bg-gray-800/50 border border-gray-700 relative overflow-hidden"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Touch or click to control mouse
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
              onClick={() => sendMessage('left-click')}
            >
              Left Click
            </Button>
            <Button
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
              onClick={() => sendMessage('right-click')}
            >
              Right Click
            </Button>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white h-full"
            onClick={() => sendMessage('volumeDown')}
          >
            <Volume1 className="mr-2" />
            Vol Down
          </Button>
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white h-full"
            onClick={() => sendMessage('volumeUp')}
          >
            <Volume2 className="mr-2" />
            Vol Up
          </Button>
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white h-full col-span-2"
            onClick={() => sendMessage('volumeMute')}
          >
            <VolumeX className="mr-2" />
            Mute
          </Button>
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white h-full col-span-2"
            onClick={() => sendMessage('printscreen')}
          >
            <Fullscreen className="mr-2" />
            Screenshot
          </Button>
        </div>
      </div>
    </div>
  );
}