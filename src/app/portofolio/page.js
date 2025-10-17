'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Building2, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PortofolioPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/galleryPost');
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || 'Failed to load portfolio');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (post) => {
    setSelectedPost(post);
    setCurrentImageIndex(post.thumbnailIndex || 0);
  };

  const closeLightbox = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedPost && selectedPost.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedPost.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedPost && selectedPost.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedPost.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPost) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost, currentImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-32"></div>
              <div className="h-12 bg-gray-700 rounded w-64"></div>
              <div className="h-6 bg-gray-700 rounded w-96"></div>
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-2xl"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="inline-block p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
            <p className="text-red-600 font-semibold text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 md:py-24 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back Button */}
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali ke Beranda</span>
            </Link>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Portfolio <span className="text-red-600">Kami</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
                Koleksi lengkap proyek stand pameran terbaik yang telah kami selesaikan. 
                Setiap proyek mencerminkan dedikasi kami terhadap inovasi desain dan kualitas konstruksi.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {posts.length} Proyek
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-gray-50 border-2 border-gray-200 rounded-2xl">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Portfolio</h3>
                <p className="text-gray-600">Portfolio akan ditampilkan di sini</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="group cursor-pointer"
                  style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                  onClick={() => openLightbox(post)}
                >
                  {/* Image Card */}
                  <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {post.images && post.images.length > 0 ? (
                        <img
                          src={
                            post.images[post.thumbnailIndex || 0]?.thumbnailUrl ||
                            post.images[post.thumbnailIndex || 0]?.url
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-gray-600" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10">
                              <Eye className="w-7 h-7 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Image Count Badge */}
                        {post.images && post.images.length > 1 && (
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                            {post.images.length} Foto
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4 space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {post.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      {post.year && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {post.year}
                        </span>
                      )}
                      {post.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {post.location}
                        </span>
                      )}
                      {post.venue && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          {post.venue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal - White Theme */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Modal Container */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 pr-12">
                  {selectedPost.title}
                </h2>
                {selectedPost.images && selectedPost.images.length > 1 && (
                  <p className="text-sm font-semibold text-red-600">
                    {currentImageIndex + 1} / {selectedPost.images.length}
                  </p>
                )}
              </div>

              {/* Image Area */}
              <div className="relative mb-6">
                {/* Main Image */}
                <div className="relative bg-gray-100 rounded-xl overflow-hidden canvas-bg">
                  {selectedPost.images && selectedPost.images[currentImageIndex] && (
                    <img
                      src={selectedPost.images[currentImageIndex].url}
                      alt={`${selectedPost.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '50vh' }}
                    />
                  )}
                </div>

                {/* Navigation Buttons - Outside image container */}
                {selectedPost.images && selectedPost.images.length > 1 && (
                  <>
                    {/* Previous Button - Hidden on first image */}
                    {currentImageIndex > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white hover:bg-red-600 hover:text-white rounded-full shadow-xl transition-all border-2 border-gray-200 hover:border-red-600"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    
                    {/* Next Button - Hidden on last image */}
                    {currentImageIndex < selectedPost.images.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white hover:bg-red-600 hover:text-white rounded-full shadow-xl transition-all border-2 border-gray-200 hover:border-red-600"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {selectedPost.images && selectedPost.images.length > 1 && (
                <div className="mb-6 relative">
                  {/* Gradient fade effect on right side */}
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                  
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pr-8">
                    {selectedPost.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-red-600 ring-4 ring-red-100 scale-105'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <img
                          src={img.thumbnailUrl || img.url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedPost.description && (
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {selectedPost.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-2 text-sm">
                {selectedPost.year && (
                  <span className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                    <Calendar className="w-4 h-4 text-red-600" />
                    {selectedPost.year}
                  </span>
                )}
                {selectedPost.location && (
                  <span className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                    <MapPin className="w-4 h-4 text-red-600" />
                    {selectedPost.location}
                  </span>
                )}
                {selectedPost.venue && (
                  <span className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                    <Building2 className="w-4 h-4 text-red-600" />
                    {selectedPost.venue}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations & Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .canvas-bg {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: -1px -1px;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
