import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { PencilIcon, Star, X } from 'lucide-react';

function Reviews({ productId }: { productId: string }) {
  const [showReviewSubmissionModal, setShowReviewSubmissionModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmissionError, setReviewSubmissionError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  // Retrieve reviews from localStorage
  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews_${productId}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [productId]);

  // Save reviews to localStorage
  const saveReviewsToLocalStorage = (updatedReviews: any[]) => {
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
  };

  // Submit a new review to the backend and save to localStorage
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewSubmissionError(null);

    try {
      const reviewData = {
        rating: newReview.rating,
        reviews: [newReview.reviewText],
      };

      // Send the review to the backend
      const response = await axios.post(`http://127.0.0.1:8000/analyze_reviews/`, reviewData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Update localStorage with the backend response
      const newReviewEntry = response.data.results[0];
      const newRevisedEntryWithRating = { ...newReviewEntry, rating: newReview.rating };
      const updatedReviews = [...reviews, newRevisedEntryWithRating];
      saveReviewsToLocalStorage(updatedReviews);

      // Reset the form
      setNewReview({ rating: 5, reviewText: '' });
      setShowReviewSubmissionModal(false);
    } catch (error) {
      console.error('Review submission error:', error);
      setReviewSubmissionError('Failed to submit review. Please try again.');
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
            {reviews.length} Reviews
          </Badge>
        </div>
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => setShowReviewSubmissionModal((prev) => !prev)}
        >
          {!showReviewSubmissionModal ? <PencilIcon className="h-5 w-5" /> : <X className="h-5 w-5" />}
          {showReviewSubmissionModal ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {/* Existing Reviews */}
      <div className="space-y-4 md:grid md:grid-cols-2 gap-6 mb-6">
        {reviews.map((review, index) => (
          <Card key={index} className="hover:shadow-sm transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Badge variant="secondary">{review.gemini_suggestion}</Badge>
                  <p className="text-sm text-gray-900 font-medium">{review.review}</p>
                  <p className="text-xs text-gray-500 mt-1">Rating: {review.rating}</p>
                  <p className="text-xs text-gray-500 mt-1">Sentiment: {review.sentiment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
                  className={`h-6 w-6 cursor-pointer ${starValue <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  onClick={() => setNewReview((prev) => ({ ...prev, rating: starValue }))}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <Textarea
              value={newReview.reviewText}
              onChange={(e) => setNewReview((prev) => ({ ...prev, reviewText: e.target.value }))}
              placeholder="Share your experience with this product"
              className="w-full"
              required
            />
          </div>
          {reviewSubmissionError && (
            <div className="text-red-500 text-sm mb-4">{reviewSubmissionError}</div>
          )}
          <Button type="submit" disabled={isSubmittingReview} className="w-full">
            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}
    </div>
  );
}

export default Reviews;
