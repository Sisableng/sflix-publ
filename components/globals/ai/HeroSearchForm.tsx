"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, LoaderCircle, SearchIcon, XIcon } from "lucide-react";
import MovieCardSkeleton from "../skeleton/MovieCardSkeleton";
import { useInfiniteSearch } from "../navigation/item/search/hooks/useInfiniteSearch";
import MovieCard from "../movies/MovieCard";
import hardRedirect from "@/lib/hardRedirect";

export default function HeroSearchForm() {
  const [query, setQuery] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");

  const { data, error, isLoading } = useInfiniteSearch({ query });

  const handleReset = () => {
    setQuery("");
    setValue("");
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const newQuery = formData.get("query");
          setQuery(newQuery as string);
          setValue(newQuery as string);

          window.sessionStorage.setItem("search-query", newQuery as string);
        }}
        className="relative mx-auto w-full max-w-xl"
      >
        <div className="absolute left-3 top-3.5 text-muted-foreground">
          <SearchIcon size={20} />
        </div>
        <Input
          name="query"
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Pirates Of The Caribbean"
          className="h-12 w-full rounded-2xl px-10 text-lg focus-visible:bg-muted"
          disabled={isLoading}
        />
        <div className="absolute right-1.5 top-1.5 text-muted-foreground">
          <Button
            type={
              data && data.length > 0 && query === value ? "button" : "submit"
            }
            onClick={() => data && data.length > 0 && handleReset()}
            size="icon"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : data && data.length > 0 && query === value ? (
              <XIcon size={20} />
            ) : (
              <ArrowRight size={20} />
            )}
          </Button>
        </div>
      </form>

      {!error ? (
        <>
          <div className="grid grid-cols-2 gap-4 gap-y-10 pt-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {!isLoading
              ? data &&
                data.slice(0, 10).map((movie) => (
                  <MovieCard
                    movie={movie}
                    key={movie.id}
                    classNames={{
                      container: "w-full",
                    }}
                  />
                ))
              : [...Array(5)].map((_, idx) => (
                  <MovieCardSkeleton
                    key={`movie-card-skele-${idx}`}
                    classNames={{
                      container: "w-full",
                    }}
                  />
                ))}
          </div>

          {!isLoading && data && data.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  window.location.href = "/search";
                  // hardRedirect("/search")
                }}
              >
                See All Results.
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-sm text-destructive">
          <p>{error.message}</p>
        </div>
      )}
    </>
  );
}
