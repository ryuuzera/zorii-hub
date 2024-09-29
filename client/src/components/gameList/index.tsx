'use client';
import { useCurrentGame } from '@/hook/current-game';
import { useGameInfo } from '@/hook/game-info';
import { SteamGame } from '@/types/response-schemas/steam';
import { SteamGameInfo } from '@/types/response-schemas/steam-game-info';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

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

const Skeletons = () => {
  return (
    <>
      {Array.from({ length: 17 }).map((item, index) => (
        <Skeleton key={index * Math.floor(Math.random() * 100 - 1)} className='h-[255px] w-[155px] rounded-none' />
      ))}
    </>
  );
};

export default function GameList({ games }: GameListProps) {
  const [validGames, setValidGames] = useState<SteamGame[]>([]);
  const { setCurrentGame, setOpenDrawer } = useCurrentGame();
  const { setGameInfo } = useGameInfo();

  const fetchGameData = async (game: SteamGame) => {
    try {
      const result = await fetch(
        `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/steam/gameinfo?appId=${game?.appid}&language=en`
      );
      if (result.ok) {
        const res = await result.json();
        setGameInfo(res[game?.appid as string]['data'] as SteamGameInfo);
      }
      return result.ok;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleGameSelect = async (item: SteamGame) => {
    setCurrentGame(item);
    if (await fetchGameData(item)) {
      setOpenDrawer(true);
    }
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!games) return;
    const checkImages = async () => {
      const updatedGames = await Promise.all<SteamGame>(
        games.map(async (item: any) => {
          let src;
          let isInvalid;
          const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/steam/image?appId=${item.appid}`
          );
          src = await res.text();
          if (!(await isImageUrlValid(src))) {
            src = item.images.portrait;
            isInvalid = true;
          }

          return !isInvalid ? { ...item, images: { ...item.images, portrait: src } } : null;
        })
      );

      setValidGames(updatedGames.filter((game) => game !== null));
      setLoading(false);
    };

    checkImages();
  }, []);

  return (
    <>
      {loading ? (
        <Skeletons />
      ) : (
        validGames
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((item: SteamGame, index) => (
            <div
              key={item.appid + (index + item.name)}
              className='flex flex-col h-[230px] w-[155px] p-[3px] hover:p-0 transition-all delay-100 shadow-lg shadow-indigo-500/10 border-none'
              onClick={() => handleGameSelect(item)}>
              <Image loading='lazy' width={300} height={450} quality={50} alt={item.name} src={item.images.portrait} />
            </div>
          ))
      )}
    </>
  );
}
