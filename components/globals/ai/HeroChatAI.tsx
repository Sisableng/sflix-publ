"use client";
import React from "react";

import Particles from "@/components/magicui/particles";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
const HeroSearchForm = dynamic(() => import("./HeroSearchForm"), {
  ssr: false,
  loading: () => <Skeleton className="mx-auto h-12 w-full max-w-xl" />,
});

export default function HeroChatAI() {
  return (
    <div className="relative flex min-h-96 w-full flex-col items-center bg-background pt-28 md:min-h-[30rem]">
      <div className="container relative z-10 flex flex-col gap-10">
        <span className="pointer-events-none mx-auto max-w-4xl whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 xl:text-6xl">
          What <span className="text-primary">Movie</span> do you want to watch
          now?
        </span>

        <HeroSearchForm />
      </div>

      <Particles
        className="absolute inset-x-0 top-0 h-full max-h-96 md:max-h-[30rem]"
        quantity={100}
        ease={80}
        color={"#ffffff"}
        refresh
      />
    </div>
  );
}
