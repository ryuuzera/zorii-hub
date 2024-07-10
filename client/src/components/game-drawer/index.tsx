'use client';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useCurrentGame } from '@/hook/current-game';
import { useGameInfo } from '@/hook/game-info';
import { socket } from '@/socket';
import { SteamGame } from '@/types/response-schemas/steam';
import { Dialog as MuiDrawer, Typography } from '@mui/material';
import he from 'he';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Player } from 'video-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

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
  const [imagePreview, setImagePreview] = useState<string>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    socket.connect();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <Drawer onClose={() => setOpenDrawer(false)} open={open}>
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
          <div className='flex flex-col items-center justify-start overflow-auto '>
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
            <div className='min-h-[300px] max-w-7xl w-full '>
              <div
                className='flex flex-col w-full mb-5 mt-5  bg-[rgba(0,0,0,0.2)] 
               rounded-md px-4 py-5 z-10 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 shadow-lg'>
                {gameInfo?.screenshots?.length > 0 && (
                  <>
                    <Typography variant='h5'>Gallery</Typography>
                    <Separator className='my-3 bg-zinc-800' />
                    <div className='flex flex-row max-w-7xl overflow-x-auto p-2 space-x-3 '>
                      {gameInfo?.screenshots?.map((img) => {
                        let previewInterval: NodeJS.Timeout;
                        return (
                          <div
                            key={img.id}
                            onTouchStart={() => {
                              previewInterval = setTimeout(() => {
                                setImagePreview(img.path_full);
                                setDrawerOpen(true);
                              }, 800);
                            }}
                            onTouchEnd={() => {
                              clearTimeout(previewInterval);
                              setDrawerOpen(false);
                            }}
                            className='shadow-md min-w-[300px] shadow-zinc-900 rounded-sm overflow-hidden mb-3 invisible-scroll'>
                            <Image alt={img.id.toString()} src={img.path_thumbnail} height={150} width={300} />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {gameInfo?.movies?.length > 1 && (
                  <>
                    <Typography variant='h5'>Videos</Typography>
                    <Separator className='my-3 bg-zinc-800' />
                    <div className='flex flex-row max-w-7xl overflow-x-auto p-2 space-x-3 '>
                      {gameInfo?.movies?.map((video, i) => {
                        if (i == 0) return;
                        return (
                          <div className='min-w-[550px]' key={video.id}>
                            <Player poster={video.thumbnail}>
                              <source src={video.webm.max} />
                            </Player>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                <Typography variant='h5' mt={2}>
                  System Requirements
                </Typography>
                <Separator className='my-3 bg-zinc-800' />
                <div className='grid grid-cols-2 max-w-7xl overflow-x-auto p-2 space-x-3 '>
                  <div dangerouslySetInnerHTML={{ __html: gameInfo?.pc_requirements?.minimum }} />
                  <div dangerouslySetInnerHTML={{ __html: gameInfo?.pc_requirements?.recommended }} />
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <MuiDrawer
        open={drawerOpen}
        fullWidth
        maxWidth='md'
        PaperProps={{
          style: {
            background: 'rgba(0,0,0,0)',
            boxShadow: 'none',
            transition: 'all 2s ease',
          },
        }}>
        <div className='py-6 gap-5 flex flex-col items-center justify-center px-5 rounded-md '>
          <Image src={imagePreview ?? ''} alt={imagePreview ?? ''} width={900} height={650} />
        </div>
      </MuiDrawer>
    </>
  );
}
