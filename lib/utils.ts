import { ConsumetMediaType, Country, Movie, TVShow } from "@/types/flixhq";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate a post title to a maximum length of 60 characters.
 * @param title - The original post title.
 * @param maxLength - The maximum length of the truncated title.
 * @returns The truncated title with ellipsis if it exceeds the maxLength.
 */

export function truncate(title: string, maxLength?: number): string {
  const defaultMaxLength = maxLength ?? 60;
  if (title.length <= defaultMaxLength) {
    return title;
  }
  return title.substring(0, maxLength).trimEnd() + "...";
}

/**
 * Converts seconds to a formatted string MM:SS.
 * @param seconds - Time in seconds.
 * @returns Formatted time string.
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

export function isMovie(item: Movie | TVShow): item is Movie {
  return item.type === ConsumetMediaType.Movie;
}

export function isTVShow(item: Movie | TVShow): item is TVShow {
  return item.type === ConsumetMediaType.TV;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function getCountry(
  countries: Country[],
  countryName: string,
): Country | null {
  const normalizedName = countryName.trim().toLowerCase();

  const country = countries.find(
    (c) =>
      c.title.toLowerCase() === normalizedName ||
      c.id.replace(/-/g, " ") === normalizedName,
  );

  return country ? country : null;
}
