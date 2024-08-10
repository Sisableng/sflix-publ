"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Country, Genre } from "@/types/flixhq";
import { getCountries, getGenres } from "@/lib/data/actions";

export default function MenuLists() {
  const genres = getGenres();
  const countries = getCountries();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Genres</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-max grid-cols-4 gap-3 p-4 md:max-w-[34rem] lg:max-w-[40rem]">
              {genres.length > 0 ? (
                <>
                  {genres.slice(0, 10).map((genre) => (
                    <ListItem
                      key={genre.id}
                      title={genre.title}
                      href={`/genre/${genre.id}`}
                    ></ListItem>
                  ))}
                  <ListItem
                    title={`More... +${genres.length - 10}`}
                    href={`/genre`}
                    className="text-primary"
                  ></ListItem>
                </>
              ) : (
                <li className="text-sm italic text-muted-foreground">
                  Genres not found, Please Reload Page.
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Countries</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-max grid-cols-4 gap-3 p-4 md:max-w-[34rem] lg:max-w-[40rem]">
              {countries.length > 0 ? (
                <>
                  {countries.slice(0, 10).map((country) => (
                    <ListItem
                      key={country.id}
                      title={country.title}
                      href={`/country/${country.code}`}
                    >
                      {country.code}
                    </ListItem>
                  ))}
                  <ListItem
                    title={`More... +${countries.length - 10}`}
                    href={`/country`}
                    className="text-primary"
                  >
                    {`Full Countries`}
                  </ListItem>
                </>
              ) : (
                <li className="text-sm italic text-muted-foreground">
                  Countries not found, Please Reload Page.
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <Link href="/search" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Test
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
        <NavigationMenuIndicator className="fill-border" />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <Link ref={ref} legacyBehavior passHref {...props}>
        <NavigationMenuLink>
          <div
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
          >
            <div className="text-xs font-medium leading-none">{title}</div>
            {children && (
              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                {children}
              </p>
            )}
          </div>
        </NavigationMenuLink>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";
