// src/components/sections/ServicesSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Hammer, Palette, Zap, Package, Briefcase } from 'lucide-react';

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
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

  const services = [
    {
      icon: Sparkles,
      title: 'Desain Booth & Konsep Pameran',
      description: 'Desain kreatif dan fungsional yang menarik perhatian serta memperkuat identitas brand Anda.',
      detail: 'Dari ide ke visual yang memukau — kami wujudkan ruang pameran yang bercerita.',
    },
    {
      icon: Hammer,
      title: 'Produksi & Konstruksi Booth',
      description: 'Tim teknisi berpengalaman memastikan konstruksi berkualitas tinggi dan presisi sempurna.',
      detail: 'Ketepatan waktu dan keamanan struktur adalah prioritas kami.',
    },
    {
      icon: Palette,
      title: 'Dekorasi Event & Area Publik',
      description: 'Dekorasi event, mall, dan ruang komersial dengan perpaduan estetika dan fungsionalitas.',
      detail: 'Menciptakan ruang yang hidup dan menarik untuk setiap kebutuhan.',
    },
    {
      icon: Zap,
      title: 'Instalasi & Dismantle',
      description: 'Pemasangan hingga pembongkaran booth yang cepat, aman, dan efisien.',
      detail: 'Koordinasi profesional agar acara berjalan lancar dari awal hingga akhir.',
    },
    {
      icon: Package,
      title: 'Sewa Perlengkapan Pameran',
      description: 'Penyewaan furniture, display system, lighting, backdrop, dan partisi berkualitas.',
      detail: 'Solusi lengkap dalam satu tempat dengan banyak pilihan terbaik.',
    },
    {
      icon: Briefcase,
      title: 'Manajemen Proyek Pameran',
      description: 'Perencanaan dan koordinasi keseluruhan dari layout, timeline, hingga pengawasan lokasi.',
      detail: 'Memastikan setiap detail berjalan sesuai rencana tanpa hambatan.',
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
          
          {/* Desktop View - Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 md:gap-5">
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
                  style={{ transitionDelay: `${index * 80}ms` }}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div
                    className={`relative h-full bg-white rounded-2xl border-2 transition-all duration-500 overflow-hidden group cursor-pointer ${
                      isActive
                        ? 'border-red-600 shadow-2xl -translate-y-2'
                        : 'border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    {/* Card Content */}
                    <div className="p-6 md:p-7 relative z-10">
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl mb-4 transition-all duration-500 ${
                        isActive 
                          ? 'bg-red-600 text-white scale-110' 
                          : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                      }`}>
                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                      </div>

                      {/* Title */}
                      <h3 className={`text-base md:text-lg font-bold mb-2.5 leading-tight transition-colors duration-300 ${
                        isActive ? 'text-red-600' : 'text-gray-800 group-hover:text-black'
                      }`}>
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {service.description}
                      </p>

                      {/* Detail - Shows on hover */}
                      <div className={`transition-all duration-500 ${
                        isActive 
                          ? 'max-h-32 opacity-100 mt-3' 
                          : 'max-h-0 opacity-0 mt-0'
                      }`}>
                        <p className="text-xs md:text-sm text-gray-700 font-medium italic border-l-3 border-red-600 pl-3">
                          {service.detail}
                        </p>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
                    )}

                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent transition-opacity duration-500 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile View - Stack Carousel */}
          <div 
            className="sm:hidden relative"
            ref={mobileCardsRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Cards Stack Container */}
            <div className="relative h-[420px] w-full">
              {services.map((service, index) => {
                const Icon = service.icon;
                const diff = (index - currentMobileIndex + services.length) % services.length;
                
                // Position and styling based on stack position
                let transform = '';
                let opacity = 0;
                let zIndex = 0;
                let scale = 1;
                
                if (diff === 0) {
                  // Current card - front and center
                  transform = 'translateX(0) translateY(0) rotate(0deg)';
                  opacity = 1;
                  zIndex = 30;
                  scale = 1;
                } else if (diff === 1 || diff === services.length - 1) {
                  // Next or previous card - slightly visible behind
                  const direction = diff === 1 ? 1 : -1;
                  transform = `translateX(${direction * 20}px) translateY(10px) rotate(${direction * 2}deg)`;
                  opacity = 0.5;
                  zIndex = 20;
                  scale = 0.95;
                } else {
                  // Other cards - hidden
                  transform = 'translateX(0) translateY(20px)';
                  opacity = 0;
                  zIndex = 10;
                  scale = 0.9;
                }
                
                return (
                  <div
                    key={index}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      transform: `${transform} scale(${scale})`,
                      opacity,
                      zIndex,
                    }}
                  >
                    <div className="h-full bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden relative">
                      {/* Card Content */}
                      <div className="p-7 h-full flex flex-col relative z-10">
                        {/* Icon with animated ring */}
                        <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 bg-gradient-to-br from-red-600 to-red-700 text-white">
                          <Icon className="w-7 h-7" />
                          {/* Animated pulse ring for active card */}
                          {diff === 0 && (
                            <div className="absolute inset-0 rounded-xl bg-red-600 opacity-20" />
                          )}
                        </div>

                        {/* Title with number badge */}
                        <div className="flex items-start gap-3 mb-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                            {index + 1}
                          </span>
                          <h3 className="flex-1 text-lg font-bold leading-tight text-gray-800">
                            {service.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {service.description}
                        </p>

                        {/* Detail with quote style */}
                        <div className="mt-auto relative">
                          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-400 rounded-full" />
                          <p className="text-sm text-gray-700 font-medium italic pl-3">
                            {service.detail}
                          </p>
                        </div>
                      </div>

                      {/* Gradient overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-red-50/30 to-transparent pointer-events-none" />
                      
                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-600/10 to-transparent rounded-bl-3xl" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentMobileIndex
                      ? 'w-8 h-2 bg-red-600'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Swipe Hint (shows on first load) */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                <span>←</span>
                <span>Geser untuk melihat layanan lainnya</span>
                <span>→</span>
              </p>
            </div>
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
                
                <button 
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full bg-white text-red-600 font-bold py-4 px-6 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group-hover:scale-105 cursor-pointer"
                >
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