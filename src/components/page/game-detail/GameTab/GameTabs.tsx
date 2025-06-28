"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GameDetail } from "@/types/game";
import { CreateReviewDto } from "@/types/review";
import ReviewForm, { getUserFromStorage } from "./ReviewForm";
import ReviewList from "./ReviewList";

interface GameTabsProps {
  game: GameDetail;
  onReviewSubmit?: (reviewData: CreateReviewDto) => Promise<void>;
}

interface UserInfo {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

const GameTabs = ({ 
  game, 
  onReviewSubmit 
}: GameTabsProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Lấy thông tin user một lần khi component mount
  useEffect(() => {
    const userData = getUserFromStorage();
    setUserInfo(userData);
    setIsUserLoaded(true);
  }, []);

  // Kiểm tra xem mô tả có dài hơn 10 dòng không
  useEffect(() => {
    if (descriptionRef.current && game.description) {
      const element = descriptionRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 10; // 10 dòng
      
      if (element.scrollHeight > maxHeight) {
        setShowToggle(true);
      }
    }
  }, [game.description]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleReviewSubmit = async (reviewData: CreateReviewDto) => {
    if (!onReviewSubmit) return;
    
    setIsSubmittingReview(true);
    try {
      await onReviewSubmit(reviewData);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Kiểm tra user đã đánh giá chưa - sử dụng user_id thay vì username
  const hasUserReviewed = userInfo && game.reviews?.some(
    review => review.user.username === userInfo.username
  );

  const shouldShowReviewForm = isUserLoaded && userInfo && !hasUserReviewed && onReviewSubmit;
  const shouldShowLoginPrompt = isUserLoaded && !userInfo;
  const shouldShowAlreadyReviewed = isUserLoaded && userInfo && hasUserReviewed;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "description"
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Mô tả
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "reviews"
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Đánh giá ({game.reviews?.length || 0})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "description" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Game Description */}
            <div className="relative">
              <p 
                ref={descriptionRef}
                className={`text-gray-100 leading-relaxed text-base text-justify transition-all duration-300 overflow-hidden ${
                  !isExpanded && showToggle 
                    ? 'line-clamp-10' 
                    : ''
                }`}
                style={{
                  maxHeight: !isExpanded && showToggle ? '14rem' : 'none',
                  WebkitLineClamp: !isExpanded && showToggle ? 10 : 'unset',
                  WebkitBoxOrient: 'vertical',
                  display: !isExpanded && showToggle ? '-webkit-box' : 'block'
                }}
              >
                {game.description || "Chưa có mô tả cho game này."}
              </p>
              
              {/* Gradient overlay khi thu gọn */}
              {!isExpanded && showToggle && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
              )}
              
              {/* Nút xem thêm/thu gọn */}
              {showToggle && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>

            {/* Divider */}
            <hr className="border-gray-700" />

            {/* Game Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Ngày phát hành:
                  </h4>
                  <p className="text-gray-400">
                    {formatDate(game.release_date)}
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Nhà phát triển:
                  </h4>
                  <p className="text-gray-400">{game.developer}</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Nhà xuất bản:
                  </h4>
                  <p className="text-gray-400">{game.publisher}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Thể loại */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Thể loại:</h4>
                  <div className="flex flex-wrap gap-2">
                    {game.game_genres?.length > 0 ? (
                      game.game_genres.map((gg) => (
                        <span
                          key={gg.genre_id}
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {gg.genre.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Chưa phân loại
                      </span>
                    )}
                  </div>
                </div>

                {/* Nền tảng */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Nền tảng:</h4>
                  <div className="flex flex-wrap gap-2 uppercase">
                    {game.game_platforms?.length > 0 ? (
                      game.game_platforms.map((gp) => (
                        <span
                          key={gp.platform_id}
                          className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          {gp.platform.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm normal-case">
                        Chưa có thông tin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Loading state cho user info */}
            {!isUserLoaded && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-gray-300">Đang kiểm tra thông tin đăng nhập...</span>
                </div>
              </div>
            )}

            {/* Review Form - Chỉ hiển thị nếu user đã đăng nhập và chưa đánh giá */}
            {shouldShowReviewForm && (
              <ReviewForm
                gameId={game.game_id}
                onSubmit={handleReviewSubmit}
                isSubmitting={isSubmittingReview}
                userInfo={userInfo}
              />
            )}

            {/* Thông báo nếu user chưa đăng nhập */}
            {shouldShowLoginPrompt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-200 mb-2">
                    Đăng nhập để viết đánh giá
                  </h3>
                  <p className="text-blue-300 mb-4">
                    Chia sẻ trải nghiệm của bạn về game này với cộng đồng
                  </p>
                  <button
                    onClick={() => window.location.href = '/auth/login'}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              </motion.div>
            )}

            {/* Thông báo nếu user đã đánh giá */}
            {shouldShowAlreadyReviewed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/30 border border-green-500/50 rounded-lg p-4"
              >
                <p className="text-green-200 text-center font-medium">
                  ✓ Bạn đã đánh giá game này. Cảm ơn bạn đã chia sẻ!
                </p>
              </motion.div>
            )}

            {/* Reviews List */}
            <ReviewList reviews={game.reviews || []} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GameTabs;