import { ProviderServer, Stream } from "@/types/flixhq";
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";

interface UsePlayerProps {
  id: string | null;
  setId: (id: string | null) => void;
  season: number | null;
  setSeason: (season: number | null) => void;
  episode: number | null;
  setEpisode: (episode: number | null) => void;
  reset: () => void;
}

export const usePlayerStore = create<UsePlayerProps>()(
  persist(
    subscribeWithSelector((set) => ({
      id: null,
      setId: (id: string | null) => set({ id }),
      season: null,
      setSeason: (season) => set({ season }),
      episode: null,
      setEpisode: (episode) => set({ episode }),
      reset: () => {
        set({
          season: null,
          episode: null,
        });
        // Clear the specific items from sessionStorage
        sessionStorage.removeItem("player-storage");
      },
    })),
    {
      name: "player-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        id: state.id,
        season: state.season,
        episode: state.episode,
      }),
    },
  ),
);
