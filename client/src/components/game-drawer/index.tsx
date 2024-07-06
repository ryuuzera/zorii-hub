'use client';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useCurrentGame } from '@/hook/current-game';
import { useGameInfo } from '@/hook/game-info';
import { SteamGame } from '@/types/response-schemas/steam';
import { Typography } from '@mui/material';
import he from 'he';
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

  return (
    <Drawer onOpenChange={setOpenDrawer} open={open}>
      <DrawerContent
        className='w-full h-[70%] bg-gray-900 rounded-md 
        bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 shadow-lg'>
        <DrawerHeader className='z-10'>
          <DrawerTitle>{currentGame?.name}</DrawerTitle>
          <div className='grid grid-cols-2 w-full'>
            <DrawerDescription className='p-2'>{he.decode(gameInfo?.short_description ?? '')}</DrawerDescription>
            <div className='flex flex-row justify-start items-start h-full w-full p-1'>
              <Button className='bg-[#58bf40] text-white max-w-48 flex flex-row justify-start rounded-[2px] items-center align-middle text-center w-full'>
                <Typography variant='button'>▶ Play</Typography>
              </Button>
            </div>
          </div>
        </DrawerHeader>
        <GameBackground currentGame={currentGame} />
        <DrawerFooter>
          <DrawerClose>{/* <Button variant='outline'>Cancel</Button> */}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

{
  /* <img className='object-cover w-full h-full rounded-t-sm' src={currentGame?.images.libraryHero} alt='' /> */
}
