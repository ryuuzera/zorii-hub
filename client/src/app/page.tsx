import GameList from '@/components/gameList';
import HardwareMonitor from '@/components/hardwaremonitor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

async function getGames() {
  try {
    const result = await fetch('http://192.168.0.109:3001/api/steam', { cache: 'no-cache' });
    if (result.ok) {
      return await result.json();
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function getHardwareInfo() {
  try {
    const result = await fetch('http://192.168.0.109:3001/api/hardwareinfo', { cache: 'no-cache' });
    if (result.ok) {
      return await result.json();
    }
    return null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [games, hardwareInfo] = await Promise.all([getGames(), getHardwareInfo()]);

  return (
    <main className='flex w-screen items-center justify-center'>
      <Tabs defaultValue='Hardware'>
        <div className='flex flex-row gap-2 item-center justify-center w-full mt-2'>
          <TabsList className='grid w-[500px] grid-cols-3'>
            <TabsTrigger value='Games'>Steam Games</TabsTrigger>
            <TabsTrigger value='Hardware'>Hardware Monitor</TabsTrigger>
            <TabsTrigger value='Settings'>Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='Games' className='w-full flex items-center justify-center'>
          <div className='grid min-[320px]:grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 max-w-7xl'>
            <GameList games={games} />
          </div>
        </TabsContent>
        <TabsContent value='Hardware' className='w-screen flex items-center justify-center'>
          <HardwareMonitor data={hardwareInfo} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
