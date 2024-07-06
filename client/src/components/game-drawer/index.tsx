'use client';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { SteamGame } from '@/types/response-schemas/steam';
import { useEffect, useState } from 'react';

interface GameDrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  currentGame: SteamGame | null;
}
export function GameDrawer({ open, onOpenChange, currentGame }: GameDrawerProps) {
  const [gameInfo, setGameInfo] = useState<any>({});

  useEffect(() => {
    (async () => {
      const result = await fetch(
        'http://localhost:3001/api/steam/gameinfo?appId=' + currentGame?.appid + '&language=en'
      );
      if (result.ok) {
        const res = await result.json();
        console.log(res);
        setGameInfo(res[currentGame?.appid as string]['data']);
      }

      // console.log(gameInfo);
    })();
  }, []);

  return (
    <Drawer onOpenChange={onOpenChange} open={true}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent
        className='w-full h-[50%] bg-gray-900 rounded-md 
        bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 shadow-lg'>
        <DrawerHeader>
          <DrawerTitle>{currentGame?.name}</DrawerTitle>
          <DrawerDescription>{gameInfo?.short_description}</DrawerDescription>
          {/* <DrawerDescription>Last time played: 01-25 {currentGame?.appid}</DrawerDescription> */}
        </DrawerHeader>
        <div className='flex absolute h-[350px] w-screen rounded-sm'>
          <img className='object-cover w-full h-full rounded-t-sm' src={currentGame?.images.libraryHero} alt='' />
        </div>
        <DrawerFooter>
          {/* <Button>Submit</Button> */}
          <DrawerClose>{/* <Button variant='outline'>Cancel</Button> */}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
