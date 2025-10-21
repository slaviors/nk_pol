// src/components/sections/ServicesSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Hammer, Palette, PackageOpen, Briefcase, ChevronDown, Store, Repeat } from 'lucide-react';

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sectionRef = useRef(null);
  const mobileCardsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        const scrolled = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight + viewportHeight)));
        
        setScrollProgress(progress);
        
        if (progress < 0.33) {
          setActiveImageIndex(0);
        } else if (progress < 0.66) {
          setActiveImageIndex(1);
        } else {
          setActiveImageIndex(2);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Mobile swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleNext = () => {
    setCurrentMobileIndex((prev) => (prev + 1) % services.length);
  };

  const handlePrev = () => {
    setCurrentMobileIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToSlide = (index) => {
    setCurrentMobileIndex(index);
  };

  const toggleDesktopCard = (index) => {
    setActiveCard(activeCard === index ? null : index);
  };

  const services = [
    {
      icon: Store,
      title: 'Desain Booth & Konsep Pameran',
      description: 'Kami menciptakan desain booth yang kreatif, fungsional, dan sesuai karakter brand Anda untuk menarik perhatian pengunjung.',
    },
    {
      icon: Hammer,
      title: 'Produksi & Konstruksi Booth',
      description: 'Tim teknisi berpengalaman memastikan booth dibangun dengan kualitas tinggi, presisi sempurna, dan tepat waktu.',
    },
    {
      icon: Palette,
      title: 'Dekorasi Event & Area Publik',
      description: 'Menangani dekorasi event, area mall, dan ruang komersial dengan perpaduan estetika dan kebutuhan fungsional.',
    },
    {
      icon: Repeat,
      title: 'Instalasi & Dismantle',
      description: 'Proses pemasangan hingga pembongkaran booth yang cepat, aman, dan efisien dengan koordinasi profesional.',
    },
    {
      icon: PackageOpen,
      title: 'Sewa Perlengkapan Pameran',
      description: 'Menyediakan furniture, display system, lighting, backdrop, dan partisi dengan kualitas terbaik.',
    },
    {
      icon: Briefcase,
      title: 'Manajemen Proyek Pameran',
      description: 'Perencanaan dan koordinasi lengkap mulai dari layout, timeline, hingga pengawasan di lokasi.',
    },
  ];

  const images = [
    {
      src: '/images/service-main.jpg',
      alt: 'NK POL Exhibition Booth - Kontraktor Pameran Profesional',
    },
    {
      src: '/images/service-left.jpg',
      alt: 'NK POL Booth Exhibition Detail',
    },
    {
      src: '/images/service-right.jpg',
      alt: 'NK POL Exhibition Project',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services-section"
      className="relative bg-white py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gray-50 rounded-full blur-3xl opacity-15" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 group cursor-default">
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-black group-hover:text-red-600 mb-4 leading-tight transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Layanan Kami
          </h2>
          <div
            className={`w-20 h-1 bg-red-600 rounded-full mx-auto mb-6 transition-all duration-700 delay-100 group-hover:w-32 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          ></div>
          <p
            className={`text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 group-hover:text-gray-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Sebagai kontraktor pameran terpadu, NK POL menawarkan berbagai layanan yang dirancang untuk membantu klien menampilkan citra terbaik mereka dalam setiap acara dan pameran.
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* LEFT - Service Cards Grid (Desktop) / Stack Carousel (Mobile) */}
          
          {/* Desktop View - Dropdown Accordion */}
          <div className="hidden sm:block space-y-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeCard === index;
              
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <button
                    onClick={() => toggleDesktopCard(index)}
                    className="w-full text-left"
                  >
                    <div
                      className={`relative bg-white rounded-xl border-2 transition-all duration-500 overflow-hidden group ${
                        isActive
                          ? 'border-red-600 shadow-xl'
                          : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {/* Header - Always Visible */}
                      <div className="flex items-center gap-3 p-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-lg transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg scale-110' 
                            : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                        }`}>
                          <Icon className="w-5 h-5 md:w-6 md:h-6" />
                          {/* Pulse effect for active */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-lg bg-red-600  opacity-20" />
                          )}
                        </div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm md:text-base font-bold leading-tight transition-colors duration-300 ${
                            isActive ? 'text-red-600' : 'text-gray-800 group-hover:text-black'
                          }`}>
                            {service.title}
                          </h3>
                          {/* Short preview when closed */}
                          {!isActive && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {service.description}
                            </p>
                          )}
                        </div>

                        {/* Chevron */}
                        <ChevronDown
                          className={`flex-shrink-0 w-5 h-5 transition-all duration-500 ${
                            isActive
                              ? 'text-red-600 rotate-180'
                              : 'text-gray-400 rotate-0 group-hover:text-gray-600'
                          }`}
                        />
                      </div>

                      {/* Expandable Content */}
                      <div
                        className={`transition-all duration-500 ease-in-out ${
                          isActive
                            ? 'max-h-40 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-4 pb-4 border-t border-gray-100">
                          {/* Description */}
                          <p className="text-sm text-gray-600 leading-relaxed pt-3">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Active Bottom Border */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-b-xl" />
                      )}

                      {/* Corner Accent */}
                      {isActive && (
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-600/10 to-transparent rounded-bl-3xl pointer-events-none" />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile View - Dropdown Accordion */}
          <div className="sm:hidden space-y-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeCard === index;
              
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <button
                    onClick={() => toggleDesktopCard(index)}
                    className="w-full text-left"
                  >
                    <div
                      className={`relative bg-white rounded-xl border-2 transition-all duration-500 overflow-hidden ${
                        isActive
                          ? 'border-red-600 shadow-xl'
                          : 'border-gray-200 hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      {/* Header - Always Visible */}
                      <div className="flex items-center gap-3 p-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg scale-110' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                          {/* Pulse effect for active */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-lg bg-red-600  opacity-20" />
                          )}
                        </div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-bold leading-tight transition-colors duration-300 ${
                            isActive ? 'text-red-600' : 'text-gray-800'
                          }`}>
                            {service.title}
                          </h3>
                        </div>

                        {/* Chevron */}
                        <ChevronDown
                          className={`flex-shrink-0 w-4 h-4 transition-all duration-500 ${
                            isActive
                              ? 'text-red-600 rotate-180'
                              : 'text-gray-400 rotate-0'
                          }`}
                        />
                      </div>

                      {/* Expandable Content */}
                      <div
                        className={`transition-all duration-500 ease-in-out ${
                          isActive
                            ? 'max-h-32 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-3 pb-3 border-t border-gray-100">
                          {/* Description */}
                          <p className="text-xs text-gray-600 leading-relaxed pt-2.5">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Active Bottom Border */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-b-xl" />
                      )}

                      {/* Corner Accent */}
                      {isActive && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-600/10 to-transparent rounded-bl-3xl pointer-events-none" />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT - Sticky Image Gallery + CTA */}
          <div
            className={`lg:sticky lg:top-24 lg:self-start space-y-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Image Gallery */}
            <div className="relative h-96 md:h-[28rem] lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
              {images.map((image, index) => {
                let opacity = 0;
                if (index === activeImageIndex) {
                  opacity = 1;
                } else if (index === activeImageIndex - 1 && scrollProgress % 0.33 < 0.5) {
                  opacity = 1 - ((scrollProgress % 0.33) / 0.33) * 2;
                } else if (index === activeImageIndex + 1 && scrollProgress % 0.33 > 0.5) {
                  opacity = ((scrollProgress % 0.33) - 0.165) / 0.165;
                }

                return (
                  <div
                    key={index}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                );
              })}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 z-10" />
              
              {/* Image Counter */}
              <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === activeImageIndex
                        ? 'w-8 bg-white'
                        : 'w-1 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}