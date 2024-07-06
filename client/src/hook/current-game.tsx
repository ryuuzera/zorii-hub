'use client';
import { SteamGame } from '@/types/response-schemas/steam';
import { createContext, useContext, useState } from 'react';

interface CurrentGameContext {
  currentGame: SteamGame;
  setCurrentGame: (game: SteamGame) => void;
  drawer: boolean;
  setOpenDrawer: (value: boolean) => void;
}

const CurrentGameContext = createContext<CurrentGameContext | undefined>(undefined);

export function CurrentGameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setState] = useState<SteamGame>({} as SteamGame);
  const [drawer, setDrawer] = useState<boolean>(false);

  const setCurrentGame = (game: SteamGame) => {
    setState(game);
  };

  const setOpenDrawer = (value: boolean) => {
    setDrawer(value);
  };

  return (
    <CurrentGameContext.Provider value={{ setCurrentGame, currentGame, drawer, setOpenDrawer }}>
      {children}
    </CurrentGameContext.Provider>
  );
}

export function useCurrentGame() {
  const context = useContext(CurrentGameContext);
  if (!context) {
    throw new Error(' must be used within a Provider');
  }
  return context;
}
