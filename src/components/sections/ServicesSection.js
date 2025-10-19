// src/components/sections/ServicesSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Hammer, Palette, Zap, Package, Briefcase, ChevronDown } from 'lucide-react';

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
      icon: Sparkles,
      title: 'Desain Booth & Konsep Pameran',
      description: 'Kami menciptakan desain booth yang kreatif, fungsional, dan sesuai karakter brand Anda. Setiap konsep kami rancang secara detail untuk menarik perhatian pengunjung dan memperkuat identitas merek di setiap pameran. Dari ide ke visual yang memukau — kami wujudkan ruang pameran yang bercerita.',
    },
    {
      icon: Hammer,
      title: 'Produksi & Konstruksi Booth',
      description: 'NK POL memiliki tim teknisi dan tukang berpengalaman yang memastikan setiap booth dibangun dengan kualitas konstruksi tinggi dan presisi sempurna. Kami mengutamakan ketepatan waktu dan keamanan struktur, agar setiap proyek dapat berdiri kokoh dan siap tampil tepat jadwal.',
    },
    {
      icon: Palette,
      title: 'Dekorasi Event & Area Publik',
      description: 'Kami juga menangani dekorasi event, area mall, dan ruang komersial lainnya. Setiap proyek dikerjakan dengan perpaduan estetika, konsep visual, dan kebutuhan fungsional agar ruang terasa hidup dan menarik.',
    },
    {
      icon: Zap,
      title: 'Instalasi & Dismantle',
      description: 'Tim kami memastikan proses pemasangan hingga pembongkaran booth (dismantle) berjalan cepat, aman, dan efisien. Kami memahami pentingnya waktu dan koordinasi di lapangan — karena itu, setiap tahap kami kelola secara profesional agar acara berjalan lancar dari awal hingga akhir.',
    },
    {
      icon: Package,
      title: 'Sewa Perlengkapan Pameran',
      description: 'NK POL juga menyediakan layanan penyewaan perlengkapan pameran seperti furniture, display system, lighting, hingga backdrop dan partisi. Dengan banyak pilihan dan kualitas peralatan terbaik, kami mempermudah Anda untuk mendapatkan solusi lengkap dalam satu tempat.',
    },
    {
      icon: Briefcase,
      title: 'Manajemen Proyek Pameran',
      description: 'Kami membantu klien dalam perencanaan dan koordinasi keseluruhan proyek pameran, mulai dari layout area, timeline pekerjaan, hingga pengawasan di lokasi. Tujuannya sederhana: agar setiap detail berjalan sesuai rencana dan menghasilkan pameran yang sukses tanpa hambatan.',
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
          <div className="hidden sm:block space-y-3">
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
                      className={`relative bg-white rounded-2xl border-2 transition-all duration-500 overflow-hidden group ${
                        isActive
                          ? 'border-red-600 shadow-2xl'
                          : 'border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {/* Header - Always Visible */}
                      <div className="flex items-center gap-4 p-5 md:p-6">
                        {/* Icon */}
                        <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg scale-110' 
                            : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                        }`}>
                          <Icon className="w-6 h-6 md:w-7 md:h-7" />
                          {/* Pulse effect for active */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-red-600  opacity-20" />
                          )}
                        </div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base md:text-lg font-bold leading-tight transition-colors duration-300 mb-1 ${
                            isActive ? 'text-red-600' : 'text-gray-800 group-hover:text-black'
                          }`}>
                            {service.title}
                          </h3>
                          {/* Short preview when closed */}
                          {!isActive && (
                            <p className="text-xs md:text-sm text-gray-500 line-clamp-1">
                              {service.description}
                            </p>
                          )}
                        </div>

                        {/* Chevron */}
                        <ChevronDown
                          className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 transition-all duration-500 ${
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
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-gray-100">
                          {/* Description */}
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed pt-4">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Active Bottom Border */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-b-2xl" />
                      )}

                      {/* Corner Accent */}
                      {isActive && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/10 to-transparent rounded-bl-3xl pointer-events-none" />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile View - Dropdown Accordion */}
          <div className="sm:hidden space-y-3">
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
                      className={`relative bg-white rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
                        isActive
                          ? 'border-red-600 shadow-2xl'
                          : 'border-gray-200 hover:border-gray-300 shadow-md'
                      }`}
                    >
                      {/* Header - Always Visible */}
                      <div className="flex items-center gap-3 p-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg scale-110' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                          {/* Pulse effect for active */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-red-600  opacity-20" />
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
                          className={`flex-shrink-0 w-5 h-5 transition-all duration-500 ${
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
                            ? 'max-h-96 opacity-100'
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
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-b-2xl" />
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

            {/* CTA Card */}
            <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 md:p-10 overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-500">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  Siap Wujudkan Booth Impian Anda?
                </h3>
                <p className="text-red-50 text-sm md:text-base mb-6 leading-relaxed">
                  Konsultasikan kebutuhan pameran Anda dengan tim profesional kami. Kami siap membantu dari konsep hingga eksekusi.
                </p>
                
                <button className="w-full bg-white text-red-600 font-bold py-4 px-6 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group-hover:scale-105">
                  Hubungi Kami Sekarang
                </button>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-red-800 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}