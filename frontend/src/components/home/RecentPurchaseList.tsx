"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, Loader2 } from "lucide-react";
import { Product } from "@/lib/types/Reset";
import Image from "next/image";

export default function RecentProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/data/products.json")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load recent products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 font-medium">Loading your recent products...</p>
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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Recently Purchased
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your favorite items are just a click away
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.slice(0, 6).map((product) => (
            <Card
              key={product.itemId}
              className="overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-xl group"
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.imgLink || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 flex items-center bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
                    <Star className="text-yellow-500 w-4 h-4" />
                    <span className="ml-1.5 text-sm font-medium">{product.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Primary Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-xl text-gray-800 leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="shrink-0 shadow-sm hover:shadow transition-shadow"
                      >
                        Buy again
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{product.vendor}</p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="text-sm">
                        Arrives in <span className="font-medium">{product.timeToArrive}</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span>Serves </span>
                      <span className="font-medium">{product.peopleRequired}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
