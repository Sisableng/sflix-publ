import HeroChatAI from "@/components/globals/ai/HeroChatAI";
import ListHistories from "@/components/globals/histories/ListHistories";
import ListTrending from "@/components/globals/ListTrending";
import MovieCardSkeleton from "@/components/globals/skeleton/MovieCardSkeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Movie, TVShow } from "@/types/flixhq";
import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cache } from "react";

const MovieSlider = dynamic(() => import("@/components/globals/MovieSlider"), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        {[...Array(5)].map((_, idx) => (
          <MovieCardSkeleton key={`movie-card-skele-${idx}`} />
        ))}
      </div>
    );
  },
});

const getTrendings = cache(
  async (): Promise<{ results: Movie[] | TVShow[] }> => {
    const base_url = process.env.CONSUMET_API;
    const res = await fetch(`${base_url}/movies/flixhq/trending`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch trending movies data");
      return { results: [] };
    }

    return res.json();
  },
);

const getKoreah = cache(async (): Promise<{ results: Movie[] }> => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${base_url}/api/movies/country?code=KR&page=1`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch movbies by Korean country");
    return { results: [] };
  }

  return res.json();
});

const getThailand = cache(async (): Promise<{ results: Movie[] }> => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${base_url}/api/movies/country?code=TH&page=1`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch movbies by Thailand country");
    return { results: [] };
  }

  return res.json();
});

const getRecentMovies = cache(async (): Promise<Movie[]> => {
  const base_url = process.env.CONSUMET_API;
  const res = await fetch(`${base_url}/movies/flixhq/recent-movies`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch recent movies data");
    return [];
  }

  return res.json();
});

const getRecentsShows = cache(async (): Promise<Movie[]> => {
  const base_url = process.env.CONSUMET_API;
  const res = await fetch(`${base_url}/movies/flixhq/recent-shows`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch recent shows data");
    return [];
  }

  return res.json();
});

export default async function Home() {
  const trendingData = getTrendings();
  const recentMoviesData = getRecentMovies();
  const recentShowsData = getRecentsShows();

  const [trending, recentMovies, recentShows] = await Promise.all([
    trendingData,
    recentMoviesData,
    recentShowsData,
  ]);

  const koreah = await getKoreah();
  const thailand = await getThailand();
  return (
    <main className="mt-16 space-y-20 py-10">
      <section className="">
        <HeroChatAI />
      </section>

      <ListHistories />

      {trending.results.length > 0 && <ListTrending data={trending.results} />}

      <section className="container space-y-8">
        <h3>Recent Movies</h3>

        {recentMovies.length > 0 && <MovieSlider data={recentMovies} />}
      </section>

      <section className="container space-y-8">
        <h3>Recent Shows</h3>

        {recentShows.length > 0 && <MovieSlider data={recentShows} />}
      </section>

      <section className="container space-y-8">
        <div className="flex items-center gap-4">
          <h3>Koreahhhhh 🙄</h3>
          <Separator className="flex-1" />
          <Button asChild size={"sm"} className="gap-2">
            <Link href={"/country/KR"}>
              <span>See All</span>
              <span>
                <ChevronRight size={16} />
              </span>
            </Link>
          </Button>
        </div>

        {koreah.results.length > 0 && <MovieSlider data={koreah.results} />}
      </section>

      <section className="container space-y-8">
        <div className="flex items-center gap-4">
          <h3>Thailand 😛</h3>
          <Separator className="flex-1" />
          <Button asChild size={"sm"} className="gap-2">
            <Link href={"/country/TH"}>
              <span>See All</span>
              <span>
                <ChevronRight size={16} />
              </span>
            </Link>
          </Button>
        </div>

        {thailand.results.length > 0 && <MovieSlider data={thailand.results} />}
      </section>
    </main>
  );
}
