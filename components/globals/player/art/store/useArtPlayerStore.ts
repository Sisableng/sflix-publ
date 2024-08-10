import { create } from "zustand";
import type Artplayer from "artplayer";

interface UseArtPlayerProps {
  artState: Artplayer | null;
  setArtState: (art: Artplayer | null) => void;
}

export const useArtPlayer = create<UseArtPlayerProps>((set) => ({
  artState: null,
  setArtState: (art) => set({ artState: art }),
}));
