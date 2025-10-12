'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryLightbox({ images, selectedImage, onClose, onNavigate }) {
  const currentIndex = selectedImage ? images.findIndex(img => img._id === selectedImage._id) : -1;

  const handleNavigate = useCallback((direction) => {
    if (onNavigate) {
      onNavigate(direction);
    }
  }, [onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        handleNavigate('prev');
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        handleNavigate('next');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.body.style.overflow = 'hidden'; // Prevent scroll
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'auto'; // Restore scroll
    };
  }, [selectedImage, onClose, images.length, handleNavigate]);

  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 z-30 group border border-white/20"
        aria-label="Close"
      >
        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate('prev');
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-30 transition-all duration-300 group border border-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate('next');
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-30 transition-all duration-300 group border border-white/20"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div
        className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={selectedImage.image.url}
            alt={selectedImage.title}
            fill
            className="object-contain p-4"
            priority
          />
        </div>

        {/* Info Bar */}
        <div className="bg-white rounded-2xl mt-4 p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="text-gray-600 mb-4">
                  {selectedImage.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                {selectedImage.year && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="font-medium">{selectedImage.year}</span>
                  </div>
                )}
                {selectedImage.location && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="font-medium">{selectedImage.location}</span>
                  </div>
                )}
                {selectedImage.venue && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="font-medium">{selectedImage.venue}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Counter */}
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-sm font-bold text-gray-900">
                {currentIndex + 1}
              </span>
              <span className="text-sm text-gray-500">/</span>
              <span className="text-sm text-gray-500">{images.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}