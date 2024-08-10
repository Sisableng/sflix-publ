import { Button } from "@/components/ui/button";
import { getCountries } from "@/lib/data/actions";
import { Country } from "@/types/flixhq";
import Link from "next/link";
import React from "react";

export default async function CountryListsPage() {
  const countries: Country[] = getCountries();
  return (
    <div className="container mt-16 min-h-screen space-y-10 py-10">
      <h2>List Countries</h2>

      <div className="flex flex-wrap items-center gap-5">
        {countries.map((country) => (
          <Button
            asChild
            key={country.id}
            variant={"secondary"}
            className="flex-auto hover:bg-primary hover:text-primary-foreground"
          >
            <Link href={`/country/${country.code}`} className="truncate">
              <span>{country.title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
