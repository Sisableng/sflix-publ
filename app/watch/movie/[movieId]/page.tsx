import { Label } from "@/components/ui/label";
import { MovieDetail } from "@/types/flixhq";
import { DotIcon } from "lucide-react";
import React, { cache, FC } from "react";
import parse from "html-react-parser";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { getCountry, slugify, truncate } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next/types";
import dynamic from "next/dynamic";
import MovieCardSkeleton from "@/components/globals/skeleton/MovieCardSkeleton";
import { getCountries } from "@/lib/data/actions";
import Link from "next/link";

const Player = dynamic(() => import("@/components/globals/player/Player"), {
  ssr: false,
  loading: () => <div className="h-96 w-full md:h-[34rem]"></div>,
});

const MovieSlider = dynamic(() => import("@/components/globals/MovieSlider"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-wrap items-center gap-4">
      {[...Array(5)].map((_, idx) => (
        <MovieCardSkeleton key={`movie-card-skele-${idx}`} />
      ))}
    </div>
  ),
});

export const revalidate = 3600;

const getMovieInfo = cache(async (movieId: string): Promise<MovieDetail> => {
  const base_url = process.env.CONSUMET_API;
  const res = await fetch(
    `${base_url}/movies/flixhq/info?id=movie/watch-${movieId}`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();

  // const file = await fs.readFile(
  //   process.cwd() + "/lib/dummy/info.json",
  //   "utf8",
  // );
  // const data = JSON.parse(file);

  // return data;
});

interface WatchMoviePageProps {
  params: {
    movieId: string;
  };
}

export async function generateMetadata(
  { params }: WatchMoviePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const movieId = params.movieId;

  // fetch data
  const movie = await getMovieInfo(movieId);

  return {
    title: movie.title,
    description: truncate(movie.description, 150),
    openGraph: {
      title: movie.title,
      description: truncate(movie.description, 150),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/watch/${movie.id.replace("watch-", "")}`,
      siteName: "SFlix",
      images: [
        {
          url: movie.cover, // Must be an absolute URL
          width: 800,
          height: 600,
        },
        {
          url: movie.cover, // Must be an absolute URL
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description: truncate(movie.description, 150),
      images: [movie.cover], // Must be an absolute URL
    },
  };
}

const WatchMoviePage = async ({ params }: WatchMoviePageProps) => {
  const movie = await getMovieInfo(params.movieId);
  const countries = getCountries();

  const country = getCountry(countries, movie.country);

  const releaseDate: string | undefined =
    movie.releaseDate &&
    new Date(movie.releaseDate).toLocaleDateString("id", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!movie) {
    notFound();
  }

  return (
    <div className="space-y-20">
      {/* Player */}
      <section>
        <Player
          data={{
            cover: movie.cover,
            episodes: movie.episodes,
            mediaInfo: {
              id: movie.id,
              title: movie.title,
              type: movie.type,
              duration: movie.duration,
              releaseDate: movie.releaseDate,
              image: movie.image,
              url: movie.url,
            },
          }}
        />
      </section>

      {/* Movie Info */}
      <section className="container space-y-10">
        <div className="space-y-2">
          <p>{movie.type}</p>
          <h2>{movie.title}</h2>
          <div className="flex items-center gap-1 text-sm">
            {releaseDate && (
              <p className="text-muted-foreground">{releaseDate}</p>
            )}
            <DotIcon />
            {movie.rating && (
              <>
                <p>{movie.rating}</p>
                <DotIcon />
              </>
            )}
            <p>{movie.duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 max-sm:divide-y md:grid-cols-3 md:divide-x">
          <div className="space-y-10 md:col-span-2 md:pr-10">
            <ScrollArea>
              <div
                className={
                  "prose prose-sm line-clamp-3 max-h-60 max-w-full dark:prose-invert"
                }
              >
                {parse(movie.description)}
              </div>
            </ScrollArea>

            <div className="flex flex-wrap items-center gap-10">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Production</Label>
                <p>{movie.production}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Country</Label>
                <p className="transition-colors ease-in-out hover:text-primary hover:underline">
                  <Link href={`/country/${country?.code ?? "undefined"}`}>
                    {country?.title ?? "Unknown"}
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <Label className="text-muted-foreground">Casts</Label>
              <ScrollArea className="whitespace-nowrap">
                <div className={"flex w-max gap-2 pb-3"}>
                  {movie.casts.map((cast) => (
                    <Badge key={cast} variant={"outline"}>
                      {cast}
                    </Badge>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-10 max-sm:pt-10 md:pl-10">
            <div className="flex flex-col gap-5">
              <Label className="text-muted-foreground">Genres</Label>
              <div className={"flex w-max flex-wrap gap-2 pb-3"}>
                {movie.genres.map((genre) => (
                  <Link key={genre} href={`/genre/${slugify(genre)}`}>
                    <Badge
                      variant={"secondary"}
                      className="hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {genre}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <Label className="text-muted-foreground">Tags</Label>
              <div className={"space-y-1"}>
                {movie.tags.map((tag) => (
                  <p key={tag} className="text-sm text-muted-foreground">
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recomendations */}
      <section className="container space-y-8">
        <h3>Recomendations</h3>

        {movie && <MovieSlider data={movie.recommendations} />}
      </section>
    </div>
  );
};

export default WatchMoviePage;
