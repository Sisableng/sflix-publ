"use client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { mq, useMediaQuery } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import SearchButton from "./item/search/SearchButton";
import MobileMenu from "./item/MobileMenu";
import Image from "next/image";

const MenuLists = dynamic(() => import("./item/list/MenuLists"), {
  ssr: false,
});

export default function Navbar() {
  const [isActive, setIsActive] = React.useState(false);

  const mdScreen = useMediaQuery(mq("md"));

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={clsx(
        "fixed inset-x-0 top-0 z-50",
        isActive
          ? "bg-background/50 backdrop-blur"
          : "bg-gradient-to-b from-background to-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <Link
            href={"/"}
            className="flex items-center gap-3 transition-colors ease-in-out hover:text-primary"
          >
            <Image
              src={"/assets/favicon-16x16.png"}
              width={18}
              height={18}
              alt="logo-image"
            />
            <h3>SFlix</h3>
          </Link>

          {mdScreen && <MenuLists />}
        </div>
        <div className="flex items-center gap-2.5">
          <SearchButton />
          {!mdScreen && <MobileMenu />}
        </div>
      </div>
    </nav>
  );
}
