"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";

interface GameImage {
  image_id: number;
  image_url: string;
  alt_text: string | null;
  order_index: number;
}

interface GameImageGalleryProps {
  images: GameImage[];
}

const GameImageGallery = ({ images }: GameImageGalleryProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.order_index - b.order_index);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      loop: true,
    }
  );

  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
      breakpoints: {
        "(max-width: 768px)": {
          slides: {
            perView: 3,
            spacing: 8,
          },
        },
      },
    }
  );

  const goToSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index);
  };

  const goToPrevious = () => {
    instanceRef.current?.prev();
  };

  const goToNext = () => {
    instanceRef.current?.next();
  };

  if (!sortedImages || sortedImages.length === 0) {
    return (
      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Không có hình ảnh</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Slider */}
      <div className="relative">
        <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
          {sortedImages.map((image, index) => (
            <div key={image.image_id} className="keen-slider__slide">
              <div className="aspect-video relative bg-gray-800">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `Game image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {loaded && instanceRef.current && sortedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Slide Indicator */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {sortedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {sortedImages.length > 1 && (
        <div ref={thumbnailRef} className="keen-slider">
          {sortedImages.map((image, index) => (
            <div key={image.image_id} className="keen-slider__slide">
              <button
                onClick={() => goToSlide(index)}
                className={`w-full aspect-video relative bg-gray-800 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentSlide
                    ? "border-blue-500 opacity-100"
                    : "border-gray-600 opacity-70 hover:opacity-90"
                }`}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameImageGallery;