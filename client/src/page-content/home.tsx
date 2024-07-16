'use client';
import { ClientTab } from '@/components/client-tab';
import HardwareMonitor from '@/components/hardwaremonitor';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardwareInfo } from '@/types/response-schemas/hardwareinfo';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';
import { YMusicState } from '@/types/response-schemas/yt-music/state';
import { AnimatePresence, motion } from 'framer-motion';
import { ControlCenter } from './control-center';
import { GamesPage } from './games';

interface HomePageProps {
  games: SteamGame[] | null;
  recent: RecentGame[] | null;
  hardwareInfo: HardwareInfo | null;
  playerState?: YMusicState;
}
export function HomePage({ games, recent, hardwareInfo, playerState }: HomePageProps) {
  const pageTransition = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.5 },
  };

  return (
    <>
      <ClientTab defaultValue='Games'>
        <div className='flex flex-row gap-2 item-center justify-center w-full mt-2'>
          <TabsList className='grid w-[500px] grid-cols-3'>
            <TabsTrigger value='Games'>Steam Games</TabsTrigger>
            <TabsTrigger value='Hardware'>Hardware Monitor</TabsTrigger>
            <TabsTrigger value='ControlCenter'>Control Center</TabsTrigger>
          </TabsList>
        </div>
        <AnimatePresence>
          <TabsContent value='Games' className='w-screen overflow-x-hidden flex flex-col items-center justify-center'>
            <motion.div {...pageTransition}>
              <GamesPage games={games} recent={recent} />
            </motion.div>
          </TabsContent>
          <TabsContent value='Hardware' className='w-screen flex items-center justify-center'>
            <motion.div {...pageTransition}>
              <HardwareMonitor data={hardwareInfo} />
            </motion.div>
          </TabsContent>
          <TabsContent value='ControlCenter' className='w-screen flex flex-col items-center justify-center'>
            <motion.div {...pageTransition}>
              <ControlCenter playerStateData={playerState} />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </ClientTab>
    </>
  );
}
