'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cacheRef = useRef({
    data: [],
    timestamp: null,
    hash: null
  });

  const generateHash = (data) => {
    if (!data || data.length === 0) return null;
    return data.map(img => `${img._id}-${img.title}`).join('|');
  };

  const fetchGalleryImages = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await fetch('/api/public/imageGallery?limit=4', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const newImages = data.images || [];
        const newHash = generateHash(newImages);

        if (newHash !== cacheRef.current.hash) {
          console.log('📝 Gallery data updated - refreshing display');
          setImages(newImages);

          cacheRef.current = {
            data: newImages,
            timestamp: Date.now(),
            hash: newHash
          };
        } else {
          console.log('✓ Gallery data unchanged - using cache');
        }
        
        if (error) setError(null);
      } else {
        if (isInitialLoad) {
          setError(data.error || 'Failed to load gallery');
        }
      }
    } catch (err) {
      console.error('Gallery fetch error:', err);
      if (isInitialLoad) {
        setError('Network error: ' + err.message);
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages(true);

    const refreshInterval = setInterval(() => {
      fetchGalleryImages(false); 
    }, 30000); 

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-900 font-medium tracking-wide">LOADING GALLERY</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block p-6 bg-red-50 border-2 border-red-600 rounded-lg">
              <p className="text-red-600 font-medium">Failed to load gallery: {error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <section id="gallery" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Grid Lines Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-600 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-black opacity-5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="inline-block w-12 h-1 bg-red-600 rounded"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Galeri <span className="text-red-600">Proyek</span> Kami
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Koleksi stand pameran berkualitas premium yang telah kami wujudkan dengan sempurna
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {images.map((image, index) => (
              <div
                key={image._id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                onClick={() => openLightbox(image)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={image.image.thumbnailUrl || image.image.url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-red-600 text-white font-bold flex items-center justify-center rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>

                  {/* Red accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-700"></div>
                </div>

                {/* Info Card */}
                <div className="p-4 md:p-6 bg-white">
                  <h3 className="font-bold text-base md:text-xl text-gray-900 mb-2 md:mb-3 line-clamp-1 group-hover:text-red-600 transition-colors duration-300">
                    {image.title}
                  </h3>
                  
                  {image.description && (
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3 md:mb-4 leading-relaxed">
                      {image.description}
                    </p>
                  )}
                  
                  <div className="space-y-1.5 md:space-y-2 text-xs text-gray-500">
                    {image.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">📍</span>
                        <span className="font-medium">{image.location}</span>
                      </div>
                    )}
                    {image.venue && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">🏢</span>
                        <span className="font-medium">{image.venue}</span>
                      </div>
                    )}
                    {image.year && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">📅</span>
                        <span className="font-medium">{image.year}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 backdrop-blur-md animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-black/80 to-transparent z-30 flex items-center justify-between px-3 md:px-8">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Counter Badge */}
              <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/20">
                <span className="text-white font-bold text-xs md:text-sm">
                  {images.findIndex(img => img._id === selectedImage._id) + 1}
                </span>
                <span className="text-white/60 text-xs md:text-sm">/</span>
                <span className="text-white/60 text-xs md:text-sm">{images.length}</span>
              </div>
              
              {/* Title (Desktop only) */}
              <h3 className="hidden md:block text-white font-semibold text-lg max-w-md truncate">
                {selectedImage.title}
              </h3>
            </div>

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 backdrop-blur-sm border border-white/20 group"
              aria-label="Close"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex h-full items-center justify-center p-8 pt-8">
            {/* Navigation Buttons - Desktop */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-30 transition-all duration-300 backdrop-blur-sm hover:scale-110 border border-white/20 group"
                  aria-label="Previous"
                >
                  <svg className="w-8 h-8 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-30 transition-all duration-300 backdrop-blur-sm hover:scale-110 border border-white/20 group"
                  aria-label="Next"
                >
                  <svg className="w-8 h-8 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Container - Desktop */}
            <div
              className="relative w-3/5 lg:w-2/3 h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-black/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 shadow-2xl">
                <Image
                  src={selectedImage.image.url}
                  alt={selectedImage.title}
                  fill
                  className="object-contain p-4"
                />
                
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-600 rounded-tl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-600 rounded-br-2xl"></div>
                
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Info Sidebar - Desktop */}
            <div
              className="w-2/5 lg:w-1/3 h-[85vh] ml-6 lg:ml-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-black p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 opacity-20 rounded-full blur-3xl"></div>
                  <h3 className="text-3xl font-bold text-white relative z-10 leading-tight">
                    {selectedImage.title}
                  </h3>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                  {selectedImage.description && (
                    <div className="mb-8">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Description</h4>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {selectedImage.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Project Details</h4>
                    
                    {selectedImage.year && (
                      <div className="group">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors duration-300 border-l-4 border-red-600">
                          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-white text-lg">📅</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Year</div>
                            <div className="text-lg font-bold text-gray-900">{selectedImage.year}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedImage.location && (
                      <div className="group">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors duration-300 border-l-4 border-gray-900">
                          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-white text-lg">📍</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Location</div>
                            <div className="text-lg font-bold text-gray-900 break-words">{selectedImage.location}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedImage.venue && (
                      <div className="group">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors duration-300 border-l-4 border-gray-900">
                          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-white text-lg">🏢</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Venue</div>
                            <div className="text-lg font-bold text-gray-900 break-words">{selectedImage.venue}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Project Gallery</span>
                    <div className="flex gap-1">
                      {images.map((img) => (
                        <div
                          key={img._id}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            img._id === selectedImage._id 
                              ? 'w-8 bg-red-600' 
                              : 'w-2 bg-gray-300'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-full pt-16" onClick={(e) => e.stopPropagation()}>
            {/* Image Section - Mobile */}
            <div className="relative flex-shrink-0 h-[45vh] px-3 pt-2 pb-4">
              <div className="relative w-full h-full bg-black/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 shadow-2xl">
                <Image
                  src={selectedImage.image.url}
                  alt={selectedImage.title}
                  fill
                  className="object-contain p-3"
                  priority
                />
                
                {/* Red accent corners - Mobile */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-600 rounded-tl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-600 rounded-br-2xl"></div>
                
                {/* Navigation Buttons - Mobile (overlaid on image) */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                      aria-label="Previous"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                      aria-label="Next"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Progress Indicator - Mobile */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {images.map((img) => (
                    <div
                      key={img._id}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        img._id === selectedImage._id 
                          ? 'w-6 bg-red-600' 
                          : 'w-1.5 bg-white/60'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Section - Mobile (Scrollable) */}
            <div className="flex-1 overflow-y-auto bg-white rounded-t-3xl shadow-2xl">
              {/* Handle Bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="px-5 pb-6">
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {selectedImage.title}
                </h3>

                {/* Description */}
                {selectedImage.description && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedImage.description}
                    </p>
                  </div>
                )}

                {/* Project Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Project Details</h4>
                  
                  {selectedImage.year && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-transparent rounded-xl border-l-4 border-red-600">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base">📅</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Year</div>
                        <div className="text-base font-bold text-gray-900">{selectedImage.year}</div>
                      </div>
                    </div>
                  )}
                  
                  {selectedImage.location && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-xl border-l-4 border-gray-900">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base">📍</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Location</div>
                        <div className="text-base font-bold text-gray-900 break-words">{selectedImage.location}</div>
                      </div>
                    </div>
                  )}
                  
                  {selectedImage.venue && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-xl border-l-4 border-gray-900">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-base">🏢</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Venue</div>
                        <div className="text-base font-bold text-gray-900 break-words">{selectedImage.venue}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Hint (Desktop only) */}
          <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">←</kbd>
                <span>Previous</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">→</kbd>
                <span>Next</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">ESC</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}