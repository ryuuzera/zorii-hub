'use client';
import { YTMusicPlayer } from '@/components/yt-music-player';
import { YTMusicPlaylist } from '@/components/yt-music-playlist';
import { ytMusicToken, ytMusicURL } from '@/lib/yt-music';
import { YMusicState } from '@/types/response-schemas/yt-music/state';
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

  return (
    <>
      <div className='flex flex-col w-screen max-w-7xl p-2'>
        <div className='flex flex-row'>
          <YTMusicPlayer sendCommand={sendCommand} playerState={playerState} />
          <div className='flex flex-1 border h-[300px] mx-5 rounded-md flex-col overflow-auto'>
            <YTMusicPlaylist sendCommand={sendCommand} playerState={playerState} />
          </div>
        </div>
      </div>
    </>
  );
}
