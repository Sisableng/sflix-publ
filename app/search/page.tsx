"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, SearchIcon, XIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import SearchCard from "@/components/globals/navigation/item/search/SearchCard";
import { useInfiniteSearch } from "@/components/globals/navigation/item/search/hooks/useInfiniteSearch";

export default function SearchPage() {
  const [value, setValue] = React.useState("");

  const [debouncedValue] = useDebounce(value, 1000);

  const { data, error, isLoading, isReachingEnd, isLoadingMore, loadMore } =
    useInfiniteSearch({ query: debouncedValue });

  function updateQuery(queryValue: string) {
    window.sessionStorage.setItem("search-query", queryValue);
  }

  function handleClear() {
    setValue("");
    window.sessionStorage.removeItem("search-query");
  }

  React.useEffect(() => {
    if (window !== undefined) {
      const query = window.sessionStorage.getItem("search-query");

      if (query) {
        setValue(query);
      }
    }

    return () => {};
  }, []);

  React.useEffect(() => {
    if (debouncedValue.length > 0) {
      updateQuery(debouncedValue);
    }
  }, [debouncedValue]);
  return (
    <div className="container mt-16 min-h-screen space-y-10 py-10">
      <h2>Search Page</h2>
      <div className="relative">
        <div className="absolute left-1.5 top-1.5 grid h-9 w-9 place-content-center text-muted-foreground">
          <SearchIcon size={20} />
        </div>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search Movie or Series..."
          className="h-12 w-full px-12"
        />
        <div className="absolute right-1.5 top-1.5">
          {value.length > 0 &&
            (isLoading ? (
              <div className="grid h-9 w-9 place-content-center">
                <LoaderCircle className="animate-spin text-primary" />
              </div>
            ) : (
              <Button size={"icon"} variant={"ghost"} onClick={handleClear}>
                <XIcon />
              </Button>
            ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-hidden">
        {debouncedValue.length > 0 && (
          <p className="text-sm text-muted-foreground">
            <span>Result of</span>{" "}
            <span className="text-foreground">{debouncedValue}</span>
          </p>
        )}
        {error ? (
          <div className="flex-1">
            <p>{error.message}</p>
            <p>{`ERR CODE: ${error.code}`}</p>
          </div>
        ) : (
          <ScrollArea type="scroll" className="flex-1">
            <div className="space-y-6">
              {data.length > 0
                ? data.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <SearchCard
                        item={item}
                        classNames={{
                          imageContainer: "lg:w-36 lg:h-56",
                          title: "lg:text-xl",
                        }}
                      />

                      {idx !== data.length - 1 && <Separator />}
                    </React.Fragment>
                  ))
                : !isLoading &&
                  debouncedValue.length > 0 &&
                  data.length === 0 && (
                    <div className="flex h-60 flex-col items-center justify-center gap-4">
                      <h2>Not Found 😑</h2>
                      <p>{`Oh sorry bro, the request you're looking for is nowhere to be found, dude.`}</p>
                    </div>
                  )}

              {debouncedValue.length > 0 && !isReachingEnd && (
                <div className="flex justify-center">
                  <Button
                    variant={"ghost"}
                    onClick={loadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
