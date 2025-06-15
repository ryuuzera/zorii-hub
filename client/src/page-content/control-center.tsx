'use client';
import { Shortcuts } from '@/components/shortcuts';
import SystemControls from '@/components/system-controls';
import { YTMusicPlayer } from '@/components/yt-music-player';
import { YTMusicPlaylist } from '@/components/yt-music-playlist';
import { pageTransition } from '@/lib/transitions';
import { ytMusicToken, ytMusicURL } from '@/lib/yt-music';
import { YMusicState } from '@/types/response-schemas/yt-music/state';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface ControlCenterProps {
  playerStateData?: YMusicState;
}

export function ControlCenter({ playerStateData }: ControlCenterProps) {
  const socket = io(`${ytMusicURL}realtime`, {
    autoConnect: false,
    transports: ['websocket'],
    auth: {
      token: ytMusicToken,
    },
  });

  const [playerState, setPlayerState] = useState<YMusicState | undefined>(playerStateData);

  const sendCommand = async (command: string, data?: any): Promise<void> => {
    let body = JSON.stringify({
      command,
      ...(data && { data }),
    });

    await fetch(`${ytMusicURL}command`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: ytMusicToken,
      },
      body,
    });
  };

  const handleStateUpdate = (data: YMusicState) => {
    setPlayerState(data);
  };

  useEffect(() => {
    socket.connect();
    socket.on('state-update', handleStateUpdate);

    return () => {
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  const shortcuts = [
    { icon: 'power-button.png', command: 'shutdown' },
    { icon: 'folder.png', command: 'explorer' },
    { icon: 'hd.png', command: 'hd' },
    { icon: 'discord.png', command: 'discord' },
    { icon: 'terminal.png', command: 'terminal' },
    { icon: 'vscode.png', command: 'vscode' },
    { icon: 'edge.png', command: 'edge' },
    { icon: 'ytmusic.png', command: 'ytmusic' },
    { icon: 'notepad.png', command: 'notepad' },
    { icon: 'calculator.png', command: 'calc' },
  ];

  return (
    <motion.div {...pageTransition} className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        {/* Music Player Section */}
        {playerState?.player && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <YTMusicPlayer sendCommand={sendCommand} playerState={playerState} />
            </div>
            <div className="lg:col-span-1">
              <YTMusicPlaylist sendCommand={sendCommand} playerState={playerState} />
            </div>
          </div>
        )}

        {/* System Controls Section */}
        <div className="mb-6">
          <SystemControls />
        </div>

        {/* Shortcuts */}
        <Shortcuts shortcuts={shortcuts} />
      </div>
    </motion.div>
  );
}