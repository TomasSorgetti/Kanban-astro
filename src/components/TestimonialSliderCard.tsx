// src/components/TestimonialSliderCard.tsx
import { Card, CardContent } from "./ui/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/Carousel";
import type { Testimonial } from "../types/testimonials";

interface TestimonialSliderCardProps {
  testimonials: Testimonial[];
}

export default function TestimonialSliderCard({
  testimonials,
}: TestimonialSliderCardProps) {
  return (
    <section className="w-full mx-auto container py-4">
      <div className=" px-3">
        <Carousel>
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card className="shadow-sm h-[400px] cursor-grab active:cursor-grabbing">
                  <CardContent className="flex  items-center justify-center p-6">
                    <div className="flex flex-col px-4 py-5 sm:p-6">
                      <q className="flex-1 text-gray-600 dark:text-gray-300">
                        {testimonial.quote}
                      </q>
                      <div className="mt-6 flex gap-3">
                        <span className="inline-flex rounded-full">
                          <img
                            className="h-10 w-10 rounded-full"
                            height={40}
                            width={40}
                            alt={testimonial.name}
                            src={testimonial.imgSrc}
                            loading="lazy"
                          />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
