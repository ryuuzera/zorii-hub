'use client';
import { socket } from '@/socket';
import Image from 'next/image';
import { useEffect, useState } from 'react';
export default function GameList({ games }: any) {
  const [validGames, setValidGames] = useState<any[]>([]);

  const isImageUrlValid = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking image URL:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkImages = async () => {
      const updatedGames = await Promise.all(
        games.map(async (item: any) => {
          let src = item.images.portrait;
          if (!(await isImageUrlValid(src))) {
            const res = await fetch(`http://192.168.0.109:3001/api/steam/image?appId=${item.appid}`);
            src = await res.text();
          }

          const isValid = await isImageUrlValid(src);
          return isValid ? { ...item, validSrc: src } : null;
        })
      );

      setValidGames(updatedGames.filter((game) => game !== null));
    };

    checkImages();

    socket.connect();
    (async () => await navigator.wakeLock?.request('screen'))();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);
  return (
    <>
      {validGames?.map((item) => (
        <div
          key={item.appid}
          className='flex flex-col h-[230px] w-[155px] p-[3px] hover:p-0 transition-all delay-100'
          onClick={() => {
            socket.timeout(5000).emit('rungame', { appid: item.appid });
          }}>
          <Image width={300} height={450} quality={50} alt={item.name} src={item.validSrc} />
        </div>
      ))}
    </>
  );
}
