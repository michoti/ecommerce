'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

// Define Zod schema for review submission
const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().min(1, 'Please select a rating between 1 and 5').max(5, 'Rating cannot exceed 5'),
  comment: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
});

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer: string;
  date: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  productId: string;
}

const postReview = async ({
  productId,
  rating,
  comment,
  userId,
}: {
  productId: string;
  rating: number;
  comment?: string;
  userId: string;
}): Promise<Review> => {
  // Validate data with Zod before sending
  const validatedData = reviewSchema.parse({ productId, rating, comment, userId });
  
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedData),
  });
  if (!response.ok) {
    throw new Error('Failed to submit review');
  }
  return response.json();
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, productId }) => {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  console.log("Reviews are :", reviews);

  const mutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['product'] }); // Refetch product data
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !userId) {
      toast.error('Please sign in to submit a review');
      return;
    }

    try {
      // Validate form data before submission
      reviewSchema.parse({
        productId,
        rating,
        comment: comment.trim() || undefined,
        userId,
      });

      mutation.mutate({
        productId,
        rating,
        comment: comment.trim() || undefined,
        userId,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display the first validation error
        toast.error(error.errors[0].message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      {/* Review Submission Form */}
      {isSignedIn && (
        <Card className="p-6 mb-8 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label htmlFor="rating" className="text-sm font-medium">
                Rating
              </Label>
              <div className="flex items-center space-x-1 mt-1">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <Star
                      key={i}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        starValue <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(0)}
                      aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="comment" className="text-sm font-medium">
                Comment (Optional)
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the product..."
                className="mt-1"
                rows={4}
                aria-label="Review comment"
              />
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(review.rating) ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{review.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              {review.comment && <p className="text-gray-600 leading-tight">{review.comment}</p>}
              <p className="text-sm text-gray-600 mt-2">— {review.reviewer}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet.</p>
      )}
    </motion.div>
  );
};

export default ProductReviews;