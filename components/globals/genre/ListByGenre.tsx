"use client";
import React from "react";
import { useInfiniteByGenre } from "./hooks/useInfiniteByGenre";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import MovieCardSkeleton from "../skeleton/MovieCardSkeleton";
const MovieCard = dynamic(() => import("../movies/MovieCard"), {
  ssr: false,
  loading: () => (
    <MovieCardSkeleton
      classNames={{
        container: "w-36 max-md:flex-auto",
        imageContainer: "max-sm:h-52 sm:h-64",
      }}
    />
  ),
});

export default function ListByGenre() {
  const params = useParams();
  const query = String(params.genreId);
  const { data, error, isLoading, isLoadingMore, isReachingEnd, loadMore } =
    useInfiniteByGenre({ query });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-8">
        {isLoading && data.length === 0
          ? [...Array(5)].map((_, idx) => (
              <MovieCardSkeleton
                key={`movie-card-skele-${idx}`}
                classNames={{
                  container: "w-36 max-md:flex-auto",
                  imageContainer: "max-sm:h-52 sm:h-64",
                }}
              />
            ))
          : data.map((item) => (
              <MovieCard
                key={item.id}
                movie={item}
                classNames={{
                  container: "w-36 max-md:flex-auto",
                  imageContainer: "max-sm:h-52 sm:h-64",
                }}
              />
            ))}
      </div>
      {(!isLoading || !isReachingEnd) && (
        <div className="flex justify-center">
          <Button
            variant={"outline"}
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
