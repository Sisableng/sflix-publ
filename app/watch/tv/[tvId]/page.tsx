import { Label } from "@/components/ui/label";
import { MovieDetail } from "@/types/flixhq";
import { DotIcon } from "lucide-react";
import React, { cache, FC } from "react";
import parse from "html-react-parser";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Metadata, ResolvingMetadata } from "next/types";
import { getCountry, slugify, truncate } from "@/lib/utils";
import dynamic from "next/dynamic";
import MovieCardSkeleton from "@/components/globals/skeleton/MovieCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getCountries } from "@/lib/data/actions";

const Player = dynamic(() => import("@/components/globals/player/Player"), {
  ssr: false,
  loading: () => <div className="h-96 w-full md:h-[34rem]"></div>,
});

const EpisodeInfo = dynamic(
  () => import("@/components/globals/tv/EpisodeInfo"),
  {
    ssr: false,
  },
);

const EpisodeCard = dynamic(
  () => import("@/components/globals/tv/EpisodeCard"),
  {
    ssr: false,
    loading: () => <div className="h-40 w-full">loading...</div>,
  },
);

const ListEpisodes = dynamic(
  () => import("@/components/globals/tv/ListEpisodes"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-32" />,
  },
);

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
    `${base_url}/movies/flixhq/info?id=tv/watch-${movieId}`,
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

interface WatchTvPageProps {
  params: {
    tvId: string;
  };
}

export async function generateMetadata(
  { params }: WatchTvPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const tvId = params.tvId;

  // fetch data
  const tv = await getMovieInfo(tvId);

  return {
    title: tv.title,
    description: truncate(tv.description, 150),
    openGraph: {
      title: tv.title,
      description: truncate(tv.description, 150),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/watch/${tv.id.replace("watch-", "")}`,
      siteName: "SFlix",
      images: [
        {
          url: tv.cover, // Must be an absolute URL
          width: 800,
          height: 600,
        },
        {
          url: tv.cover, // Must be an absolute URL
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tv.title,
      description: truncate(tv.description, 150),
      images: [tv.cover], // Must be an absolute URL
    },
  };
}

const WatchTvPage = async ({ params }: WatchTvPageProps) => {
  const tv = await getMovieInfo(params.tvId);
  const countries = getCountries();

  const country = getCountry(countries, tv.country);

  const releaseDate: string | undefined =
    tv.releaseDate &&
    new Date(tv.releaseDate).toLocaleDateString("id", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const lastEpisode = tv.episodes[tv.episodes.length - 1];

  if (!tv) {
    notFound();
  }

  return (
    <div className="space-y-20">
      {/* Player */}
      <section className="space-y-6">
        <Player
          data={{
            cover: tv.cover,
            episodes: tv.episodes,
            mediaInfo: {
              id: tv.id,
              title: tv.title,
              type: tv.type,
              duration: tv.duration,
              releaseDate: tv.releaseDate,
              image: tv.image,
              url: tv.url,
            },
          }}
        />

        <EpisodeInfo movieId={tv.id} />
      </section>

      {/* Movie Info */}
      <section className="container space-y-10">
        <div className="space-y-2">
          <p>{tv.type}</p>
          <h2>{tv.title}</h2>
          <div className="flex items-center gap-1 text-sm">
            {releaseDate && (
              <p className="text-muted-foreground">{releaseDate}</p>
            )}
            <DotIcon />
            {tv.rating && (
              <>
                <p>{tv.rating}</p>
                <DotIcon />
              </>
            )}
            <p>{tv.duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 max-sm:divide-y md:grid-cols-3">
          <div className="space-y-10 max-sm:pb-10 md:col-span-2 md:pr-16">
            <Separator />

            {/* Episode Lists */}
            <div className="space-y-6">
              <h3>Latest Episode</h3>
              <EpisodeCard
                movieId={tv.id}
                episode={lastEpisode}
                isActive={false}
              />
              <ListEpisodes movieId={tv.id} episodes={tv.episodes} />
            </div>

            <Separator />

            <ScrollArea>
              <div
                className={
                  "prose prose-sm line-clamp-3 max-h-60 max-w-full dark:prose-invert"
                }
              >
                {parse(tv.description)}
              </div>
            </ScrollArea>

            <div className="flex flex-wrap items-center gap-10">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Production</Label>
                <p>{tv.production}</p>
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

            {tv.casts.length > 0 && (
              <div className="flex flex-col gap-5">
                <Label className="text-muted-foreground">Casts</Label>
                <ScrollArea className="whitespace-nowrap">
                  <div className={"flex w-max gap-2 pb-3"}>
                    {tv.casts.map((cast) => (
                      <Badge key={cast} variant={"outline"}>
                        {cast}
                      </Badge>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
          </div>

          <div className="space-y-10 max-sm:pt-10 md:pl-16">
            <div className="flex flex-col gap-5">
              <Label className="text-muted-foreground">Genres</Label>
              <div className={"flex w-max flex-wrap gap-2 pb-3"}>
                {tv.genres.map((genre) => (
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
                {tv.tags.map((tag) => (
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

        {tv && <MovieSlider data={tv.recommendations} />}
      </section>
    </div>
  );
};

export default WatchTvPage;
