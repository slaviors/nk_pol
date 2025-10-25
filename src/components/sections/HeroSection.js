// src/components/sections/HeroSection.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Users, BadgeCheck, Briefcase } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollAnimation, setScrollAnimation] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const t = useTranslation();

  const heroImages = [
    '/images/hero-3.jpeg',
    '/images/hero-2.jpeg',
    '/images/hero-1.jpeg',
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        setScrollAnimation(false);
      } else {
        setScrollAnimation(true);
      }
      
      // Parallax effect calculation
      setParallaxOffset({
        x: scrollY * 0.15,
        y: scrollY * 0.3
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const stats = [
    { icon: Users, value: '200+', label: t.hero.stats.clients },
    { icon: BadgeCheck, value: '1000+', label: t.hero.stats.projects },
    { icon: Briefcase, value: '5+', label: t.hero.stats.experience },
  ];

  return (
    <section 
      className="relative flex items-center justify-center overflow-hidden bg-white"
      style={{ minHeight: 'calc(100vh - 72px)' }}
    >
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">

        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-red-50" />

        {/* Grid Lines with Dots and Vignette */}
        <div className="absolute inset-0 opacity-50">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          {/* Dots at Grid Intersections */}
          <div 
            className="absolute"
            style={{
              inset: '1.31rem',
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 2px, transparent 2px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: '-0.5px -0.5px'
            }}
          />
          {/* White Vignette Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, transparent 0%, transparent 25%, rgba(255,255,255,0.7) 70%, white 90%)`
            }}
          />
        </div>

        {/* Large Abstract Shapes with Parallax */}
        <div 
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full overflow-hidden transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${parallaxOffset.x}px, ${-parallaxOffset.y}px) rotate(${parallaxOffset.x * 0.1}deg)`
          }}
        >
          <Image
            src="/images/background/brushed-metal.jpg"
            alt="Brushed Metal Texture"
            fill
            className="object-cover opacity-35"
          />
        </div>
        <div 
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full overflow-hidden transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${-parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 1.2}px) rotate(${-parallaxOffset.x * 0.15}deg)`
          }}
        >
          <Image
            src="/images/background/brushed-metal.jpg"
            alt="Brushed Metal Texture"
            fill
            className="object-cover opacity-40"
          />
        </div>
      </div>

      <div className="container-custom relative z-10 pb-4 md:pb-6 lg:pb-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-3">

            {/* Main Heading */}
            <h1
              className={`text-[2.25rem] md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] text-black transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className={t.hero.title1 === t.hero.highlightWord ? 'relative inline-block group/highlight' : ''}>
                {t.hero.title1 === t.hero.highlightWord && (
                  <span className="absolute bottom-0 md:bottom-1 left-0 right-0 h-2.5 md:h-4 bg-red-600 opacity-25 rounded-sm transform transition-all duration-500 group-hover/highlight:opacity-35 group-hover/highlight:h-3 md:group-hover/highlight:h-5"></span>
                )}
                <span className={t.hero.title1 === t.hero.highlightWord ? 'relative z-10' : ''}>{t.hero.title1}</span>
              </span>{' '}
              {t.hero.title2}
              <br />
              <span className={t.hero.title3 === t.hero.highlightWord ? 'relative inline-block group/highlight whitespace-nowrap' : ''}>
                {t.hero.title3 === t.hero.highlightWord && (
                  <span className="absolute bottom-0 md:bottom-1 left-2 right-2 h-2.5 md:h-4 bg-red-600 opacity-25 rounded-sm transform transition-all duration-500 group-hover/highlight:opacity-35 group-hover/highlight:h-3 md:group-hover/highlight:h-5"></span>
                )}
                <span className={t.hero.title3 === t.hero.highlightWord ? 'relative z-10 text-black px-2 md:px-3' : ''}>{t.hero.title3}</span>
              </span>{' '}
              {t.hero.title4}
            </h1>

            {/* Description */}
            <p
              className={`text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {t.hero.description}
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
                <span className="relative z-10">{t.hero.ctaPrimary}</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </button>

              <Link
                href="/portofolio"
                className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full border-2 border-gray-300 bg-white text-black text-base font-semibold transition-all duration-500 hover:border-black hover:shadow-lg hover:scale-105"
              >
                <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                {t.hero.ctaSecondary}
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-6 mt-6 lg:mt-4 pt-6 border-t border-gray-200 transition-all duration-700 delay-500 ${
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
              <div className="relative h-[450px] xl:h-[500px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 group">
                {/* Image Slideshow with Fade Effect */}
                {heroImages.map((image, index) => (
                  <Image
                    key={image}
                    src={image}
                    alt={`Kontraktor Stand Pameran Profesional NK POL - Kontraktor Booth Exhibition Jakarta ${index + 1}`}
                    fill
                    className={`object-cover transition-all duration-[2000ms] group-hover:scale-105 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ))}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Slideshow Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-1.5 rounded-full transition-all duration-500 ${
                        index === currentImageIndex 
                          ? 'w-8 bg-white' 
                          : 'w-1.5 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      {index === currentImageIndex && (
                        <span className="absolute inset-0 bg-red-600 rounded-full animate-[slideProgress_10s_linear]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 z-20"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 z-20"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Floating Accent Circles */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-red-600 opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gray-100 opacity-50 blur-2xl"></div>
              </div>

              {/* Decorative Frame */}
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-red-600 rounded-3xl opacity-30 -z-10 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}