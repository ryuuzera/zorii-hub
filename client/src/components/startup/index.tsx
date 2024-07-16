'use client';
import { useEffect, useState } from 'react';

export function Startup() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }, []);

  return (
    <>
      {visible ? (
        <div className='h-screen w-screen bg-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden'>
          <div className='flex justify-center items-center h-full w-full'>
            <video autoPlay muted height={'100%'} width={'100%'} src='/assets/startup3.webm' />
          </div>
        </div>
      ) : null}
    </>
  );
}
