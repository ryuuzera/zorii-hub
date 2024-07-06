'use client';
import { socket } from '@/socket';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';
import { useEffect, useState } from 'react';

type RecentGamesProps = {
  games: SteamGame[] | null;
  recent: RecentGame[] | null;
};

export default function RecentGames({ games, recent }: RecentGamesProps) {
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className='flex flex-row w-full max-w-7xl mb-5 justify-center items-center'>
        {recent?.map((item, i) => {
          if (i > 5) return;
          return (
            <div
              key={item.appId}
              className={`
                    h-[230px]
                    p-[5px] hover:p-0 transition-all delay-00
                    ${0 == i ? `hover:mr-[-12px] hover:z-10 z-0` : ''}`}>
              <img
                src={
                  0 == i
                    ? games?.find((game) => game?.appid === item.appId)?.images.library
                    : games?.find((game) => game?.appid === item.appId)?.images.portrait
                }
                className='w-full h-full object-cover'
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
