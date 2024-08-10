"use client";
import { usePathname } from "next/navigation";
import React from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  React.useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={
        "fixed inset-0 z-50 flex flex-col bg-background/90 p-6 backdrop-blur"
      }
    >
      {children}
    </div>
  );
}
