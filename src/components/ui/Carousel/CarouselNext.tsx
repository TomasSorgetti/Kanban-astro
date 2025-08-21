import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../Button";
import { useCarousel } from "./Carousel";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  if (!canScrollNext) return null;
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "hidden absolute h-8 w-8 rounded-full z-10 cursor-pointer md:flex",
        orientation === "horizontal"
          ? "-right-2 top-1/2 -translate-y-1/2"
          : "bottom-4 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";
