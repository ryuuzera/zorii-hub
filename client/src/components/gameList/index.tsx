'use client';
import { useCurrentGame } from '@/hook/current-game';
import { useGameInfo } from '@/hook/game-info';
import { socket } from '@/socket';
import { SteamGame } from '@/types/response-schemas/steam';
import { SteamGameInfo } from '@/types/response-schemas/steam-game-info';
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
  const { setCurrentGame, setOpenDrawer } = useCurrentGame();
  const { setGameInfo } = useGameInfo();

  const fetchGameData = async (game: SteamGame) => {
    const result = await fetch('http://192.168.0.109:3001/api/steam/gameinfo?appId=' + game?.appid + '&language=en');
    if (result.ok) {
      const res = await result.json();
      setGameInfo(res[game?.appid as string]['data'] as SteamGameInfo);
    }
    return result.ok;
  };

  const handleGameSelect = async (item: SteamGame) => {
    socket.emit('rungame', item);
    setCurrentGame(item);
    if (await fetchGameData(item)) {
      setOpenDrawer(true);
    }
  };
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
            className='flex flex-col h-[230px] w-[155px] p-[3px] hover:p-0 transition-all delay-100 shadow-lg shadow-indigo-500/10 border-none'
            onClick={() => handleGameSelect(item)}>
            <Image width={300} height={450} quality={90} alt={item.name} src={item.images.portrait} />
          </div>
        ))}
    </>
  );
}
