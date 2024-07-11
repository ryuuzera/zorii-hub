'use client';
import { YTMusicPlayer } from '@/components/yt-music-player';
import { YTMusicPlaylist } from '@/components/yt-music-playlist';
import { YMusicState } from '@/types/response-schemas/yt-music/state';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ytMusicURL = 'http://192.168.0.109:9863/api/v1/';
const token =
  '3eddafe62a00d870a282019c064a5f1e9f3827a45ad056b5d8ca728385337c5ebc192dd27e6dcdf04107c15b82dc6714e37724bea9eea75162e18fa29b3166528f583942744049647b3560db781865126369ebe06552e225296f5c22d1da9e667ec347561e18c42efa2312b9791995ef92644d93a7edf874f698a78d1749c6a1a28edfa309c7575e69840a627897b82c99074f1515eaaca5d76c16229bbc9bf64b7e3eea6a5c4d42232c93c6a787a52d8f33bacb728e3413680f5fed828d1ae39048322803ef02224f540f537b0ad2b21029dc27e71a3f30b9d564e8b75619baf352b72bccb36aff9482ac5ad3f7b32ee601bb76dac6d016a8a75120c8de8287';

interface ControlCenterProps {
  playerStateData?: YMusicState;
}
export function ControlCenter({ playerStateData }: ControlCenterProps) {
  const socket = io('http://192.168.0.109:9863/api/v1/realtime', {
    autoConnect: false,
    transports: ['websocket'],
    auth: {
      token: token,
    },
  });

  const [playerState, setPlayerState] = useState<YMusicState | undefined>(playerStateData);

  const sendCommand = async (command: string, data?: any): Promise<void> => {
    const body = JSON.stringify({
      command,
      ...(data && { data }),
    });

    await fetch(`${ytMusicURL}command`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
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
