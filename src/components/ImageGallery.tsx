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
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {validImages.map((src, index) => (
              <div
                key={src}
                className={`aspect-square overflow-hidden rounded border cursor-pointer transition-all hover:shadow-md ${
                  index === activeIndex 
                    ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg" 
                    : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-contain object-center bg-white transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 lg:p-8">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-6 lg:right-6 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4 transition-all shadow-lg border border-white/20 hover:scale-110"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
          </button>

          {/* Navigation Buttons */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={navigatePrevious}
                className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/35 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4 transition-all shadow-lg border border-white/20 hover:scale-110 hover:border-white/40"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </button>
              <button
                onClick={navigateNext}
                className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/35 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4 transition-all shadow-lg border border-white/20 hover:scale-110 hover:border-white/40"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div 
            className={`relative max-w-[85vw] sm:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] max-h-[70vh] sm:max-h-[85vh] lg:max-h-[90vh] cursor-pointer transition-all duration-500 mx-4 sm:mx-8 lg:mx-16 ${
              isZoomed ? 'scale-125 sm:scale-150 lg:scale-175 xl:scale-200' : 'scale-100'
            } hover:drop-shadow-2xl`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={validImages[activeIndex]}
              alt={`${productName} - Image ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            {/* Zoom indicator for larger screens */}
            <div className="hidden lg:block absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm border border-white/20">
              {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
            </div>
          </div>

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-16 sm:bottom-8 lg:bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full text-sm lg:text-base border border-white/20 shadow-lg">
              <span className="font-medium">{activeIndex + 1}</span>
              <span className="mx-2 opacity-70">/</span>
              <span className="font-medium">{validImages.length}</span>
            </div>
          )}

          {/* Zoom Instruction - Mobile Only */}
          <div className="lg:hidden absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm border border-white/20">
            <span className="hidden sm:inline">Click to {isZoomed ? 'zoom out' : 'zoom in'}</span>
            <span className="sm:hidden">{isZoomed ? 'Zoom out' : 'Zoom in'}</span>
          </div>

          {/* Keyboard Navigation Hint - Desktop Only */}
          <div className="hidden lg:block absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded text-sm border border-white/20">
            <div className="flex items-center space-x-4 text-xs opacity-75">
              <span>ESC: Close</span>
              <span>←→: Navigate</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}