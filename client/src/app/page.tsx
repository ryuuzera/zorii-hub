import { Startup } from '@/components/startup';


export default async function Home({ children }: any) {

  return (
    <main className='flex w-screen items-center justify-center overflow-x-hidden'>
      <Startup />
    </main>
  );
}
