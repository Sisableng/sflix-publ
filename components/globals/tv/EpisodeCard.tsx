"use client";
import { cn } from "@/lib/utils";
import { Episode } from "@/types/flixhq";
import React from "react";
import { usePlayerStore } from "../player/store/usePlayer";
import clsx from "clsx";

interface EpisodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  episode: Episode;
  movieId: string;
  isActive: boolean;
  onActions?: () => void;
}

const EpisodeCard = React.forwardRef<HTMLDivElement, EpisodeCardProps>(
  ({ episode, movieId, isActive, onActions, className, ...props }, ref) => {
    const { setSeason, setEpisode } = usePlayerStore();

    const handleClick = React.useCallback(() => {
      setSeason(Number(episode.season));
      setEpisode(Number(episode.number));

      onActions && onActions();
    }, [episode, setSeason, setEpisode, onActions]);

    return (
      <div
        ref={ref}
        className={cn(
          "group flex items-center gap-8",
          className,
          isActive && "pointer-events-none opacity-40",
        )}
        {...props}
      >
        <div
          className={clsx(
            "grid h-20 w-20 cursor-pointer place-content-center rounded-md bg-muted transition-colors ease-in-out",
            isActive
              ? "bg-primary text-primary-foreground"
              : "group-hover:bg-primary group-hover:text-primary-foreground",
          )}
          onClick={handleClick}
        >
          <h3>{episode.number}</h3>
        </div>
        <div className="flex-1 cursor-pointer space-y-1" onClick={handleClick}>
          <p
            className={clsx(
              "line-clamp-1 font-semibold transition-colors ease-in-out",
              isActive ? "text-primary" : "group-hover:text-primary",
            )}
          >
            {episode.title}
          </p>
          <p>{`Season: ${episode.season}`}</p>
        </div>
      </div>
    );
  },
);
EpisodeCard.displayName = "EpisodeCard";

export default EpisodeCard;
