import { Button } from "@/components/ui/button";
import { getGenres } from "@/lib/data/actions";
import { Genre } from "@/types/flixhq";
import Link from "next/link";
import React from "react";

export default async function GenreListsPage() {
  const genres: Genre[] = getGenres();
  return (
    <div className="container mt-16 min-h-screen space-y-10 py-10">
      <h2>List Genres</h2>

      <div className="flex flex-wrap items-center gap-5">
        {genres.map((genre) => (
          <Button
            asChild
            key={genre.id}
            variant={"secondary"}
            className="flex-auto hover:bg-primary hover:text-primary-foreground"
          >
            <Link href={`/genre/${genre.id}`} className="truncate">
              <span>{genre.title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
