"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  initialIndex?: number;
}

export default function ImageGallery({ images, productName, initialIndex = 0 }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const validImages = images.filter(src => /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(src));
  
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          navigatePrevious();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, activeIndex]);

  const navigateNext = () => {
    setActiveIndex((prev) => (prev + 1) % validImages.length);
    setIsZoomed(false);
  };

  const navigatePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    setIsZoomed(false);
  };

  const openFullscreen = (index?: number) => {
    if (index !== undefined) setActiveIndex(index);
    setIsFullscreen(true);
    setIsZoomed(false);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsZoomed(false);
  };

  if (validImages.length === 0) {
    return (
      <div className="aspect-[4/3] flex items-center justify-center bg-muted text-muted-foreground rounded-lg border">
        No images available
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="aspect-[4/3] overflow-hidden rounded-lg border bg-white cursor-pointer group relative"
          onClick={() => openFullscreen()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={validImages[activeIndex]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Zoom Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <ZoomIn className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {validImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {validImages.map((src, index) => (
              <div
                key={src}
                className={`aspect-square overflow-hidden rounded border cursor-pointer transition-all ${
                  index === activeIndex 
                    ? "ring-2 ring-blue-500 ring-offset-2" 
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-contain object-center bg-white"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={navigatePrevious}
                className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              <button
                onClick={navigateNext}
                className="absolute right-16 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div 
            className={`relative max-w-[90vw] max-h-[90vh] cursor-pointer transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={validImages[activeIndex]}
              alt={`${productName} - Image ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {activeIndex + 1} / {validImages.length}
            </div>
          )}

          {/* Zoom Instruction */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded text-sm">
            Click to {isZoomed ? 'zoom out' : 'zoom in'}
          </div>
        </div>
      )}
    </>
  );
}