"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import type { OffersType } from "@/lib/types";
import Image from "next/image"

export function Offers() {
  const [offers, setOffers] = useState<OffersType>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/data/offers.json")
      .then((response) => {
        setOffers(response.data.offers);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load offers");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 font-medium">Loading amazing offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 font-semibold text-lg">{error}</div>
          <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mt-12">
            Offers You&apos;ll Love
          </h2>
        </div>
        {/* Carousel */}
        <Carousel
          className="w-full max-w-6xl mx-auto relative group"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {offers.map((offer) => (
              <CarouselItem
                key={offer.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-xl group/card">
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                      <Image
                        src={offer.image || "/placeholder.svg"}
                        alt={offer.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-xl text-gray-800 leading-tight group-hover/card:text-primary transition-colors">
                        {offer.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {offer.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <div className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg hover:bg-white" />
          </div>
          <div className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselNext className="bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg hover:bg-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

