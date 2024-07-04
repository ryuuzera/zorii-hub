'use client';

import { useEffect, useState } from 'react';

export function Startup() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 2800);
  }, []);

  return (
    <>
      {visible ? (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <video src='/assets/startup.webm' autoPlay muted />
        </div>
      ) : null}
    </>
  );
}
