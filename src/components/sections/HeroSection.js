// src/components/sections/HeroSection.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Users, Award, Star, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollAnimation, setScrollAnimation] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollAnimation(false);
      } else {
        setScrollAnimation(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: Users, value: '200+', label: 'Klien Puas' },
    { icon: Award, value: '500+', label: 'Proyek Selesai' },
    { icon: Star, value: '5 Tahun', label: 'Pengalaman' },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white pt-14">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-8 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">

            {/* Main Heading */}
            <h1
              className={`text-[2.25rem] md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] text-black transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Kontraktor Stand
              <br />
              Pameran <span className="relative inline-block group/highlight whitespace-nowrap">
                <span className="relative z-10 text-black px-2 md:px-3">Berkualitas</span>
                <span className="absolute bottom-0 md:bottom-1 left-2 right-2 h-2.5 md:h-4 bg-red-600 opacity-25 rounded-sm transform transition-all duration-500 group-hover/highlight:opacity-35 group-hover/highlight:h-3 md:group-hover/highlight:h-5"></span>
              </span>
              <br />
              untuk Brand Anda
            </h1>

            {/* Description */}
            <p
              className={`text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Desain kreatif, konstruksi berkualitas, dan eksekusi tepat waktu. NK POL mewujudkan booth pameran impian Anda dengan profesional sejak 2019.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-black text-white text-base font-semibold overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/30 cursor-pointer"
              >
                <span className="relative z-10">Konsultasi Gratis</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </button>

              <Link
                href="/portofolio"
                className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full border-2 border-gray-300 bg-white text-black text-base font-semibold transition-all duration-500 hover:border-black hover:shadow-lg hover:scale-105"
              >
                <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Lihat Portfolio
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-6 mt-10 pt-6 border-t border-gray-200 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center lg:text-left group">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 mb-3 transition-all duration-300 group-hover:bg-black group-hover:shadow-xl group-hover:scale-110">
                      <Icon className="w-6 h-6 text-black transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <div className="text-2xl md:text-2xl lg:text-3xl font-bold text-black mb-1 transition-all duration-300 group-hover:scale-105">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div
              className={`relative max-w-md mx-auto transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-95 rotate-3'
              }`}
            >
              {/* Main Image Container */}
              <div className="relative h-[450px] xl:h-[500px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 group">
                <Image
                  src="/images/hero.jpeg"
                  alt="Kontraktor Stand Pameran Profesional NK POL - Kontraktor Booth Exhibition Jakarta"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Accent Circles */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-red-600 opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gray-100 opacity-50 blur-2xl"></div>
              </div>

              {/* Decorative Frame */}
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-red-600 rounded-3xl opacity-30 -z-10 pointer-events-none"></div>
              <div className="absolute top-8 left-8 w-12 h-12 border border-gray-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}