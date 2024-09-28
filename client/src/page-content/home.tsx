'use client';
import { ClientTab } from '@/components/client-tab';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

const pagesRouter = [
  {
    path: '/games',
    value: 'Games',
    title: 'Steam Games',
  },
  {
    path: '/hardware-info',
    value: 'Hardware',
    title: 'Hardware Monitor',
  },
  {
    path: '/control-center',
    value: 'ControlCenter',
    title: 'Control Center',
  },
];

export function TabController({ children }: any) {
  const pageTransition = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.5 },
  };
  const pathname = usePathname();

  const defaultValue = pagesRouter.find((x) => x.path == pathname)?.value;
  const router = useRouter();

  return (
    <>
      {defaultValue ? (
        <ClientTab defaultValue={defaultValue}>
          <div className='flex flex-row gap-2 item-center justify-center w-full mt-2'>
            <TabsList className='grid w-[500px] grid-cols-3'>
              {pagesRouter.map((item) => (
                <TabsTrigger value={item.value} onClick={() => router.push(item.path)}>
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <AnimatePresence>
            <div className='w-screen overflow-x-hidden flex flex-col items-center justify-center'>
              {children}
            </div>

            {/* <TabsContent
            hidden
            value='Games'
            className='w-screen overflow-x-hidden flex flex-col items-center justify-center'>
            <motion.div {...pageTransition}>{children}</motion.div>
          </TabsContent>
          <TabsContent value='Hardware' className='w-screen flex items-center justify-center'>
            <motion.div {...pageTransition}>
               <HardwareMonitor data={hardwareInfo} /> 
              </motion.div>
          </TabsContent>
          <TabsContent value='ControlCenter' className='w-screen flex flex-col items-center justify-center'>
            <motion.div {...pageTransition}>
               <ControlCenter playerStateData={playerState} /> *
              </motion.div>
          </TabsContent> */}
          </AnimatePresence>
        </ClientTab>
      ) : (
        children
      )}
    </>
  );
}
