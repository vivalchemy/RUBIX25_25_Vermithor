"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Heart, ShoppingCart, Rotate3d, PencilIcon, ChevronLeftIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductType, ProductsType } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/home/NavBar';
import { Textarea } from '@/components/ui/textarea';
import { ReviewType } from '@/lib/types/Reset';
import axios from 'axios';
import Reviews from './Reviews';
import RelatedProducts from './RelatedProducts';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

const arLinks: Record<string, string> = {
  "banana": "https://mywebar.com/p/Banana-ud",
  "bread": "https://mywebar.com/p/Bread",
  "eggs": "https://mywebar.com/p/Eggs",
  "milk": "https://mywebar.com/p/milk",
  "apple": "https://mywebar.com/p/apple-"
};

function ProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const PRODUCT_INDEX = parseInt(id as string, 10);
  const [products, setProducts] = useState<ProductsType>([]);
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
  const [arLinkOfProduct, setArLinkOfProduct] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // New state for review submission
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: '',
  });
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        setProducts(data.products);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const product = products[PRODUCT_INDEX];
      setCurrentProduct(product);
    }
  }, [products, PRODUCT_INDEX]);


  const relatedProducts = [
    products[PRODUCT_INDEX - 1],
    products[PRODUCT_INDEX + 1]
  ].filter(Boolean);

  function handleAddToCart(product: ProductType) {
    console.log('Add to cart', product);
  }

  if (isLoading || !currentProduct) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="mt-16 max-w-5xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <Button className='mb-2'><ChevronLeftIcon className="h-5 w-5"
          onClick={() => router.back()} /> Back</Button>
        {/* Product Info */}
        <ProductDetails
          product={currentProduct}
          handleAddToCart={handleAddToCart}
        />

        {/* Frequently Bought Together */}
        <RelatedProducts products={relatedProducts} handleAddToCart={handleAddToCart} />

        {/* Reviews */}
        <Reviews product={currentProduct} />
      </div>
    </>
  );
}

export default ProductPage;
