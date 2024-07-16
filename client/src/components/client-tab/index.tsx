'use client';
import { useEffect, useState } from 'react';
import { useWakeLock } from 'react-screen-wake-lock';
import { Tabs } from '../ui/tabs';

export function ClientTab(props: any) {
  const [opacity, setOpacity] = useState('opacity-0');
  const { isSupported, released, request, release } = useWakeLock({});

  useEffect(() => {
    setTimeout(() => {
      setOpacity('opacity-1');
    }, 2000);
    if (isSupported) request();

    return () => {
      release();
    };
  }, []);

  return (
    <Tabs {...props} className={`${opacity} transition-all delay-200 overflow-hidden`}>
      {props.children}
    </Tabs>
  );
}
