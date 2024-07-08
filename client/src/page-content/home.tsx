'use client';
import { ClientTab } from '@/components/client-tab';
import HardwareMonitor from '@/components/hardwaremonitor';
import { Shutdown } from '@/components/shutdown';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardwareInfo } from '@/types/response-schemas/hardwareinfo';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';
import { AnimatePresence, motion } from 'framer-motion';
import { GamesPage } from './games';

interface HomePageProps {
  games: SteamGame[] | null;
  recent: RecentGame[] | null;
  hardwareInfo: HardwareInfo | null;
}
export function HomePage({ games, recent, hardwareInfo }: HomePageProps) {
  const pageTransition = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.5 },
  };

  return (
    <>
      <ClientTab defaultValue='Hardware'>
        <div className='flex flex-row gap-2 item-center justify-center w-full mt-2'>
          <TabsList className='grid w-[500px] grid-cols-3'>
            <TabsTrigger value='Games'>Steam Games</TabsTrigger>
            <TabsTrigger value='Hardware'>Hardware Monitor</TabsTrigger>
            <TabsTrigger value='Settings'>Settings</TabsTrigger>
          </TabsList>
        </div>
        <AnimatePresence>
          <TabsContent value='Games' className='w-full flex flex-col items-center justify-center'>
            <motion.div {...pageTransition}>
              <GamesPage games={games} recent={recent} />
            </motion.div>
          </TabsContent>
          <TabsContent value='Hardware' className='w-screen flex items-center justify-center'>
            <motion.div {...pageTransition}>
              <HardwareMonitor data={hardwareInfo} />
            </motion.div>
          </TabsContent>
          <TabsContent value='Settings'>
            <motion.div {...pageTransition}>
              <Shutdown />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </ClientTab>
    </>
  );
}
