"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/home/NavBar';
import Reviews from './Reviews';
import RelatedProducts from './RelatedProducts';
import ProductDetails from './ProductDetails';
import { Product } from '@/lib/types/Reset';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  function handleAddToCart(product: Product) {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
  
      // Check if the product already exists in the cart
      const existingProductIndex = cart.findIndex((item : any) => item.id === product.itemId);
  
      if (existingProductIndex >= 0) {
        // If product already exists in cart, just update the quantity
        cart[existingProductIndex].quantity += 1;
      } else {
        // Otherwise, add the product with quantity 1
        const productWithQuantity = { ...product, quantity: 1 };
        cart.push(productWithQuantity);
      }
  
      // Save the updated cart back to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }

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
          id={id}
        />

        {/* Frequently Bought Together */}
        <RelatedProducts products={relatedProducts} handleAddToCart={handleAddToCart} />

        {/* Reviews */}
        <Reviews id={id} />
      </div>
    </>
  );
}

export default ProductPage;
