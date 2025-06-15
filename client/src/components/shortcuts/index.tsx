'use client';
import { useSocket } from '@/hook/socket-connection';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type Shortcut = {
  icon: string;
  command: string;
};

interface ShortcutsProps {
  shortcuts: Shortcut[];
}

export function Shortcuts({ shortcuts }: ShortcutsProps) {
  const { socket } = useSocket();
  const [opacity, setOpacity] = useState('opacity-0');
  const [fabOpen, setFabOpen] = useState(false);

  function handleShutdown() {
    socket.emit('shutdown');
  }

  useEffect(() => {
    const timer = setTimeout(() => setOpacity('opacity-100'), 600);
    return () => clearTimeout(timer);
  }, []);

  // MOBILE: FABs
  return (
    <>
      {/* MOBILE FABs */}
      <div className="fixed z-50 bottom-6 right-6 flex flex-col items-end gap-3 sm:hidden">
        <AnimatePresence>
          {fabOpen &&
            shortcuts.map((item, idx) => (
              <motion.button
                key={item.command}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.06 * idx }}
                onClick={() => {
                  setFabOpen(false);
                  item.command === 'shutdown'
                    ? handleShutdown()
                    : socket.emit(item.command);
                }}
                className="w-14 h-14 mb-2 rounded-full flex items-center justify-center bg-gray-900 border border-gray-700 shadow-xl hover:bg-gray-700 active:scale-95 transition"
              >
                <Image
                  src={`/assets/${item.icon}`}
                  alt={item.command}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </motion.button>
            ))}
        </AnimatePresence>
        {/* FAB Principal */}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className="w-16 h-16 rounded-full bg-blue-600 shadow-2xl flex items-center justify-center text-white text-3xl border-4 border-white/20 active:scale-95 transition"
          aria-label="Abrir atalhos"
        >
          {fabOpen ? (
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" className="rotate-45"><line x1="6" y1="14" x2="22" y2="14"/><line x1="14" y1="6" x2="14" y2="22"/></svg>
          ) : (
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3"><line x1="6" y1="14" x2="22" y2="14"/><line x1="14" y1="6" x2="14" y2="22"/></svg>
          )}
        </button>
      </div>

      {/* DESKTOP: barra normal */}
      <motion.div
        className={`${opacity} transition-all fixed bottom-4 left-0 right-0 flex justify-center sm:flex hidden`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-full px-4 py-2 border border-gray-700 shadow-lg">
          <div className="flex overflow-x-auto gap-3 py-2 px-2 scrollbar-hide">
            {shortcuts.map((item) => (
              <button
                key={item.command}
                className="flex flex-col items-center group min-w-[60px]"
                onClick={
                  item.command == 'shutdown'
                    ? handleShutdown
                    : () => socket.emit(item.command)
                }
              >
                <div className="bg-gray-800/70 group-hover:bg-gray-700/80 rounded-full p-3 transition-all">
                  <Image
                    width={32}
                    height={32}
                    src={`/assets/${item.icon}`}
                    alt={item.command}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-xs text-gray-300 mt-1 capitalize">
                  {item.command}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
