"use client";
import React, { FC } from "react";
import Image from "next/image";
import { Movie, TVShow } from "@/types/flixhq";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn, isMovie, isTVShow } from "@/lib/utils";

type ClassNames = {
  container?: string;
  imageContainer?: string;
  image?: string;
  imageContent?: string;
  title?: string;
};

interface MovieCardProps {
  movie: Movie | TVShow;
  classNames?: ClassNames;
}

const MovieCard = ({ movie, classNames }: MovieCardProps) => {
  let url: string = `/watch/${movie.id.replace("watch-", "")}`;
  return (
    <div
      className={cn(
        "saspect-[27/40] group flex w-40 flex-col gap-4 md:w-48",
        classNames?.container,
      )}
    >
      <Link href={url}>
        <div
          className={cn(
            "relative h-60 w-full overflow-hidden rounded-md bg-muted md:h-72",
            classNames?.imageContainer,
          )}
        >
          <Image
            src={movie.image}
            width={300}
            height={300}
            alt={movie.image}
            className={cn(
              "h-full w-full object-cover transition-transform ease-in-out group-hover:scale-110",
              classNames?.image,
            )}
          />
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex h-4/6 items-end justify-between gap-6 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs",
              classNames?.imageContent,
            )}
          >
            {isTVShow(movie) && (
              <>
                {movie.seasons ? (
                  <p>{`${movie.seasons} Seasons`}</p>
                ) : (
                  <>
                    <p className="font-semibold">{movie.season}</p>
                    <p className="font-semibold">{movie.latestEpisode}</p>
                  </>
                )}
              </>
            )}
            {isMovie(movie) && (
              <>
                {movie.releaseDate ? (
                  <p>{movie.releaseDate}</p>
                ) : (
                  <p className="text-muted-foreground">...</p>
                )}
                {movie.duration && movie.duration.length > 0 ? (
                  <p>
                    {movie.duration.includes("m")
                      ? movie.duration.replace("m", " min")
                      : movie.duration + " min"}
                  </p>
                ) : (
                  <p className="text-muted-foreground">...</p>
                )}
              </>
            )}
          </div>

          <div className="absolute left-2 top-2 text-xs">
            <Badge>{movie.type}</Badge>
          </div>
        </div>
      </Link>
      <p
        className={cn(
          "truncate transition-colors ease-in-out group-hover:text-primary",
          classNames?.title,
        )}
      >
        <Link href={url}>{movie.title}</Link>
      </p>
    </div>
  );
};

export default MovieCard;
