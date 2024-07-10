import { ClientTab } from '@/components/client-tab';
import HardwareMonitor from '@/components/hardwaremonitor';
import { Shutdown } from '@/components/shutdown';
import { Startup } from '@/components/startup';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GamesPage } from '@/page-content/games';
import { HomePage } from '@/page-content/home';
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
      {/* <Startup /> */}
      <HomePage games={games} recent={recent} hardwareInfo={hardwareInfo} />
    </main>
  );
}
