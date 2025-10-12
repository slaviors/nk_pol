"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import GalleryLightbox from "../ui/GalleryLightbox";

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const cacheRef = useRef({
    data: [],
    timestamp: null,
    hash: null,
  });

  const generateHash = (data) => {
    if (!data || data.length === 0) return null;
    return data.map((img) => `${img._id}-${img.title}`).join("|");
  };

  const fetchGalleryImages = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await fetch("/api/public/imageGallery?limit=3", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();

      if (response.ok) {
        let newImages = data.images || [];
        const limitedImages = newImages.slice(0, 3);
        const newHash = generateHash(limitedImages);

        if (newHash !== cacheRef.current.hash || isInitialLoad) {
          setImages(limitedImages);
          cacheRef.current = {
            data: limitedImages,
            timestamp: Date.now(),
            hash: newHash,
          };
        }

        if (error) setError(null);
      } else {
        if (isInitialLoad) {
          setError(data.error || "Failed to load gallery");
        }
      }
    } catch (err) {
      if (isInitialLoad) {
        setError("Network error: " + err.message);
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const refreshInterval = setInterval(() => {
      fetchGalleryImages(false);
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
      observer.disconnect();
    };
  }, []);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = images.findIndex(
      (img) => img._id === selectedImage._id
    );
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }

    setSelectedImage(images[newIndex]);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="animate-pulse bg-gray-200 h-12 md:h-14 lg:h-16 w-3/4 rounded-lg"></div>
              <div className="animate-pulse bg-gray-100 h-6 w-full rounded"></div>
              <div className="animate-pulse bg-gray-100 h-6 w-2/3 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-12 w-48 rounded-full mt-8"></div>
            </div>

            <div className="space-y-4">
              <div className="animate-pulse bg-gray-100 aspect-[16/10] rounded-3xl"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-pulse bg-gray-100 aspect-square rounded-2xl"></div>
                <div className="animate-pulse bg-gray-100 aspect-square rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block p-6 md:p-8 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 font-medium text-base md:text-lg">
                Gagal memuat galeri: {error}
              </p>
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
      <section
        ref={sectionRef}
        id="gallery"
        className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -right-20 w-64 h-64 md:w-80 md:h-80 bg-red-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 -left-20 w-48 h-48 md:w-60 md:h-60 bg-gray-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center">
            {/* Left Side - Content */}
            <div className="opacity-100 translate-x-0">
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 md:mb-6 leading-[1.15]">
                    Portfolio <span className="text-red-600">Terbaik</span> Kami
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                    Koleksi karya stand pameran terbaik yang telah kami selesaikan. Setiap proyek menampilkan dedikasi terhadap inovasi desain dan kualitas konstruksi.
                  </p>
                </div>

                {/* Gallery Highlights */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Beragam industri & jenis acara
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Desain kreatif & eksekusi presisi
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Solusi booth custom & modular
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Kepercayaan klien jangka panjang
                    </span>
                  </div>
                </div>

                {/* Enhanced CTA */}
                <div className="pt-2">
                  <Link
                    href="/portofolio"
                    className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-black text-white text-base font-semibold overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
                  >
                    <span className="relative z-10">Lihat Semua Portfolio</span>
                    <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </Link>
                  <p className="text-sm text-gray-500 mt-3">
                    Temukan inspirasi untuk proyek Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Clean Gallery Layout */}
            <div className="opacity-100 translate-x-0">
              {images && images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Featured Image */}
                  {images[0] && (
                    <div
                      className="group relative bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
                      onClick={() => openLightbox(images[0])}
                    >
                      <div className="relative aspect-[3/2] overflow-hidden">
                        {images[0].image?.url ||
                        images[0].image?.thumbnailUrl ? (
                          <img
                            src={
                              images[0].image?.thumbnailUrl ||
                              images[0].image?.url
                            }
                            alt={images[0].title || "Gallery Image"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <span className="text-gray-300 text-sm">
                              No image
                            </span>
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <div className="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10">
                                <Eye className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Badge */}
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg">
                          Featured
                        </div>

                        {/* Title on hover */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="font-bold text-white text-base line-clamp-1">
                            {images[0].title || "Proyek Unggulan"}
                          </h3>{" "}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Two Small Images Side by Side */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {images[1] && (
                      <div
                        className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
                        onClick={() => openLightbox(images[1])}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          {images[1].image?.url ||
                          images[1].image?.thumbnailUrl ? (
                            <img
                              src={
                                images[1].image?.thumbnailUrl ||
                                images[1].image?.url
                              }
                              alt={images[1].title || "Gallery Image"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                              <span className="text-gray-300 text-xs">
                                No image
                              </span>
                            </div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10">
                                  <Eye className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Title on hover */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="font-semibold text-white text-xs md:text-sm line-clamp-1">
                              {images[1].title || "Proyek Kreatif"}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    {images[2] && (
                      <div
                        className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
                        onClick={() => openLightbox(images[2])}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          {images[2].image?.url ||
                          images[2].image?.thumbnailUrl ? (
                            <img
                              src={
                                images[2].image?.thumbnailUrl ||
                                images[2].image?.url
                              }
                              alt={images[2].title || "Gallery Image"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                              <span className="text-gray-300 text-xs">
                                No image
                              </span>
                            </div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10">
                                  <Eye className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Title on hover */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="font-semibold text-white text-xs md:text-sm line-clamp-1">
                              {images[2].title || "Desain Inovatif"}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <GalleryLightbox
          images={images}
          selectedImage={selectedImage}
          onClose={closeLightbox}
          onNavigate={navigateImage}
        />
      )}

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .container-custom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (min-width: 640px) {
          .container-custom {
            padding: 0 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .container-custom {
            padding: 0 2rem;
          }
        }
      `}</style>
    </>
  );
}