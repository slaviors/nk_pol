'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/imageGallery?limit=4');
      const data = await response.json();
      
      if (response.ok) {
        setImages(data.images || []);
      } else {
        setError(data.error || 'Failed to load gallery');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Gallery fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = images.findIndex(img => img._id === selectedImage._id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    setSelectedImage(images[newIndex]);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>Failed to load gallery: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;   }

  return (
    <>
      <section id="gallery" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Galeri Proyek Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lihat berbagai proyek stand pameran berkualitas yang telah kami kerjakan
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={image._id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.image.thumbnailUrl || image.image.url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                      {image.year && (
                        <p className="text-sm opacity-90">📅 {image.year}</p>
                      )}
                    </div>
                  </div>

                  {/* Position Badge */}
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>

                {/* Card Info (always visible) */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {image.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {image.location && (
                      <span className="flex items-center gap-1">
                        📍 {image.location}
                      </span>
                    )}
                    {image.venue && (
                      <span className="flex items-center gap-1">
                        🏢 {image.venue}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light z-10"
            aria-label="Close"
          >
            ×
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 text-white hover:text-gray-300 text-5xl font-light z-10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 text-white hover:text-gray-300 text-5xl font-light z-10"
              aria-label="Next"
            >
              ›
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={selectedImage.image.url}
                alt={selectedImage.title}
                width={selectedImage.image.width || 1200}
                height={selectedImage.image.height || 800}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="bg-white rounded-b-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="text-gray-600 mb-4">
                  {selectedImage.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {selectedImage.year && (
                  <span className="flex items-center gap-1">
                    📅 Year: {selectedImage.year}
                  </span>
                )}
                {selectedImage.location && (
                  <span className="flex items-center gap-1">
                    📍 Location: {selectedImage.location}
                  </span>
                )}
                {selectedImage.venue && (
                  <span className="flex items-center gap-1">
                    🏢 Venue: {selectedImage.venue}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
