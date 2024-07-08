'use client';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useCurrentGame } from '@/hook/current-game';
import { useGameInfo } from '@/hook/game-info';
import { socket } from '@/socket';
import { SteamGame } from '@/types/response-schemas/steam';
import { Typography } from '@mui/material';
import he from 'he';
import { useEffect } from 'react';
import { Player } from 'video-react';
import { Button } from '../ui/button';

interface GameDrawerProps {
  open: boolean;
}

function GameBackground({ currentGame }: { currentGame: SteamGame }) {
  return (
    <>
      <div
        className={`flex absolute h-full w-screen rounded-sm background-cover`}
        style={{
          background: `url(${currentGame?.images?.libraryHero})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: '0.9',
        }}></div>
      <style jsx>{`
        .background-cover::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1));

          z-index: 1;
        }
      `}</style>
    </>
  );
}
export function GameDrawer({ open }: GameDrawerProps) {
  const { gameInfo } = useGameInfo();
  const { currentGame, setOpenDrawer } = useCurrentGame();
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Drawer onOpenChange={setOpenDrawer} open={open}>
      <DrawerContent className='w-full h-[80%] bg-gray-900 rounded-md'>
        <DrawerHeader className='z-10'>
          <div className='grid grid-cols-2 w-full'>
            <DrawerTitle>
              <Typography variant='h3'>{currentGame?.name}</Typography>
            </DrawerTitle>
            <div className='flex flex-row justify-start items-start h-full w-full p-1'>
              <Button
                onClick={() => {
                  socket.emit('rungame', currentGame);
                  setOpenDrawer(false);
                }}
                className='bg-[#58bf40] hover:bg-[#6ce152] shadow-md text-white max-w-48 flex flex-row justify-start rounded-[2px] items-center align-middle text-center w-full'>
                <Typography variant='button'>▶ Play</Typography>
              </Button>
            </div>
            <DrawerDescription className='p-2'>{he.decode(gameInfo?.short_description ?? '')}</DrawerDescription>
          </div>
        </DrawerHeader>
        <GameBackground currentGame={currentGame} />
        <div className='flex flex-col items-center justify-start overflow-scroll '>
          <div
            className=' max-w-7xl  bg-[rgba(0,0,0,0.2)] 
            rounded-md px-4 py-5 z-10 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 shadow-lg'>
            <div className='grid grid-cols-2'>
              <div className='w-full flex flex-col items-center justify-start'>
                {gameInfo?.movies?.length > 0 && (
                  <>
                    <div className='w-[550px] border-2 border-zinc-800 border-solid p-1 rounded-sm'>
                      <Player width={550} playsInline autoPlay fluid preload='auto'>
                        <source src={gameInfo?.movies[0].webm[480]} />
                      </Player>
                    </div>
                  </>
                )}
              </div>
              <div className='overflow-auto h-[300px]'>
                <div className='flex flex-col items-start justify-start gap-2'>
                  <Typography variant='h5'>About the game</Typography>
                  <div
                    className='flex flex-col items-start justify-start gap-2 text-zinc-300'
                    dangerouslySetInnerHTML={{
                      __html: gameInfo?.about_the_game?.replace(/<img[^>]*>/g, '').replace(/<br\s*\/?>/, ''),
                    }}
                  />
                </div>
              </div>
              {/* <div className='h-[600px] w-full z-10'></div> */}
            </div>
          </div>
          <div className='h-[600px] w-full z-10'></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
