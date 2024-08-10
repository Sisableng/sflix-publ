"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const menus = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/genre",
    title: "Genres",
  },
  {
    url: "/country",
    title: "Countries",
  },
  {
    url: "#",
    title: "Fuck You",
  },
  {
    url: "#",
    title: "Fuck You",
  },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-6 border-none text-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl">Menu</SheetTitle>
          <SheetDescription>List of Menus</SheetDescription>
        </SheetHeader>
        <ul className="list-inside list-disc space-y-6">
          {menus.map((menu, idx) => (
            <li key={`mobile-menu-${idx}`}>
              <Link href={menu.url} onClick={() => setIsOpen(false)}>
                {menu.title}
              </Link>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
