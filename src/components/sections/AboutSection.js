// src/components/sections/AboutSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Target, Lightbulb } from 'lucide-react';

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState({});
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

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timings = [200, 300, 400, 500];
    const timers = timings.map((delay, index) =>
      setTimeout(() => {
        setStatsVisible(prev => ({ ...prev, [index]: true }));
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="relative bg-white py-0 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-50 rounded-full blur-3xl opacity-15" />
      </div>

      <div className="relative z-10">
        {/* Hero Image Section - Full Width Horizontal */}
        <div
          className={`relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden transition-all duration-1000 ${
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
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 -mt-32 lg:-mt-40 relative z-20">
            {/* Left - Main Content */}
            <div
              className={`lg:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-8">
                Tentang NK POL
              </h2>
              <div className="w-20 h-1 bg-red-600 rounded-full mb-8"></div>

              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Sejak 2019, NK POL telah menjadi mitra terpercaya dalam menciptakan pengalaman pameran yang berkesan. Kami menggabungkan desain kreatif dengan teknologi terkini untuk booth pameran yang tidak hanya visual stunning tetapi juga fungsional.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Dengan tim desainer dan teknisi profesional, kami berkomitmen menghadirkan solusi pameran terpadu dari konsep hingga instalasi dengan standar kualitas internasional.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '200+', label: 'Klien' },
                  { value: '500+', label: 'Proyek' },
                  { value: '5+', label: 'Tahun' },
                  { value: '100%', label: 'Puas' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-2xl bg-gray-50 hover:bg-black hover:text-white transition-all duration-500 transform ${
                      statsVisible[index]
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90'
                    }`}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-red-600 hover:text-white transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 hover:text-gray-300 transition-colors duration-300 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visi Misi */}
            <div className="space-y-6">
              {/* Visi Card */}
              <div
                className={`group relative overflow-hidden rounded-3xl p-8 bg-white border-2 border-gray-100 hover:border-red-600 shadow-lg transition-all duration-500 cursor-pointer transform ${
                  isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 group-hover:bg-red-600 transition-all duration-300 flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-black group-hover:text-red-600 transition-colors duration-300">
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
                className={`group relative overflow-hidden rounded-3xl p-8 bg-white border-2 border-gray-100 hover:border-red-600 shadow-lg transition-all duration-500 cursor-pointer transform ${
                  isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 group-hover:bg-red-600 transition-all duration-300 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-black group-hover:text-red-600 transition-colors duration-300">
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

        {/* Bottom CTA */}
        <div className="container-custom mt-20">
          <div
            className={`p-12 rounded-3xl bg-gradient-to-r from-black to-gray-900 text-white text-center transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Mewujudkan Pameran Impian?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Hubungi tim kami untuk konsultasi gratis dan solusi booth pameran terbaik untuk brand Anda.
            </p>
            <a
              href="/kontak"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/50 transform hover:scale-105"
            >
              Hubungi Kami
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7m0 0l-7 7m7-7H5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}