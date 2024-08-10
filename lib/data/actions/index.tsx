import { Country, Genre } from "@/types/flixhq";
import genres from "@/lib/data/genres.json";
import countries from "@/lib/data/countries.json";

export function getGenres(): Genre[] {
  return genres;
}

export function getCountries(): Country[] {
  return countries;
}
