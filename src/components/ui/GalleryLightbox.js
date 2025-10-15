'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryLightbox({ images, selectedImage, onClose, onNavigate }) {
  const currentIndex = selectedImage ? images.findIndex(post => post._id === selectedImage._id) : -1;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const postImages = selectedImage?.images || [];

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedImage?._id]);

  const handleNavigatePost = useCallback((direction) => {
    if (onNavigate) {
      onNavigate(direction);
    }
  }, [onNavigate]);

  const handleNavigateImage = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % postImages.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + postImages.length) % postImages.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (postImages.length > 1) {
          handleNavigateImage('prev');
        }
      } else if (e.key === 'ArrowRight') {
        if (postImages.length > 1) {
          handleNavigateImage('next');
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.body.style.overflow = 'hidden'; // Prevent scroll
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'auto'; // Restore scroll
    };
  }, [selectedImage, onClose, postImages.length, selectedImageIndex]);

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

      {/* Navigation Buttons - Between Posts */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigatePost('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-30 transition-all duration-300 group border border-white/20"
            aria-label="Previous Post"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigatePost('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-30 transition-all duration-300 group border border-white/20"
            aria-label="Next Post"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div
        className="relative w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image Display */}
        <div className="relative flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl mb-4">
          {postImages.length > 0 && postImages[selectedImageIndex] && (
            <Image
              src={postImages[selectedImageIndex].url}
              alt={`${selectedImage.title} - Image ${selectedImageIndex + 1}`}
              fill
              className="object-contain p-4"
              priority
            />
          )}
        </div>

        {/* Thumbnail Grid - Show all 4 images */}
        {postImages.length > 1 && (
          <div className="bg-white rounded-2xl p-4 shadow-xl mb-4">
            <div className={`grid gap-3 ${
              postImages.length === 2 ? 'grid-cols-2' :
              postImages.length === 3 ? 'grid-cols-3' :
              'grid-cols-4'
            }`}>
              {postImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedImageIndex === idx
                      ? 'ring-4 ring-red-600 scale-105'
                      : 'ring-2 ring-gray-200 hover:ring-red-400 hover:scale-105'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.thumbnailUrl || img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge for selected */}
                  {selectedImageIndex === idx && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {idx + 1}
                    </div>
                  )}
                  {/* Badge for thumbnail indicator */}
                  {idx === selectedImage.thumbnailIndex && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Thumbnail
                    </div>
                  )}
                </button>
              ))}
            </div>
            {postImages.length > 1 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Click thumbnails or use arrow keys to navigate • {selectedImageIndex + 1} of {postImages.length}
              </p>
            )}
          </div>
        )}

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