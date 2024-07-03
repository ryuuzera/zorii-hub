import GameList from '@/components/gameList';
import io from 'socket.io-client';

async function connectIO() {
  const socket = io('http://192.168.0.109:3001/');
}
async function getGames() {
  const result = await fetch('http://192.168.0.109:3001/api/steam');
  if (result.ok) {
    return await result.json();
  }
  return null;
}

export default async function Home() {
  const games = await getGames();
  return (
    <main className='flex w-screen items-center justify-center'>
      {/* <div className='flex flex-row flex-wrap w-full max-w-7xl'> */}
      <div className='grid min-[320px]:grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 w-full max-w-7xl'>
        <GameList games={games} />
      </div>
    </main>
  );
}
