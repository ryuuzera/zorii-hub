import { ClientTab } from '@/components/client-tab';
import { GameDrawer } from '@/components/game-drawer';
import GameList from '@/components/gameList';
import HardwareMonitor from '@/components/hardwaremonitor';
import RecentGames from '@/components/recent-games';
import { Shutdown } from '@/components/shutdown';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardwareInfo } from '@/types/response-schemas/hardwareinfo';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';

type dataType = 'steam' | 'hardwareinfo' | 'steam/recent';

async function fetchData<T>(type: dataType) {
  try {
    const result = await fetch(`http://192.168.0.109:3001/api/${type}`, { cache: 'no-cache' });
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
      {/* <Startup /> */}
      <ClientTab defaultValue='Hardware'>
        <div className='flex flex-row gap-2 item-center justify-center w-full mt-2'>
          <TabsList className='grid w-[500px] grid-cols-3'>
            <TabsTrigger value='Games'>Steam Games</TabsTrigger>
            <TabsTrigger value='Hardware'>Hardware Monitor</TabsTrigger>
            <TabsTrigger value='Settings'>Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='Games' className='w-full flex flex-col items-center justify-center'>
          <RecentGames games={games} recent={recent} />
          <div className='grid min-[320px]:grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 max-w-7xl'>
            <GameList games={games} />
          </div>
          <GameDrawer open={true} currentGame={games && games[3]} />
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
