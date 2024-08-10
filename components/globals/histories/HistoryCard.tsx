"use client";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { WatchHistory } from "./store/useWatchHistoryStore";
import { ConsumetMediaType } from "@/types/flixhq";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { useWatchHistoryStore } from "./provider/watch-history-provider";
import { usePlayerStore } from "../player/store/usePlayer";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import clsx from "clsx";

interface HistoryCardProps {
  data: WatchHistory;
}

const HistoryCard = ({ data }: HistoryCardProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  let url: string = `/watch/${data.id.replace("watch-", "")}`;
  const percentage = (data.currentTime / data.runtime) * 100;

  const removeHistory = useWatchHistoryStore((state) => state.removeHistory);
  const { setId, setSeason, setEpisode } = usePlayerStore();

  const handleRemove = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    removeHistory(data.id);
    toast.success("Removed!");
    setIsLoading(false);
  };

  const handleClick = React.useCallback(() => {
    setId(data.id);

    if (data.mediaType === ConsumetMediaType.TV) {
      setSeason(data.seasonNumber);
      setEpisode(data.episodeNumber);
    }
  }, [data, setSeason, setEpisode, setId]);

  if (data.mediaType === ConsumetMediaType.TV) {
    return (
      <div
        className={clsx(
          "group flex aspect-[27/40] w-40 flex-col gap-4 transition-opacity ease-in-out md:w-48",
          isLoading ? "pointer-events-none opacity-50" : "opacity-100",
        )}
      >
        <Link href={url} onClick={handleClick}>
          <div className="relative h-60 w-full overflow-hidden rounded-md md:h-72">
            <Image
              src={data.image}
              width={300}
              height={300}
              alt={data.image}
              className="h-full w-full object-cover transition-transform ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 flex h-4/6 flex-col justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs">
              <div className="flex items-center justify-between">
                {data.seasonNumber ? (
                  <p>{`Season ${data.seasonNumber}`}</p>
                ) : (
                  <p className="text-muted-foreground">...</p>
                )}
                {data.episodeNumber ? (
                  <p>{`Episode ${data.episodeNumber}`}</p>
                ) : (
                  <p className="text-muted-foreground">...</p>
                )}
              </div>
              <Progress value={percentage} />
            </div>

            <div className="absolute left-2 top-2 text-xs">
              <Badge>{data.type}</Badge>
            </div>
          </div>
        </Link>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="flex-1 truncate transition-colors ease-in-out group-hover:text-primary">
              <Link href={url} onClick={handleClick}>
                {data.title}
              </Link>
            </p>

            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={handleRemove}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircleIcon
                  size={16}
                  className="animate-spin text-primary"
                />
              ) : (
                <XIcon size={16} />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Last Watched</p>
            <p>
              {formatDistanceToNow(data.lastWatchedAt, {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex aspect-[27/40] w-40 flex-col gap-4 md:w-48">
      <Link href={url}>
        <div className="relative h-60 w-full overflow-hidden rounded-md md:h-72">
          <Image
            src={data.image}
            width={300}
            height={300}
            alt={data.image}
            className="h-full w-full object-cover transition-transform ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs">
            <div className="flex items-center justify-between">
              {data.releaseDate ? (
                <p>{new Date(data.releaseDate).getFullYear()}</p>
              ) : (
                <p className="text-muted-foreground">...</p>
              )}
              {data.duration && data.duration.length > 0 ? (
                <p>
                  {data.duration.includes("min")
                    ? data.duration
                    : data.duration + " min"}
                </p>
              ) : (
                <p className="text-muted-foreground">...</p>
              )}
            </div>
            <Progress value={percentage} />
          </div>

          <div className="absolute left-2 top-2 text-xs">
            <Badge>{data.type}</Badge>
          </div>
        </div>
      </Link>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <p className="flex-1 truncate transition-colors ease-in-out group-hover:text-primary">
            <Link href={url}>{data.title}</Link>
          </p>

          <Button size={"icon"} variant={"ghost"} onClick={handleRemove}>
            <XIcon size={16} />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Last Watched</p>
          <p>
            {formatDistanceToNow(data.lastWatchedAt, {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
