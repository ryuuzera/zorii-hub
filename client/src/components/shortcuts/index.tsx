'use client';
import { socket } from '@/socket';
import Image from 'next/image';
import { useEffect } from 'react';

type Shortcut = {
  icon: string;
  command: string;
};

interface ShortcutsProps {
  shortcuts: Shortcut[];
}
export function Shortcuts({ shortcuts }: ShortcutsProps) {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  function handleShutdown() {
    alert('shutdown');
  }

  return (
    <div className='flex justify-center items-center h-24 w-full fixed -left-1/2 translate-x-1/2 bottom-1 '>
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
    </div>
  );
}
