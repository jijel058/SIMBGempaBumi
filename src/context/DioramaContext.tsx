import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TimeOfDay = 'day' | 'dusk';

export interface NavIntent {
  mapMode?: '2d' | '3d';
  simTab?: 'city-rupture' | 'globe' | 'scenarios';
  nonce: number;
}

interface DioramaContextType {
  magnitude: number;
  setMagnitude: (m: number) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (t: TimeOfDay) => void;
  quakeNonce: number;
  triggerQuake: () => void;
  intent: NavIntent;
  setIntent: (i: Omit<NavIntent, 'nonce'>) => void;
}

const DioramaContext = createContext<DioramaContextType | undefined>(undefined);

export const DioramaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [magnitude, setMagnitude] = useState<number>(5.6);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [quakeNonce, setQuakeNonce] = useState<number>(0);
  const [intent, setIntentState] = useState<NavIntent>({ nonce: 0 });

  const triggerQuake = useCallback(() => setQuakeNonce(n => n + 1), []);
  const setIntent = useCallback(
    (i: Omit<NavIntent, 'nonce'>) => setIntentState(prev => ({ ...i, nonce: prev.nonce + 1 })),
    []
  );

  return (
    <DioramaContext.Provider
      value={{ magnitude, setMagnitude, timeOfDay, setTimeOfDay, quakeNonce, triggerQuake, intent, setIntent }}
    >
      {children}
    </DioramaContext.Provider>
  );
};

export const useDiorama = (): DioramaContextType => {
  const ctx = useContext(DioramaContext);
  if (!ctx) throw new Error('useDiorama must be used within DioramaProvider');
  return ctx;
};

