"use client";
import { Modal } from "./modal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, SearchIcon, XIcon } from "lucide-react";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import SearchCard from "@/components/globals/navigation/item/search/SearchCard";
import { useInfiniteSearch } from "@/components/globals/navigation/item/search/hooks/useInfiniteSearch";

export default function SearchModalPage() {
  const [value, setValue] = React.useState("");

  const router = useRouter();

  const { data, error, isLoading, isReachingEnd, isLoadingMore, loadMore } =
    useInfiniteSearch({ query: value });

  const debouncedQuery = useDebouncedCallback(
    (value) => {
      setValue(value);
      window.sessionStorage.setItem("search-query", value);
    },
    // delay in ms
    1000,
  );

  return (
    <Modal>
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 overflow-hidden">
        <div className="relative">
          <div className="absolute left-1.5 top-1.5 grid h-9 w-9 place-content-center text-muted-foreground">
            <SearchIcon size={20} />
          </div>
          <Input
            defaultValue={value}
            onChange={(e) => debouncedQuery(e.target.value)}
            placeholder="Search Movie or Series..."
            className="h-12 w-full px-12"
          />
          <div className="absolute right-1.5 top-1.5">
            {isLoading ? (
              <div className="grid h-9 w-9 place-content-center">
                <LoaderCircle className="animate-spin text-primary" />
              </div>
            ) : (
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => router.back()}
              >
                <XIcon size={20} />
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          {value.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <span>Result of</span>{" "}
              <span className="text-foreground">{value}</span>
            </p>
          )}
          {error ? (
            <div className="flex-1">
              <p>{error.message}</p>
              <p>{`ERR CODE: ${error.code}`}</p>
            </div>
          ) : (
            <ScrollArea type="scroll" className="flex-1">
              <div className="space-y-3">
                {data.length > 0
                  ? data.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        <SearchCard item={item} />

                        {idx !== data.length - 1 && <Separator />}
                      </React.Fragment>
                    ))
                  : !isLoading &&
                    value.length > 0 &&
                    data.length === 0 && (
                      <div className="flex h-60 flex-col items-center justify-center gap-4">
                        <h2>Not Found 😑</h2>
                        <p>{`Oh sorry bro, the request you're looking for is nowhere to be found, dude.`}</p>
                      </div>
                    )}

                {value.length > 0 && !isReachingEnd && (
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
    </Modal>
  );
}
