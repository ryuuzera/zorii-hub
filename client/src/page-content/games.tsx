'use client';
import { GameDrawer } from '@/components/game-drawer';
import GameList from '@/components/gameList';
import RecentGames from '@/components/recent-games';
import { useCurrentGame } from '@/hook/current-game';
import { GameInfoProvider } from '@/hook/game-info';
import { RecentGame, SteamGame } from '@/types/response-schemas/steam';

interface GamesPageProps {
  games: SteamGame[] | null;
  recent: RecentGame[] | null;
}

export function GamesPage({ games, recent }: GamesPageProps) {
  const { drawer } = useCurrentGame();
  return (
    <>
      <GameInfoProvider>
        <RecentGames games={games} recent={recent} />
        <div className='grid min-[320px]:grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 max-w-7xl'>
          <GameList games={games} />
        </div>
        <GameDrawer open={drawer} />
      </GameInfoProvider>
    </>
  );
}
