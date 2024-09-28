import { GameDrawer } from '@/components/game-drawer';
import GameList from '@/components/gameList';
import RecentGames from '@/components/recent-games';
import { fetchData } from '@/lib/http-utils';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';


export default async function GamesPage() {
  const [games, recent] = await Promise.all([fetchData<SteamGame[]>('steam'), fetchData<RecentGame[]>('steam/recent')]);

  return (
    <>
      <RecentGames games={games} recent={recent} />
      <div className='grid min-[320px]:grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 max-w-7xl overflow-x-hidden'>
        <GameList games={games} />
      </div>
      <GameDrawer />
    </>
  );
}
