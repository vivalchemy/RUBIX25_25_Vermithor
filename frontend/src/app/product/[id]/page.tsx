"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Heart, ShoppingCart, Rotate3d } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductType, ProductsType } from '@/lib/types';
import { useParams } from 'next/navigation';


function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const PRODUCT_INDEX = parseInt(id as string, 10);
  const [products, setProducts] = useState<ProductsType>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading || !products.length) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentProduct = products[PRODUCT_INDEX];
  const relatedProducts = [
    products[PRODUCT_INDEX - 1],
    products[PRODUCT_INDEX + 1]
  ].filter(Boolean);

  function handleAddToCart(product: ProductType) {
    console.log('Add to cart', product);
  }

  return (
    <div className="mt-16 max-w-5xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative rounded-lg overflow-hidden shadow-lg group">
          <img
            src={currentProduct.image || "/api/placeholder/800/600"}
            alt={currentProduct.name}
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

        {/* Product Info */}
        <div className="space-y-6 lg:py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-base">{currentProduct.vendor}</span>
              <span className="text-lg">·</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-medium">{currentProduct.rating}</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>

            <div className="flex flex-wrap gap-3 pt-1">
              <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {currentProduct.timeToArrive} mins
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Serves {currentProduct.peopleRequired}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-base leading-relaxed">
              {currentProduct.description || "Experience the perfect blend of flavors with our signature dish, crafted with premium ingredients and prepared to perfection."}
            </p>

            <div className="text-2xl font-bold text-gray-900">${currentProduct.price}</div>

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
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <img
                    src={product.image || "/api/placeholder/200/200"}
                    alt={product.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-base mb-1">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium text-gray-900">${product.price}</span>
                      <Badge variant="secondary" className="text-xs">
                        {product.vendor}
                      </Badge>
                    </div>
                    <Button className="mt-2" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {currentProduct.rating} / 5
          </Badge>
        </div>
        <div className="space-y-4 md:grid md:grid-cols-2 gap-6">
          {(currentProduct.reviews || []).map((review) => (
            <Card key={review.id} className="hover:shadow-sm transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-medium text-base text-gray-900">{review.user}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{review.date}</p>
                  </div>
                  <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-full">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
