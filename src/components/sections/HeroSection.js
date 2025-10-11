// src/components/sections/HeroSection.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Users, Award, Star } from 'lucide-react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { icon: Users, value: '200+', label: 'Klien Puas' },
    { icon: Award, value: '500+', label: 'Proyek Selesai' },
    { icon: Star, value: '5 Tahun', label: 'Pengalaman' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Red Accent Elements - Separated from black */}
        <div className="absolute top-0 right-1/4 w-1 h-32 bg-gradient-to-b from-red-600 to-transparent opacity-60 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-1 bg-gradient-to-l from-red-600 to-transparent opacity-60" />
        <div className="absolute top-1/2 left-0 w-16 h-1 bg-gradient-to-r from-red-600 to-transparent opacity-60" />

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

      <div className="container-custom relative z-10 py-20 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div
              className={`hidden lg:inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-black text-sm font-semibold shadow-lg transition-all duration-700 hover:shadow-xl hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              Kontraktor Pameran Terpercaya
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-black transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Wujudkan Stand
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-black">Pameran</span>
                  <span className="absolute bottom-2 left-0 right-0 h-4 bg-red-600 opacity-20 -rotate-1 rounded-lg"></span>
                </span>
                <br />
                yang Berkesan
              </h1>
            </div>

            {/* Description */}
            <p
              className={`text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              NK POL adalah kontraktor pameran profesional sejak 2019 yang menghadirkan desain kreatif, konstruksi berkualitas tinggi, dan eksekusi tepat waktu untuk setiap event Anda di seluruh Indonesia.
            </p>

            {/* CTA Buttons*/}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link
                href="/kontak"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-black text-white text-base font-semibold overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
              >
                <span className="relative z-10">Konsultasi Gratis</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </Link>

              <Link
                href="/portofolio"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-gray-300 bg-white text-black text-base font-semibold transition-all duration-500 hover:border-black hover:shadow-lg hover:scale-105"
              >
                <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Lihat Portfolio
              </Link>
            </div>

            {/* Stats*/}
            <div
              className={`grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center lg:text-left group">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 mb-4 transition-all duration-300 group-hover:bg-black group-hover:shadow-xl group-hover:scale-110">
                      <Icon className="w-7 h-7 text-black transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-black mb-2 transition-all duration-300 group-hover:scale-105">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual*/}
          <div className="relative">
            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-95 rotate-3'
              }`}
            >
              {/* Main Image Container */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 group">
                <Image
                  src="/images/home.jpeg"
                  alt="Stand Pameran Profesional NK POL - Kontraktor Booth Exhibition Jakarta"
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

              {/* Floating Quality Card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-w-xs transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center flex-shrink-0 group">
                    <Award className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-black mb-1">
                      Kualitas Terjamin
                    </div>
                    <div className="text-sm text-gray-600">
                      Dipercaya sejak 2019
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-red-600 rounded-3xl opacity-30 -z-10 pointer-events-none"></div>
              <div className="absolute top-8 left-8 w-12 h-12 border border-gray-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div
        className={`animate-bounce absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center gap-3 group cursor-pointer">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-300 group-hover:text-black">
            Scroll untuk melihat lebih
          </span>
          <div className="relative">
            <div className="w-[2px] h-16 bg-gradient-to-b from-red-600 via-red-200 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}