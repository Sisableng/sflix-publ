"use client";
import { Carousel, CarouselItem } from "@/components/globals/Carousel";
import React from "react";
import HistoryCard from "./HistoryCard";
import { useWatchHistoryStore } from "./provider/watch-history-provider";
import { type WatchHistory } from "./store/useWatchHistoryStore";

export default function ListHistories() {
  const [histories, setHistories] = React.useState<WatchHistory[]>([]);
  const storeHistories = useWatchHistoryStore((state) => state.histories);

  React.useEffect(() => {
    setHistories(storeHistories);
  }, [storeHistories]);

  if (!histories.length) {
    return null;
  }

  return (
    <section className="container space-y-8">
      <h3>Watch Histories</h3>

      <Carousel
        options={{
          navigation: true,
          shadow: true,
        }}
      >
        {histories.map((movie) => {
          return (
            <CarouselItem key={movie.id}>
              <HistoryCard data={movie} />
            </CarouselItem>
          );
        })}
      </Carousel>
    </section>
  );
}
