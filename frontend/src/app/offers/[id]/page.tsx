"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Heart, ShoppingCart, Rotate3d } from 'lucide-react';
import { OfferType, OffersType } from '@/lib/types';
import { useParams } from 'next/navigation';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import NavBar from '@/components/home/NavBar';

function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const OFFER_INDEX = parseInt(id as string, 10);
  const [offers, setOffers] = useState<OffersType>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/data/offers.json');
        const data = await response.json();
        setOffers(data.offers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (isLoading || !offers.length) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentOffer = offers[OFFER_INDEX];
  const relatedOffers = [
    offers[OFFER_INDEX - 1],
    offers[OFFER_INDEX + 1]
  ].filter(Boolean);

  function handleAddToCart(product: Product) {
    console.log('Add to cart', product);
  }

  return (
    <>
      <NavBar />
      <div className="mt-16 max-w-5xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Main Offer Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Offer Image */}
          <div className="relative rounded-lg overflow-hidden shadow-lg group">
            <img
              src={currentOffer.image || "/api/placeholder/800/600"}
              alt={currentOffer.title}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </Button>
          </div>

          {/* Offer Info */}
          <div className="space-y-6 lg:py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-base">{currentOffer.title}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{currentOffer.title}</h1>

              <div className="space-y-2">
                <p className="text-gray-600 text-base leading-relaxed">{currentOffer.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-2xl font-bold text-gray-900">${currentOffer.products.reduce((total, product) => total + product.price, 0)}</div>

              <div className="flex gap-3 pt-2">
                <Button>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-4">
                  <Rotate3d className="h-4 w-4" />
                  View in AR
                </Button>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Products Included</h2>
              </div>
              <div className="space-y-4 gap-6 max-h-72 overflow-y-auto">
                {currentOffer.products.map((product) => (
                  <Card key={product.id} className="hover:shadow-sm transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-base text-gray-900">{product.name}</span>
                        </div>
                        <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-full">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Offers */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Related Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedOffers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <img
                      src={offer.image || "/api/placeholder/200/200"}
                      alt={offer.title}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-base mb-1">{offer.title}</h3>
                      <Button className="mt-2" onClick={() => handleAddToCart(offer.products[0])}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Products in Offer */}
      </div>
    </>
  );
};

export default OfferPage;
