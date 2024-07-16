'use client';
import { socket } from '@/socket';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Shortcut = {
  icon: string;
  command: string;
};

interface ShortcutsProps {
  shortcuts: Shortcut[];
}
export function Shortcuts({ shortcuts }: ShortcutsProps) {
  const [opacity, setOpacity] = useState<string>('opacity-0');
  useEffect(() => {
    socket.connect();

    setTimeout(() => {
      setOpacity('opacity-1');
    }, 500);

    return () => {
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  function handleShutdown() {
    socket.emit('shutdown');
  }

  return (
    <motion.div
      className={`${opacity} transition-all delay-700 flex justify-center items-center h-24 w-full fixed -left-1/2 translate-x-1/2 bottom-1`}
      initial={{ y: 100, x: '50%' }}
      animate={{ y: 0, x: '50%' }}
      transition={{ duration: 1, delay: 0.3 }}>
      <div className='flex flex-row items-center px-5 py-1 gap-4 border border-slate-800 rounded-xl'>
        {shortcuts.map((item) => (
          <button
            className='relative flex h-[68px] w-[68px] p-1 hover:p-0 transition-all delay-200'
            key={item.command}
            onClick={
              item.command == 'shutdown'
                ? handleShutdown
                : () => {
                    socket.emit(item.command);
                  }
            }>
            <div className='flex flex-col'>
              <Image width={100} height={50} src={`/assets/${item.icon}`} alt={item.command} />
              <div className='absolute p-1 top-16 left-0 '>
                <Image
                  width={100}
                  height={50}
                  src={`/assets/${item.icon}`}
                  alt={item.command}
                  className='rotate-180 blur-sm opacity-20 h-5 '
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
