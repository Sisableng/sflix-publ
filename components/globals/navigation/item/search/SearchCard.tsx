import { Badge } from "@/components/ui/badge";
import { cn, isMovie, isTVShow } from "@/lib/utils";
import { Movie, TVShow } from "@/types/flixhq";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

type ClassNames = {
  container?: string;
  imageContainer?: string;
  image?: string;
  content?: string;
  title?: string;
};

interface SearchCardProps {
  item: Movie | TVShow;
  onAction?: () => void;
  classNames?: ClassNames;
}

// Type guard functions

const SearchCard = ({ item, onAction, classNames }: SearchCardProps) => {
  const url: string = `/watch/${item.id.replace("watch-", "")}`;
  return (
    <div className={cn("group flex items-center gap-8", classNames?.container)}>
      <Link href={url}>
        <div
          className={cn(
            "h-36 w-24 overflow-hidden rounded-md bg-muted",
            classNames?.imageContainer,
          )}
        >
          <Image
            src={item.image}
            width={150}
            height={150}
            alt={item.image}
            className={cn(
              "h-full w-full object-cover transition-transform ease-in-out group-hover:scale-110",
              classNames?.image,
            )}
          />
        </div>
      </Link>
      <Link href={url} className="block flex-1">
        <div className={cn("w-full space-y-2", classNames?.content)}>
          <Badge variant={"secondary"}>{item.type}</Badge>
          <p
            className={cn(
              "line-clamp-1 font-semibold transition-colors ease-in-out group-hover:text-primary md:text-lg",
              classNames?.title,
            )}
          >
            {item.title}
          </p>
          {isTVShow(item) && (
            <p className="text-sm font-semibold text-muted-foreground">
              {`${item.seasons} Seasons`}
            </p>
          )}
          {isMovie(item) && (
            <p className="text-sm font-semibold text-muted-foreground">
              {item.releaseDate && !item.releaseDate.includes("NaN")
                ? item.releaseDate
                : "Unknown"}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SearchCard;
