'use client';
import { useEffect, useState } from 'react';
import { Tabs } from '../ui/tabs';

export function ClientTab(props: any) {
  const [opacity, setOpacity] = useState('opacity-0');
  useEffect(() => {
    setTimeout(() => {
      setOpacity('opacity-1');
    }, 3000);
  }, []);
  return (
    <Tabs {...props} defaultValue='Games' className={opacity}>
      {props.children}
    </Tabs>
  );
}
