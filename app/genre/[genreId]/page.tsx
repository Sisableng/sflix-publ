import { getGenres } from "@/lib/data/actions";
import { Genre } from "@/types/flixhq";
import React, { FC } from "react";
import dynamic from "next/dynamic";
import MovieCardSkeleton from "@/components/globals/skeleton/MovieCardSkeleton";

const ListByGenre = dynamic(
  () => import("@/components/globals/genre/ListByGenre"),
  {
    ssr: false,
    loading: () => {
      return (
        <div className="flex flex-wrap items-center gap-8">
          {[...Array(4)].map((_, idx) => (
            <MovieCardSkeleton
              key={`movie-card-skele-${idx}`}
              classNames={{
                container: "w-36 max-md:flex-auto",
                imageContainer: "max-sm:h-52 sm:h-64",
              }}
            />
          ))}
        </div>
      );
    },
  },
);

interface ByGenrePageProps {
  params: {
    genreId: string;
  };
}

const ByGenrePage = async ({ params }: ByGenrePageProps) => {
  const genres: Genre[] = getGenres();
  const genre = genres.find((genre) => genre.id === params.genreId);
  return (
    <div className="container mt-16 min-h-screen space-y-10 py-10">
      <h2>{genre?.title ?? "Unknown"}</h2>

      <ListByGenre />
    </div>
  );
};

export default ByGenrePage;
