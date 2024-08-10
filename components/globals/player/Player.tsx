"use client";
import {
  ConsumetMediaType,
  Episode,
  Movie,
  ProviderServer,
  TVShow,
} from "@/types/flixhq";
import Image from "next/image";
import React, { cache, FC } from "react";
import Artplayer from "./art/ArtPlayer";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, Play } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useArtPlayer } from "./art/store/useArtPlayerStore";
import { useWatchHistoryStore } from "../histories/provider/watch-history-provider";
import { usePlayerStore } from "./store/usePlayer";
import { Stream } from "@/types/stream";

// Fetch and caching server data from API
const fetchServer = cache(
  async (options: {
    tvId: string;
    episode: Episode;
  }): Promise<ProviderServer[]> => {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(
      `${base_url}/api/movies/server?episodeId=${options.episode.id}&mediaId=tv/watch-${options.tvId}`,
      {
        next: {
          revalidate: 3600,
          tags: ["server"],
        },
      },
    );

    // Testing
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/test/server`,
    // );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  },
);

type MediaInfo = Movie | TVShow;

interface PlayerProps {
  data: {
    cover: string;
    episodes: Episode[];
    mediaInfo: MediaInfo;
  };
}

const Player = ({ data }: PlayerProps) => {
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<Stream | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);

  const { id, setId, season, setSeason, episode, setEpisode } =
    usePlayerStore();

  const { artState } = useArtPlayer();
  const { addOrUpdateHistory, getHistory } = useWatchHistoryStore(
    (state) => state,
  );

  // Get the source from existing server
  const getSource = React.useCallback(
    async (episodeId: string, servers: ProviderServer[]): Promise<void> => {
      setIsLoading(true);
      if (!servers) {
        toast.error("Server Not Found!");
        setIsLoading(false);
        return;
      }

      setSource(null);
      const mediaId = data.mediaInfo.id;

      for (const server of servers) {
        setLoadingText(`Fetching from ${server.name}`);

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/movies/source?episodeId=${episodeId ?? data.episodes[0].id}&mediaId=${mediaId}&server=${server.name}`,
          );

          // Testing
          // const response = await fetch(
          //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/test/source?server=${server.name}`,
          //   {
          //     next: {
          //       revalidate: 3600,
          //     },
          //   },
          // );

          if (!response.ok) {
            toast.error(`Error fetching from ${server.name}`);
          }

          if (response.ok) {
            const data: Stream = await response.json();

            const autoQuality = data.sources.find((s) => s.quality === "auto");

            if (autoQuality) {
              setUrl(autoQuality.url);
            } else {
              setUrl(data.sources[0].url);
            }

            setSource(data);
            setShowPlayer(true);
            setLoadingText(null);
            break;
          }
        } catch (error) {
          toast.error(`Error fetching from ${server.name}`);
          console.error(`Error fetching from ${server.name}:`, error);
          setLoadingText(`Error fetching from ${server.name}`);
        }
      }

      setIsLoading(false);
    },
    [
      data.episodes,
      data.mediaInfo,
      setSource,
      setShowPlayer,
      setLoadingText,
      setIsLoading,
    ],
  );

  // Get the lists of server by episode
  const getServers = React.useCallback(
    async (episode: number): Promise<void> => {
      setShowPlayer(false);
      setIsLoading(true);
      setLoadingText("Fetching Servers");

      try {
        const findEpisode = data.episodes.find(
          (ep) => Number(ep.number) === Number(episode ?? 1),
        );

        if (findEpisode) {
          const fetchedServers = await fetchServer({
            tvId: data.mediaInfo.id,
            episode: findEpisode ?? data.episodes[0],
          });

          if (fetchedServers) {
            // toast.success("Servers fetched successfully");
            getSource(findEpisode.id, fetchedServers);
          }
        } else {
          const fetchedServers = await fetchServer({
            tvId: data.mediaInfo.id,
            episode: data.episodes[0],
          });

          getSource(data.episodes[0].id, fetchedServers);
        }
      } catch (error) {
        toast.error("Error fetching servers");
        setLoadingText(null);
        setIsLoading(false);
      }
    },
    [
      data.episodes,
      data.mediaInfo.id,
      setShowPlayer,
      setIsLoading,
      setLoadingText,
      getSource,
    ],
  );

  React.useEffect(() => {
    // Listen for changed episode
    usePlayerStore.subscribe(
      (state) => state.episode,
      (episode) => {
        // Function to be triggered when episode changes
        console.log(`Episode changed to: ${episode}`);
        // Call your function here
        getServers(episode ?? 1);
      },
    );
  }, [getServers]);

  // control Artplayer Instance
  React.useEffect(() => {
    if (!showPlayer || !artState || !source) return;
    artState.setting.update({
      name: "subtitle",
      selector: [
        {
          html: "Off",
          url: "",
        },
        ...source.subtitles.map((sub) => ({
          html: sub.lang,
          url: sub.url,
        })),
      ],
    });

    artState.on("ready", () => {
      if (data.mediaInfo.type === ConsumetMediaType.TV && season && episode) {
        artState.notice.show = `S${season}E${episode}`;
      }

      const findSubtitle = source.subtitles.find((sub) =>
        sub.lang.toLowerCase().includes("indo"),
      );

      if (findSubtitle) {
        artState.subtitle.url = findSubtitle.url;
      } else {
        const findEnglishSubtitle = source.subtitles.find((sub) =>
          sub.lang.toLowerCase().includes("eng"),
        );
        if (findEnglishSubtitle) {
          artState.subtitle.url = findEnglishSubtitle.url;
        }
      }
    });

    const mediaInfo: MediaInfo = data.mediaInfo;
    const history = getHistory(mediaInfo.id);

    if (history) {
      artState.on("ready", () => {
        if (history.mediaType === ConsumetMediaType.TV) {
          if (
            id === data.mediaInfo.id &&
            history.seasonNumber === (season ?? 1) &&
            history.episodeNumber === (episode ?? 1)
          ) {
            artState.seek = history.currentTime;
          }
        } else {
          artState.seek = history.currentTime;
        }
      });

      artState.on("restart", () => {
        artState.seek = history.currentTime;
      });
    }

    artState.on("play", () => {
      const saveInterval = setInterval(() => {
        artState.on("video:timeupdate", () => {
          if (data.mediaInfo.type === ConsumetMediaType.Movie) {
            // Movie
            addOrUpdateHistory(
              data.mediaInfo,
              artState.currentTime,
              artState.duration,
              ConsumetMediaType.Movie,
            );
          } else {
            // TV
            addOrUpdateHistory(
              data.mediaInfo,
              artState.currentTime,
              artState.duration,
              ConsumetMediaType.TV,
              Number(season ?? 1),
              Number(episode ?? 1),
            );
          }
        });
      }, 5000); // Save every 5 seconds

      return () => {
        clearInterval(saveInterval);
        if (data.mediaInfo.type === ConsumetMediaType.Movie) {
          // Movie
          addOrUpdateHistory(
            data.mediaInfo,
            artState.currentTime,
            artState.duration,
            ConsumetMediaType.Movie,
          );
        } else {
          // TV
          addOrUpdateHistory(
            data.mediaInfo,
            artState.currentTime,
            artState.duration,
            ConsumetMediaType.TV,
            Number(season ?? 1),
            Number(episode ?? 1),
          );
        }
      };
    });
  }, [
    showPlayer,
    artState,
    source,
    data,
    id,
    season,
    episode,
    addOrUpdateHistory,
    getHistory,
  ]);

  return (
    <section className={`relative h-96 w-full md:h-[34rem]`}>
      {showPlayer && url ? (
        <Artplayer
          url={url ?? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
          poster={data.cover}
        />
      ) : (
        <>
          <Image
            priority
            fill
            src={data.cover}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={data.cover}
            className={clsx(
              "h-full w-full object-cover object-top transition-opacity ease-in-out",
              isLoading ? "opacity-0" : "opacity-100",
            )}
          />

          {/* Play Button */}
          <div className="absolute inset-0 z-10 flex h-full items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <LoaderCircleIcon
                  size={40}
                  className="animate-spin text-primary"
                />
                <p className="capitalize">{loadingText}</p>
              </div>
            ) : (
              <Button
                size={"icon"}
                variant={"ghost"}
                className="h-20 w-20 rounded-full bg-primary/50 text-primary-foreground backdrop-blur hover:bg-accent/50"
                onClick={() => {
                  if (!id || id !== data.mediaInfo.id) {
                    setId(data.mediaInfo.id);
                    setSeason(1);
                    setEpisode(1);

                    // toast("Id Notfound");
                  }

                  // toast(episode ?? 1);
                  getServers(episode ?? 1);
                }}
                disabled={isLoading}
              >
                <Play size={32} />
              </Button>
            )}
          </div>

          {/* Overlay */}
          {!isLoading && (
            <div className="pointer-events-none absolute inset-x-0 -bottom-0.5 z-10 h-40 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          )}
        </>
      )}
    </section>
  );
};

export default Player;
