"use client";

import React, { FC } from "react";
import dynamic from "next/dynamic";
import MovieCardSkeleton from "./skeleton/MovieCardSkeleton";
import { getGenres } from "@/lib/data/actions";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ConsumetMediaType, Movie, TVShow } from "@/types/flixhq";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const MovieCard = dynamic(() => import("./movies/MovieCard"), {
  ssr: false,
  loading: () => <MovieCardSkeleton />,
});

interface ListTrendingProps {
  data: any[];
}

const ListTrending = ({ data }: ListTrendingProps) => {
  const [filteredData, setFilteredData] = React.useState<Movie[] | TVShow[]>(
    data.filter((item: Movie) => item.type === ConsumetMediaType.Movie),
  );
  const [filterActive, setFilterActive] = React.useState<"movie" | "series">(
    "movie",
  );

  const genres = getGenres();

  const handleFilter = (filter: "movie" | "series") => {
    if (filter === "movie") {
      setFilterActive("movie");
      setFilteredData(
        data.filter((item: Movie) => item.type === ConsumetMediaType.Movie),
      );
    } else {
      setFilterActive("series");
      setFilteredData(
        data.filter((item: Movie) => item.type === ConsumetMediaType.TV),
      );
    }
  };

  // return <pre>{JSON.stringify(data, null, 2)}</pre>;
  return (
    <section className="container space-y-8">
      <div className="flex items-center gap-4">
        <h3>Trending</h3>
        <Separator className="max-sm:flex-1 md:w-20" />
        <div className="flex items-center gap-2">
          <Button
            variant={filterActive === "movie" ? "default" : "outline"}
            size={"sm"}
            onClick={() => handleFilter("movie")}
          >
            Movie
          </Button>
          <Button
            variant={filterActive === "series" ? "default" : "outline"}
            size={"sm"}
            onClick={() => handleFilter("series")}
          >
            Series
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-20 md:grid-cols-3 md:gap-10 xl:grid-cols-4">
        <div className="grid gap-4 gap-y-10 max-sm:grid-cols-3 max-[510px]:grid-cols-2 max-[360px]:grid-cols-1 sm:grid-cols-3 md:col-span-2 md:grid-cols-2 lg:grid-cols-3 xl:col-span-3 xl:grid-cols-4">
          {filteredData.map((item) => (
            <MovieCard
              movie={item}
              key={item.id}
              classNames={{
                container: "max-sm:w-full",
              }}
            />
          ))}
        </div>
        <Separator className="block md:hidden" />
        <div className="space-y-8">
          <h3>Genres</h3>

          <div className="flex flex-wrap items-center gap-3">
            {genres &&
              genres.map((genre) => (
                <Link key={genre.id} href={`/genre/${genre.id}`}>
                  <Badge
                    variant={"secondary"}
                    className="hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {genre.title}
                  </Badge>
                </Link>
              ))}
          </div>
        </div>
        <Separator className="block md:hidden" />
      </div>
    </section>
  );
};

export default ListTrending;
