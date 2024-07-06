'use client';
import { SteamGameInfo } from '@/types/response-schemas/steam-game-info';
import { createContext, useContext, useState } from 'react';

interface GameInfoContext {
  gameInfo: SteamGameInfo;
  setGameInfo: (game: SteamGameInfo) => void;
}

const GameInfoContext = createContext<GameInfoContext | undefined>(undefined);

export function GameInfoProvider({ children }: { children: React.ReactNode }) {
  const [gameInfo, setState] = useState<SteamGameInfo>({} as SteamGameInfo);

  const setGameInfo = (game: any) => {
    setState(game);
  };

  return <GameInfoContext.Provider value={{ gameInfo, setGameInfo }}>{children}</GameInfoContext.Provider>;
}

export function useGameInfo() {
  const context = useContext(GameInfoContext);
  if (!context) {
    throw new Error(' must be used within a Provider');
  }
  return context;
}
