import { getCountries } from "@/lib/data/actions";
import { Country } from "@/types/flixhq";
import React, { FC } from "react";
import dynamic from "next/dynamic";
import MovieCardSkeleton from "@/components/globals/skeleton/MovieCardSkeleton";

const ListByCountry = dynamic(
  () => import("@/components/globals/country/ListByCountry"),
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

interface ByCountryPageProps {
  params: {
    countryCode: string;
  };
}

const ByCountryPage = async ({ params }: ByCountryPageProps) => {
  const countries: Country[] = getCountries();
  const country = countries.find(
    (country) => country.code === params.countryCode,
  );
  return (
    <div className="container mt-16 min-h-screen space-y-10 py-10">
      <h2>{country?.title ?? "Unknown"}</h2>

      <ListByCountry />
    </div>
  );
};

export default ByCountryPage;
