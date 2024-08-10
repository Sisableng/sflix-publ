import React, { FC } from "react";
import { Carousel, CarouselItem } from "./Carousel";
import dynamic from "next/dynamic";
import MovieCardSkeleton from "./skeleton/MovieCardSkeleton";

const MovieCard = dynamic(() => import("./movies/MovieCard"), {
  ssr: false,
  loading: () => <MovieCardSkeleton />,
});

interface MovieSliderProps {
  data: any[];
}

const MovieSlider = ({ data }: MovieSliderProps) => {
  return (
    <Carousel
      options={{
        navigation: true,
        shadow: true,
      }}
    >
      {data.map(async (movie) => {
        return (
          <CarouselItem key={movie.id}>
            <MovieCard movie={movie} />
          </CarouselItem>
        );
      })}
    </Carousel>
  );
};

export default MovieSlider;
