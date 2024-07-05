'use client';
import { socket } from '@/socket';
import { SteamGame } from '@/types/response-schemas/steam';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type GameListProps = {
  games: SteamGame[] | null;
};

const isImageUrlValid = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default function GameList({ games }: GameListProps) {
  const [validGames, setValidGames] = useState<SteamGame[]>([]);

  useEffect(() => {
    if (!games) return;

    const checkImages = async () => {
      const updatedGames = await Promise.all<SteamGame>(
        games.map(async (item: any) => {
          let src = item.images.portrait;
          if (!(await isImageUrlValid(src))) {
            const res = await fetch(`http://192.168.0.109:3001/api/steam/image?appId=${item.appid}`);
            src = await res.text();
          }

          const isValid = await isImageUrlValid(src);
          return isValid ? { ...item, images: { ...item.images, portrait: src } } : null;
        })
      );

      setValidGames(updatedGames.filter((game) => game !== null));
    };

    checkImages();

    socket.connect();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {validGames
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .map((item: SteamGame) => (
          <div
            key={item.appid}
            className='flex flex-col h-[230px] w-[155px] p-[3px] hover:p-0 transition-all delay-100'
            onClick={() => {
              socket.timeout(5000).emit('rungame', { appid: item.appid });
            }}>
            <Image width={300} height={450} quality={90} alt={item.name} src={item.images.portrait} />
          </div>
        ))}
    </>
  );
}
