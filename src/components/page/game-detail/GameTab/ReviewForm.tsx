"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { CreateReviewDto } from "@/types/review";

interface ReviewFormProps {
  gameId: number;
  onSubmit: (reviewData: CreateReviewDto) => Promise<void>;
  isSubmitting?: boolean;
  userInfo?: UserInfo | null;
}

interface UserInfo {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

const getUserFromStorage = (): UserInfo | null => {
  try {
    const userDataLocal = localStorage.getItem('user');
    if (userDataLocal) {
      return JSON.parse(userDataLocal);
    }

    const userDataSession = sessionStorage.getItem('user');
    if (userDataSession) {
      return JSON.parse(userDataSession);
    }

    return null;
  } catch (err) {
    console.error("Lỗi khi lấy thông tin user từ storage:", err);
    return null;
  }
};

const ReviewForm = ({ 
  gameId, 
  onSubmit, 
  isSubmitting = false,
  userInfo: propUserInfo
}: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(propUserInfo || null);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(!!propUserInfo);

  useEffect(() => {
    if (propUserInfo) {
      setUserInfo(propUserInfo);
      setIsUserLoaded(true);
      return;
    }

    const userData = getUserFromStorage();
    setUserInfo(userData);
    setIsUserLoaded(true);
    
    if (!userData) {
      setError("Bạn cần đăng nhập để viết đánh giá");
    }
  }, [propUserInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userInfo) {
      setError("Bạn cần đăng nhập để viết đánh giá");
      return;
    }

    // Validation
    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Bình luận phải có ít nhất 10 ký tự");
      return;
    }

    if (comment.trim().length > 1000) {
      setError("Bình luận không được vượt quá 1000 ký tự");
      return;
    }

    try {
      const reviewData: CreateReviewDto = {
        user_id: userInfo.user_id,
        game_id: gameId,
        rating,
        comment: comment.trim(),
      };

      await onSubmit(reviewData);

      // Reset form sau khi submit thành công
      setRating(0);
      setHoverRating(0);
      setComment("");
    } catch {
      setError("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
    }
  };

  const renderStarInput = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
          aria-label={`Đánh giá ${i} sao`}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              i <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600 hover:text-yellow-300"
            }`}
          />
        </button>
      );
    }
    
    return stars;
  };

  // Hiển thị loading khi đang lấy thông tin user
  if (!isUserLoaded) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-gray-300">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo nếu chưa đăng nhập
  if (!userInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Bạn cần đăng nhập để viết đánh giá
          </h3>
          <p className="text-gray-400 mb-4">
            Vui lòng đăng nhập để có thể chia sẻ đánh giá của bạn về game này.
          </p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Viết đánh giá của bạn
        </h3>
        <div className="text-sm text-gray-400">
          Đăng nhập với tư cách: <span className="text-blue-400 font-medium">{userInfo.username}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Đánh giá của bạn:
          </label>
          <div className="flex items-center space-x-1">
            {renderStarInput()}
            {rating > 0 && (
              <span className="ml-3 text-gray-300 text-sm">
                ({rating} sao)
              </span>
            )}
          </div>
        </div>

        {/* Comment Input */}
        <div className="space-y-2">
          <label 
            htmlFor="comment" 
            className="block text-white font-medium"
          >
            Bình luận:
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về game này..."
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              Tối thiểu 10 ký tự
            </span>
            <span 
              className={`${
                comment.length > 900 
                  ? "text-yellow-400" 
                  : comment.length === 1000 
                  ? "text-red-400" 
                  : "text-gray-400"
              }`}
            >
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/50 border border-red-500 rounded-lg p-3"
          >
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang gửi...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Gửi đánh giá</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

// Export utility function để sử dụng ở component khác
export { getUserFromStorage };
export default ReviewForm;