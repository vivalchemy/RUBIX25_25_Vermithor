"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProductType } from '@/lib/types';
import { ReviewType } from '@/lib/types/Reset';
import axios from 'axios';
import { PencilIcon, Star, X } from 'lucide-react';
import { useState } from 'react'

function Reviews({ product }: { product: ProductType }) {
  const [showReviewSubmissionModal, setShowReviewSubmissionModal] = useState(false);

  // New state for review submission
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmissionError, setReviewSubmissionError] = useState<string | null>(null);


  // Review submission handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewSubmissionError(null);

    if (!product) {
      setReviewSubmissionError('No product selected');
      setIsSubmittingReview(false);
      return;
    }

    try {
      const reviewData: Omit<ReviewType, 'reviewId' | 'customer' | 'vendor' | 'reviewDate'> = {
        rating: newReview.rating,
        reviewText: newReview.reviewText,
      };

      const response = await axios.post(`/api/review/${product.id}`, reviewData, {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">

          <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {product.rating} / 5
          </Badge>
        </div>
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => setShowReviewSubmissionModal(prev => !prev)}
        >

          {!showReviewSubmissionModal ? <PencilIcon className="h-5 w-5" /> : <X className="h-5 w-5" />}
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
        {(product.reviews || []).map((review: any) => (
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
  )
}

export default Reviews
