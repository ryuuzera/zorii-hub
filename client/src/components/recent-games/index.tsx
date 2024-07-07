'use client';
import { socket } from '@/socket';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';
import { formatDate } from '@/utils/converter/dateformatter';
import { Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

type RecentGamesProps = {
  games: SteamGame[] | null;
  recent: RecentGame[] | null;
};

export default function RecentGames({ games, recent }: RecentGamesProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [recentGames, setRecentGames] = useState<RecentGame[] | null>(recent);
  const initialButton = useRef<any>(null);

  const slider = useRef<any>(null);
  let isDown = useRef<any>(false);
  let startX = useRef<any>(null);
  let scrollLeft = useRef<any>(null);

  function one(e: { pageX: number }) {
    isDown.current = true;
    startX.current = e.pageX - slider.current.offsetLeft;
    scrollLeft.current = slider.current.scrollLeft;
  }

  function two(e: { pageX: number }) {
    isDown.current = true;
    startX.current = e.pageX - slider.current.offsetLeft;
    scrollLeft.current = slider.current.scrollLeft;
  }

  function three() {
    isDown.current = false;
  }

  function four() {
    isDown.current = false;
  }
  function five(e: { preventDefault: () => void; pageX: number }) {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - slider.current.offsetLeft;
    const walk = x - startX.current;
    slider.current.scrollLeft = scrollLeft.current - walk;
  }

  useEffect(() => {
    let sliderRef = null;
    if (slider && slider.current) {
      sliderRef = slider.current;
      sliderRef.addEventListener('mousedown', one);
      sliderRef.addEventListener('mousedown', two);
      sliderRef.addEventListener('mouseleave', three);
      sliderRef.addEventListener('mouseup', four);
      sliderRef.addEventListener('mousemove', five);
    }

    socket.connect();

    socket.on('recentupdate', (data: RecentGame[]) => {
      console.log(data);
      setRecentGames(data);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      sliderRef.removeEventListener('mousedown', one);
      sliderRef.removeEventListener('mousedown', two);
      sliderRef.removeEventListener('mouseleave', three);
      sliderRef.removeEventListener('mouseup', four);
      sliderRef.removeEventListener('mousemove', five);
    };
  }, []);

  const handleRunGame = (game: SteamGame | undefined) => {
    if (!game) return;
    socket.emit('rungame', game);
  };

  return (
    <>
      {recentGames && recentGames.length > 0 ? (
        <div className='flex flex-col'>
          <Typography variant='h6' px={1}>
            Recent games
          </Typography>
          <Separator className='mt-2 mb-3' />
          <div ref={slider} className='w-screen max-w-7xl overflow-x-auto invisible-scroll'>
            <div className='flex flex-row mb-5 justify-start items-center transition-all delay-200'>
              {recentGames?.map((item: RecentGame, i) => {
                const isHovered = hoveredItem === item.appId;
                const isFirst = i == 0;
                const currentGame = games?.find((game) => game?.appid === item.appId);
                return (
                  <div
                    ref={isFirst ? initialButton : null}
                    key={item.appId}
                    className='flex flex-col h-[300px] relative'
                    onMouseLeave={() => setHoveredItem(null)}
                    onDoubleClick={!isFirst ? () => handleRunGame(currentGame) : undefined}>
                    <div
                      onMouseEnter={() => setHoveredItem(item.appId)}
                      className={`
                    h-[230px] ${0 == i ? 'min-w-[450px]' : 'min-w-[155px]'} 
                    ${!isHovered ? 'p-[5px]' : 'p-0'}  transition-all delay-100
                    ${isHovered ? 'border-solid border-white border-[1px] shadow-lg shadow-indigo-500/20' : ''}
                     z-0
                    ${isFirst && isHovered ? `mr-[-12px] z-10 ` : ''}`}>
                      <img
                        draggable='false'
                        src={isFirst ? currentGame?.images.library : currentGame?.images.portrait}
                        className='w-full h-full object-center'
                      />
                    </div>
                    {isHovered && (
                      <>
                        {isFirst ? (
                          <>
                            <div className='flex flex-row items-center mt-2 transition-all delay-200 absolute w-[1000px] bottom-3'>
                              <Button
                                className='bg-[#58bf40] hover:bg-[#3cc039] text-white m-2 mr-3 rounded-sm text-xl h-[80%] w-[60px] p-0'
                                onClick={() => handleRunGame(currentGame)}>
                                <Typography variant='h4'>▶</Typography>
                              </Button>
                              <div className='flex flex-col '>
                                <Typography variant='h6' className='text-white'>
                                  {item.title}
                                </Typography>
                                <Typography variant='caption'>
                                  Last time played {formatDate(item?.launchedAt)}
                                </Typography>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className='w-[500px] absolute bottom-5'>
                            <Typography variant='body2' sx={{ fontWeight: 600 }} ml={1}>
                              {item.title}
                            </Typography>
                            <div className='flex flex-row ml-2 items-center'>
                              <Typography variant='button' sx={{ color: '#58bf40' }}>
                                ▶
                              </Typography>
                              <Typography variant='caption' ml={1}>
                                Last time played {formatDate(item?.launchedAt)}
                              </Typography>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <style jsx>{`
            .invisible-scroll::-webkit-scrollbar {
              display: none;
            }
            .invisible-scroll {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}
