"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Episode } from "@/types/flixhq";
import React, { FC } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePlayerStore } from "../player/store/usePlayer";
import dynamic from "next/dynamic";

const EpisodeCard = dynamic(() => import("./EpisodeCard"), {
  ssr: false,
});

interface ListEpisodesProps {
  movieId: string;
  episodes: Episode[];
}

interface GroupedEpisodes {
  [season: number]: Episode[];
}

function groupEpisodesBySeason(episodes: Episode[]): GroupedEpisodes {
  return episodes.reduce((acc: GroupedEpisodes, episode) => {
    const season = episode.season ?? 0; // Use 0 for episodes without a season
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {});
}

const ListEpisodes = ({ movieId, episodes }: ListEpisodesProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>("");
  const [selectedSeason, setSelectedSeason] = React.useState<
    number | undefined
  >(undefined);
  const [shouldScrollToTop, setShouldScrollToTop] =
    React.useState<boolean>(false);

  const {
    id,
    season: currentSeason,
    episode: currentEpisode,
  } = usePlayerStore();

  const filteredEpisodes = React.useMemo(() => {
    let initialEpisodes = episodes;

    if (query) {
      return initialEpisodes.filter((episode) =>
        episode.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (selectedSeason) {
      return initialEpisodes.filter(
        (episode) => episode.season === selectedSeason,
      );
    }

    return initialEpisodes.filter((episode) => Number(episode.season) === 1);
  }, [episodes, selectedSeason, query]);

  const groupedEpisodes = groupEpisodesBySeason(filteredEpisodes);
  const uniqueSeasons = Array.from(
    new Set(
      episodes
        .map((episode) => episode.season)
        .filter((season) => season !== undefined),
    ),
  );

  const handleSheetClose = React.useCallback(() => {
    setIsOpen(false);
    setShouldScrollToTop(true);
  }, []);

  React.useEffect(() => {
    if (shouldScrollToTop && !isOpen) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setShouldScrollToTop(false);
      }, 300); // Adjust this delay if needed to match your sheet closing animation
    }
  }, [shouldScrollToTop, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>See All</Button>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col gap-8"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>List Episodes</SheetTitle>
        </SheetHeader>

        <div className="flex items-center gap-2">
          <div>
            <Select
              defaultValue={
                id === movieId && currentSeason
                  ? String(currentSeason)
                  : selectedSeason
                    ? String(selectedSeason)
                    : undefined
              }
              onValueChange={(value) => setSelectedSeason(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                {uniqueSeasons.map((season) => (
                  <SelectItem
                    key={`season-${season}`}
                    value={String(season) ?? ""}
                  >{`Season ${season}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Episode..."
              className="w-full"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {Object.entries(groupedEpisodes).map(([season, episodes], idx) => (
              <React.Fragment key={season}>
                <div key={season} className="space-y-2">
                  <h4>{season === "0" ? "Specials" : `Season ${season}`}</h4>
                  {episodes.map((episode: Episode) => (
                    <EpisodeCard
                      key={episode.id}
                      movieId={movieId}
                      episode={episode}
                      isActive={
                        id === movieId &&
                        currentSeason === Number(episode.season) &&
                        currentEpisode === Number(episode.number)
                      }
                      onActions={handleSheetClose}
                    />
                  ))}
                </div>
                {idx !== Object.entries(groupedEpisodes).length - 1 && (
                  <Separator />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ListEpisodes;
