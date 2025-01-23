"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Heart, ShoppingCart, Rotate3d, PencilIcon, ChevronLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductType, ProductsType } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/home/NavBar';
import { Textarea } from '@/components/ui/textarea';
import { ReviewType } from '@/lib/types/Reset';
import axios from 'axios';

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
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewSubmissionModal, setShowReviewSubmissionModal] = useState(false);

  // New state for review submission
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmissionError, setReviewSubmissionError] = useState<string | null>(null);

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

      // Find AR link
      const arLink = product.name.toLowerCase().split(" ").reduce<string | null>((link, word) => {
        if (link) return link;  // If link is already found, return it
        return word in arLinks ? arLinks[word] : null; // Otherwise, check the current word
      }, null);

      setArLinkOfProduct(arLink || "");
      console.log(arLink);
    }
  }, [products, PRODUCT_INDEX]);


  // Review submission handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewSubmissionError(null);

    if (!currentProduct) {
      setReviewSubmissionError('No product selected');
      setIsSubmittingReview(false);
      return;
    }

    try {
      const reviewData: Omit<ReviewType, 'reviewId' | 'customer' | 'vendor' | 'reviewDate'> = {
        rating: newReview.rating,
        reviewText: newReview.reviewText,
      };

      const response = await axios.post(`/api/review/${currentProduct.id}`, reviewData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Reset form and potentially refresh reviews
      setNewReview({ rating: 5, reviewText: '' });

      // Optional: You might want to refetch the product to update reviews
      // This would depend on your backend implementation
    } catch (error) {
      console.error('Review submission error:', error);

      setReviewSubmissionError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to submit review'
          : 'An unknown error occurred'
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading || !currentProduct) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const relatedProducts = [
    products[PRODUCT_INDEX - 1],
    products[PRODUCT_INDEX + 1]
  ].filter(Boolean);

  function handleAddToCart(product: ProductType) {
    console.log('Add to cart', product);
  }

  return (
    <>
      <NavBar />
      <div className="mt-16 max-w-5xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <Button className='mb-2'><ChevronLeftIcon className="h-5 w-5"
          onClick={() => router.back()} /> Back</Button>
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
                <Button variant="outline" className="px-4"
                  onClick={() => {
                    router.push(`${arLinkOfProduct}`);
                  }}>
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
            <div className="flex items-center">

              <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {currentProduct.rating} / 5
              </Badge>
            </div>
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => setShowReviewSubmissionModal(prev => !prev)}
            >
              <PencilIcon className="h-5 w-5" />
              {showReviewSubmissionModal ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>


          {/* Review Submission Form */}
          {showReviewSubmissionModal && (
            <form onSubmit={handleSubmitReview} className="mb-8 bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <Star
                      key={starValue}
                      className={`h-6 w-6 cursor-pointer ${starValue <= newReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: starValue }))}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <Textarea
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                  placeholder="Share your experience with this product"
                  className="w-full"
                  required
                />
              </div>

              {reviewSubmissionError && (
                <div className="text-red-500 text-sm mb-4">{reviewSubmissionError}</div>
              )}

              <Button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          )}

          {/* Existing Reviews */}
          <div className="space-y-4 md:grid md:grid-cols-2 gap-6">
            {(currentProduct.reviews || []).map((review: any) => (
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
    </>
  );
}

export default ProductPage;
