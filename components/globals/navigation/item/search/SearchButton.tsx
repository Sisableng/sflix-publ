"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SearchButton() {
  const pathname = usePathname();
  return (
    <Button
      asChild
      size={"icon"}
      variant={"ghost"}
      onClick={() => {
        if (pathname === "/search") {
          toast(
            "You are already in search page, Bro! Stop click this fucking button, idiots!.",
            {
              position: "top-center",
            },
          );
        }
      }}
      disabled={pathname === "/search"}
    >
      <Link href={pathname !== "/search" ? "/search" : "#"}>
        <SearchIcon size={20} />
      </Link>
    </Button>
  );
}
