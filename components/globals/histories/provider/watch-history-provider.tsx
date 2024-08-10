"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  createWatchHistoryStore,
  initWatchHistoryStore,
  WatchHistoryStore,
} from "../store/useWatchHistoryStore";

export type CounterStoreApi = ReturnType<typeof createWatchHistoryStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
);

export interface WatchHistoryStoreProviderProps {
  children: ReactNode;
}

export const WatchHistoryStoreProvider = ({
  children,
}: WatchHistoryStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createWatchHistoryStore(initWatchHistoryStore());
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
};

export const useWatchHistoryStore = <T,>(
  selector: (store: WatchHistoryStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(
      `useWatchHistoryStore must be used within WatchHistoryStoreProvider`,
    );
  }

  return useStore(counterStoreContext, selector);
};
