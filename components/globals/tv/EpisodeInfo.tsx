"use client";

import React from "react";
import { usePlayerStore } from "../player/store/usePlayer";
import { Dot } from "lucide-react";

interface EpisodeInfoProps {
  movieId: string;
}

export default function EpisodeInfo({ movieId }: EpisodeInfoProps) {
  const { id, season, episode } = usePlayerStore();

  if ((!id && !season && !episode) || (id && id !== movieId)) return null;

  return (
    <div className="container flex items-center gap-2 text-sm text-muted-foreground">
      <p>{`Season ${season !== 0 ? season : 1}`}</p>
      <Dot />
      <p>{`Episode ${episode !== 0 ? episode : 1}`}</p>
    </div>
  );
}
