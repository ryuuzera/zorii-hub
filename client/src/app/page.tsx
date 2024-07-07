import { ClientTab } from '@/components/client-tab';
import HardwareMonitor from '@/components/hardwaremonitor';
import { Shutdown } from '@/components/shutdown';
import { Startup } from '@/components/startup';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GamesPage } from '@/page-content/games';
import { HardwareInfo } from '@/types/response-schemas/hardwareinfo';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';

type dataType = 'steam' | 'hardwareinfo' | 'steam/recent';

async function fetchData<T>(type: dataType) {
  try {
    const result = await fetch(`http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/${type}`, {
      cache: 'no-cache',
    });
    if (result.ok) {
      return (await result.json()) as T;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [games, recent, hardwareInfo] = await Promise.all([
    fetchData<SteamGame[]>('steam'),
    fetchData<RecentGame[]>('steam/recent'),
    fetchData<HardwareInfo>('hardwareinfo'),
  ]);

  return (
    <main className='flex w-screen items-center justify-center'>
      <Startup />
      <ClientTab defaultValue='Hardware'>
        <div className='flex flex-row gap-2 item-center justify-center w-full mt-2'>
          <TabsList className='grid w-[500px] grid-cols-3'>
            <TabsTrigger value='Games'>Steam Games</TabsTrigger>
            <TabsTrigger value='Hardware'>Hardware Monitor</TabsTrigger>
            <TabsTrigger value='Settings'>Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='Games' className='w-full flex flex-col items-center justify-center'>
          <GamesPage games={games} recent={recent} />
        </TabsContent>
        <TabsContent value='Hardware' className='w-screen flex items-center justify-center'>
          <HardwareMonitor data={hardwareInfo} />
        </TabsContent>
        <TabsContent value='Settings'>
          <Shutdown />
        </TabsContent>
      </ClientTab>
    </main>
  );
}
