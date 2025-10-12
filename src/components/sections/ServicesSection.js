// src/components/sections/ServicesSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

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

    // Handle scroll for image transitions
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within section
        const scrolled = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight + viewportHeight)));
        
        setScrollProgress(progress);
        
        // Change image based on scroll progress
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
    handleScroll(); // Initial call

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const services = [
    {
      title: 'Desain Booth & Konsep Pameran',
      description: 'Kami menciptakan desain booth yang kreatif, fungsional, dan sesuai karakter brand Anda. Setiap konsep kami rancang secara detail untuk menarik perhatian pengunjung dan memperkuat identitas merek di setiap pameran.',
      detail: 'Dari ide ke visual yang memukau — kami wujudkan ruang pameran yang bercerita.',
    },
    {
      title: 'Produksi & Konstruksi Booth',
      description: 'NK POL memiliki tim teknisi dan tukang berpengalaman yang memastikan setiap booth dibangun dengan kualitas konstruksi tinggi dan presisi sempurna.',
      detail: 'Kami mengutamakan ketepatan waktu dan keamanan struktur, agar setiap proyek dapat berdiri kokoh dan siap tampil tepat jadwal.',
    },
    {
      title: 'Dekorasi Event & Area Publik',
      description: 'Kami menangani dekorasi event, area mall, dan ruang komersial lainnya. Setiap proyek dikerjakan dengan perpaduan estetika, konsep visual, dan kebutuhan fungsional agar ruang terasa hidup dan menarik.',
      detail: 'Perpaduan estetika dan fungsionalitas untuk event, mall, dan ruang komersial.',
    },
    {
      title: 'Instalasi & Dismantle',
      description: 'Tim kami memastikan proses pemasangan hingga pembongkaran booth (dismantle) berjalan cepat, aman, dan efisien.',
      detail: 'Kami memahami pentingnya waktu dan koordinasi di lapangan — karena itu, setiap tahap kami kelola secara profesional agar acara berjalan lancar dari awal hingga akhir.',
    },
    {
      title: 'Sewa Perlengkapan Pameran',
      description: 'NK POL juga menyediakan layanan penyewaan perlengkapan pameran seperti furniture, display system, lighting, hingga backdrop dan partisi.',
      detail: 'Dengan banyak pilihan dan kualitas peralatan terbaik, kami mempermudah Anda untuk mendapatkan solusi lengkap dalam satu tempat.',
    },
    {
      title: 'Manajemen Proyek Pameran',
      description: 'Kami membantu klien dalam perencanaan dan koordinasi keseluruhan proyek pameran, mulai dari layout area, timeline pekerjaan, hingga pengawasan di lokasi.',
      detail: 'Tujuannya sederhana: agar setiap detail berjalan sesuai rencana dan menghasilkan pameran yang sukses tanpa hambatan.',
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

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

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
          
          {/* LEFT - Accordion Services */}
          <div className="space-y-4">
            {services.map((service, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left group transition-all duration-300"
                  >
                    <div
                      className={`relative bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'border-black shadow-xl'
                          : 'border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-4 p-6 md:p-7">
                        {/* Title */}
                        <h3
                          className={`flex-1 text-lg md:text-xl font-bold leading-tight transition-colors duration-300 ${
                            isOpen ? 'text-black' : 'text-gray-800 group-hover:text-black'
                          }`}
                        >
                          {service.title}
                        </h3>

                        {/* Chevron */}
                        <ChevronDown
                          className={`flex-shrink-0 w-6 h-6 transition-all duration-500 ${
                            isOpen
                              ? 'text-black rotate-180'
                              : 'text-gray-400 rotate-0 group-hover:text-gray-600'
                          }`}
                        />
                      </div>

                      {/* Content - Accordion */}
                      <div
                        className={`transition-all duration-500 ease-in-out ${
                          isOpen
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-7 pb-6 md:pb-7 pt-2 space-y-4 border-t border-gray-100">
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            {service.description}
                          </p>
                          <p className="text-sm md:text-base text-gray-700 font-medium italic border-l-4 border-red-600 pl-4">
                            {service.detail}
                          </p>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {isOpen && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-b-3xl" />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT - Sticky Image Gallery with Fade Transitions */}
          <div
            className={`lg:sticky lg:top-24 lg:self-start transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Image Container with Stacked Images */}
            <div className="relative h-96 md:h-[28rem] lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
              {images.map((image, index) => {
                // Calculate opacity based on active index
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
              
              {/* Image Counter Indicator */}
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