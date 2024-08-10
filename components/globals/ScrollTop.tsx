"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import clsx from "clsx";

export default function ScrollTop() {
  const [isVisible, setIsVisible] = React.useState(false);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  });
  return (
    <div
      className={clsx(
        "group fixed bottom-5 right-5 transition-transform ease-in-out",
        isVisible ? "scale-100" : "scale-0",
      )}
    >
      <Button
        size={"icon"}
        variant={"secondary"}
        className="h-12 w-12 rounded-full group-hover:bg-primary group-hover:text-primary-foreground"
        onClick={handleScrollTop}
      >
        <ArrowUp className="transition-transform ease-in-out group-hover:-translate-y-2" />
      </Button>
    </div>
  );
}
