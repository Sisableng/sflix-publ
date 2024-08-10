"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";

type ClassNames = {
  container?: string;
  imageContainer?: string;
};

interface MovieCardSkeletonProps {
  classNames?: ClassNames;
}

export default function MovieCardSkeleton({
  classNames,
}: MovieCardSkeletonProps) {
  return (
    <div
      className={cn("flex w-40 flex-col gap-4 md:w-48", classNames?.container)}
    >
      <Skeleton
        className={cn(
          "relative h-60 w-full overflow-hidden rounded-md bg-muted md:h-72",
          classNames?.imageContainer,
        )}
      />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}
