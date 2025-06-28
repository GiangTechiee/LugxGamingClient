"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Review } from "@/types/game";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-600"
          }`}
        />
      );
    }
    
    return stars;
  };

  if (!reviews || reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-2">
          Chưa có đánh giá nào cho game này.
        </p>
        <p className="text-gray-500 text-sm">
          Hãy là người đầu tiên đánh giá game này!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {reviews.map((review, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-semibold text-base">
                    {review.user.username}
                  </span>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-gray-400 text-sm">
                    ({review.rating}/5)
                  </span>
                </div>
                
                <span className="text-gray-500 text-sm">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="pt-2">
              <p className="text-gray-300 leading-relaxed text-base">
                {review.comment}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Tổng cộng: {reviews.length} đánh giá
            </span>
            <span>
              Điểm trung bình: {" "}
              <span className="text-yellow-400 font-medium">
                {(
                  reviews.reduce((sum, review) => sum + review.rating, 0) / 
                  reviews.length
                ).toFixed(1)}/5
              </span>
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReviewList;