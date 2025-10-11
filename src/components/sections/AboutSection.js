// src/components/sections/AboutSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Target, Lightbulb } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="relative bg-white py-0 pb-12 md:pb-14 lg:pb-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-50 rounded-full blur-3xl opacity-15" />
      </div>

      <div className="relative z-10">
        {/* Hero Image Section - Full Width Horizontal */}
        <div
          className={`relative w-full h-64 md:h-80 lg:h-96 overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/images/home.jpeg"
            alt="Tim Profesional NK POL - Kontraktor Pameran Jakarta"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>

        {/* Content Section */}
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 -mt-20 lg:-mt-24 relative z-20">
            {/* Left - Main Content */}
            <div
              className={`group lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-gray-100 hover:border-red-300 transition-all duration-700 cursor-pointer transform hover:scale-[1.02] hover:shadow-3xl relative overflow-hidden ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              
              {/* Logo at top right - Mobile */}
              <div className="absolute top-4 right-4 z-10 md:hidden">
                <Logo width={80} height={26} />
              </div>
              
              {/* Logo at top right - Desktop */}
              <div className="absolute md:top-8 md:right-8 lg:top-6 lg:right-10 z-10 hidden md:block">
                <Logo width={100} height={33} />
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-red-100 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0" />
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-red-200 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-700 transform -translate-x-4 group-hover:translate-x-0" />

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black group-hover:text-red-600 leading-tight mb-5 transition-colors duration-500 pr-20 md:pr-0">
                Tentang NK POL
              </h2>
              <div className="w-20 h-1 bg-red-600 rounded-full mb-5 group-hover:w-32 transition-all duration-500"></div>

              <p className="text-base md:text-lg text-gray-600 group-hover:text-gray-700 leading-relaxed mb-4 transition-colors duration-300">
                Sejak <span className="relative">
                  <span className="relative z-10">2019</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span>, NK POL telah menjadi <span className="relative">
                  <span className="relative z-10">mitra terpercaya</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span> dalam menciptakan <span className="relative">
                  <span className="relative z-10">pengalaman pameran yang berkesan</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-900 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span>. Kami menggabungkan <span className="relative">
                  <span className="relative z-10">desain kreatif</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-600 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span> dengan <span className="relative">
                  <span className="relative z-10">teknologi terkini</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-800 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span> untuk booth pameran yang <span className="relative">
                  <span className="relative z-10">fungsional</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-1000 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span>.
              </p>

              <p className="text-base md:text-lg text-gray-600 group-hover:text-gray-700 leading-relaxed mb-6 transition-colors duration-300">
                Dengan <span className="relative">
                  <span className="relative z-10">tim profesional</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span>, kami berkomitmen menghadirkan <span className="relative">
                  <span className="relative z-10">solusi terpadu</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span> dari <span className="relative">
                  <span className="relative z-10">konsep hingga instalasi</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-900 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span> dengan <span className="relative">
                  <span className="relative z-10">standar internasional</span>
                  <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-1100 rounded-md scale-0 group-hover:scale-100 transform origin-center"></span>
                </span>.
              </p>
              
              {/* Hover indicator */}
              <div className="absolute bottom-0 right-0 w-0 h-0 bg-red-100 transition-all duration-500 group-hover:w-20 group-hover:h-20 rounded-tl-3xl" />
            </div>

            {/* Right - Visi Misi */}
            <div className="space-y-5">
              {/* Visi Card */}
              <div
                className={`group relative overflow-hidden rounded-3xl p-6 bg-white border-2 border-gray-100 hover:border-red-600 shadow-lg transition-all duration-500 cursor-pointer transform ${
                  isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 group-hover:bg-red-600 transition-all duration-300 flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-black group-hover:text-red-600 transition-colors duration-300">
                    Visi
                  </h3>
                </div>

                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  Menjadi mitra terpercaya dalam mewujudkan pameran berkesan dan bernilai tinggi melalui inovasi kreatif dan komitmen kepuasan pelanggan.
                </p>

                <div className="absolute bottom-0 right-0 w-0 h-0 bg-red-50 transition-all duration-500 group-hover:w-16 group-hover:h-16 rounded-tl-3xl" />
              </div>

              {/* Misi Card */}
              <div
                className={`group relative overflow-hidden rounded-3xl p-6 bg-white border-2 border-gray-100 hover:border-red-600 shadow-lg transition-all duration-500 cursor-pointer transform ${
                  isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 group-hover:bg-red-600 transition-all duration-300 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-black group-hover:text-red-600 transition-colors duration-300">
                    Misi
                  </h3>
                </div>

                <ul className="space-y-2">
                  {[
                    'Desain inovatif sesuai brand',
                    'Layanan terpadu berkualitas',
                    'Ketepatan waktu profesional',
                    'Hubungan jangka panjang',
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 ${
                        isVisible
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 translate-x-4'
                      }`}
                      style={{ transitionDelay: `${500 + idx * 75}ms` }}
                    >
                      <span className="text-red-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="absolute bottom-0 right-0 w-0 h-0 bg-red-50 transition-all duration-500 group-hover:w-16 group-hover:h-16 rounded-tl-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}