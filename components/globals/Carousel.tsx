"use client";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  HTMLAttributes,
  useState,
  useEffect,
} from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import clsx from "clsx";

type CarouselOptions = {
  navigation?: boolean;
  shadow?: boolean;
};

// Carousel Component
interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  options?: CarouselOptions;
}

export interface CarouselRef {
  scrollTo: (index: number) => void;
}

const Carousel = forwardRef<CarouselRef, CarouselProps>(
  ({ options, className, children, ...props }, ref) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout>();

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    useImperativeHandle(ref, () => ({
      scrollTo: (index: number) => {
        if (carouselRef.current) {
          const scrollAmount = carouselRef.current.offsetWidth * index;
          carouselRef.current.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      },
    }));

    const scroll = (direction: "left" | "right") => {
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.offsetWidth;
        carouselRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    const checkScrollPosition = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setIsAtStart(scrollLeft === 0);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
        setIsScrolling(true);

        // Set a timeout to hide the left shadow after scrolling stops
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150); // Adjust this value to change how quickly the shadow hides after scrolling stops
      }
    };

    useEffect(() => {
      const carouselElement = carouselRef.current;
      if (carouselElement) {
        carouselElement.addEventListener("scroll", checkScrollPosition);
        checkScrollPosition(); // Check initial position
        return () =>
          carouselElement.removeEventListener("scroll", checkScrollPosition);
      }
    }, []);

    return (
      <div className="relative mx-auto h-max w-full max-w-screen-xl space-y-6">
        <div className="relative">
          <div
            ref={carouselRef}
            className={cn(
              "scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none",
              className,
            )}
            {...props}
          >
            {children}
          </div>

          {/* Shadow */}
          {options?.shadow && (
            <div className="pointer-events-none absolute inset-0 -inset-x-1 flex items-center justify-between">
              <div
                className={clsx(
                  "h-full w-1/12 bg-gradient-to-r from-background to-transparent transition-opacity duration-500 ease-in-out",
                  isAtStart || !isScrolling ? "opacity-0" : "opacity-100",
                )}
              />
              <div
                className={clsx(
                  "h-full w-1/12 bg-gradient-to-l from-background to-transparent transition-opacity duration-500 ease-in-out",
                  isAtEnd ? "opacity-0" : "opacity-100",
                )}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        {options?.navigation && (
          <CarouselNavigation
            onPrev={() => scroll("left")}
            onNext={() => scroll("right")}
            isAtStart={isAtStart}
            isAtEnd={isAtEnd}
          />
        )}
      </div>
    );
  },
);

Carousel.displayName = "Carousel";

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("shrink-0 snap-start", className)} {...props}>
      {children}
    </div>
  ),
);

CarouselItem.displayName = "CarouselItem";

// CarouselNavigation Component
interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  isAtStart: boolean;
  isAtEnd: boolean;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  onPrev,
  onNext,
  isAtStart,
  isAtEnd,
}) => (
  <div className="flex items-center justify-end gap-2">
    <Button
      size={"icon"}
      variant={"secondary"}
      onClick={onPrev}
      className="hover:bg-primary hover:text-primary-foreground"
      disabled={isAtStart}
    >
      <ChevronLeftIcon size={20} />
    </Button>
    <Button
      size={"icon"}
      variant={"secondary"}
      onClick={onNext}
      className="hover:bg-primary hover:text-primary-foreground"
      disabled={isAtEnd}
    >
      <ChevronRightIcon size={20} />
    </Button>
  </div>
);

CarouselNavigation.displayName = "CarouselNavigation";

export { Carousel, CarouselItem };
