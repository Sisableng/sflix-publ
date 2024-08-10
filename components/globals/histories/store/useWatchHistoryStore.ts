import { ConsumetMediaType, Movie, TVShow } from "@/types/flixhq";
import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WatchHistoryBase {
  lastWatchedAt: number;
  runtime: number;
  currentTime: number;
  mediaType: ConsumetMediaType;
}

export interface MovieWatchHistory extends Movie, WatchHistoryBase {
  mediaType: ConsumetMediaType.Movie;
}

export interface TVShowWatchHistory extends TVShow, WatchHistoryBase {
  mediaType: ConsumetMediaType.TV;
  seasonNumber: number;
  episodeNumber: number;
}

export type WatchHistory = MovieWatchHistory | TVShowWatchHistory;

export type WatchHistoryState = {
  histories: WatchHistory[];
};

export type WatchHistoryActions = {
  addOrUpdateHistory: (
    mediaInfo: Movie | TVShow,
    currentTime: number,
    runtime: number,
    mediaType: ConsumetMediaType,
    seasonNumber?: number,
    episodeNumber?: number,
  ) => void;
  getHistory: (movieId: string) => WatchHistory | undefined;
  removeHistory: (movieId: string) => void;
};

export type WatchHistoryStore = WatchHistoryState & WatchHistoryActions;

export const initWatchHistoryStore = (): WatchHistoryState => {
  return { histories: [] };
};

export const defaultInitState: WatchHistoryState = {
  histories: [],
};

export const createWatchHistoryStore = (
  initState: WatchHistoryState = defaultInitState,
) => {
  return createStore<WatchHistoryStore>()(
    persist(
      (set, get) => ({
        ...initState,
        addOrUpdateHistory: (
          mediaInfo: Movie | TVShow,
          currentTime: number,
          runtime: number,
          mediaType: ConsumetMediaType,
          seasonNumber?: number,
          episodeNumber?: number,
        ) =>
          set((state) => {
            const now = Date.now();
            const existingIndex = state.histories.findIndex(
              (h) => h.id === mediaInfo.id && h.mediaType === mediaType,
            );

            const newHistory: WatchHistory =
              mediaType === ConsumetMediaType.Movie
                ? {
                    ...(mediaInfo as Movie),
                    lastWatchedAt: now,
                    runtime,
                    currentTime,
                    mediaType: ConsumetMediaType.Movie,
                  }
                : {
                    ...(mediaInfo as TVShow),
                    lastWatchedAt: now,
                    runtime,
                    currentTime,
                    mediaType: ConsumetMediaType.TV,
                    seasonNumber: Number(seasonNumber),
                    episodeNumber: Number(episodeNumber),
                  };

            if (existingIndex > -1) {
              // Update existing history
              const updatedHistories = [...state.histories];
              updatedHistories[existingIndex] = newHistory;
              // Move updated history to the front
              updatedHistories.unshift(
                updatedHistories.splice(existingIndex, 1)[0],
              );
              return { histories: updatedHistories };
            } else {
              // Add new history
              return {
                histories: [
                  newHistory,
                  ...state.histories.slice(0, 99), // Keep only last 100 items
                ],
              };
            }
          }),
        getHistory: (movieId) => get().histories.find((h) => h.id === movieId),
        removeHistory: (movieId) =>
          set((state) => ({
            histories: state.histories.filter((h) => h.id !== movieId),
          })),
      }),
      {
        name: "watch-history-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
