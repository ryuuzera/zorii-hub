'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Startup() {
  const [visible, setVisible] = useState(true);

  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      router.push('/games');
    }, 5000);
  }, []);

  return (
    <>
      {visible ? (
        <div className='z-10 absolute h-screen w-screen bg-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden'>
          <div className='flex justify-center items-center h-full w-full'>
            <video autoPlay muted height={'100%'} width={'100%'} src='/assets/startup3.webm' />
          </div>
        </div>
      ) : null}
    </>
  );
}
