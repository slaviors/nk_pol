// src/components/layout/Navbar.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const navRefs = useRef([]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Scroll spy untuk detect active section
      if (pathname === '/') {
        const aboutSection = document.getElementById('about-section');
        const servicesSection = document.getElementById('services-section');
        const gallerySection = document.getElementById('gallery');
        const navbarHeight = 72;
        const isMobile = window.innerWidth < 768;
        const extraPadding = isMobile ? 60 : 80;
        const scrollPosition = window.scrollY + navbarHeight + extraPadding + 20; // offset untuk detection
        
        if (aboutSection && servicesSection && gallerySection) {
          const aboutTop = aboutSection.offsetTop;
          const aboutHeight = aboutSection.offsetHeight;
          const servicesTop = servicesSection.offsetTop;
          const servicesHeight = servicesSection.offsetHeight;
          const galleryTop = gallerySection.offsetTop;
          const galleryHeight = gallerySection.offsetHeight;
          
          if (scrollPosition >= galleryTop && scrollPosition < galleryTop + galleryHeight) {
            setActiveSection('gallery');
          } else if (scrollPosition >= servicesTop && scrollPosition < servicesTop + servicesHeight) {
            setActiveSection('services-section');
          } else if (scrollPosition >= aboutTop && scrollPosition < aboutTop + aboutHeight) {
            setActiveSection('about-section');
          } else if (scrollPosition < aboutTop) {
            setActiveSection('home');
          }
        }
      }
    };
    
    const handleResize = () => {
      // Re-calculate positioning on window resize
      handleScroll();
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Beranda', section: 'home' },
    { href: '/', label: 'Tentang', section: 'about-section' },
    { href: '/', label: 'Layanan', section: 'services-section' },
    { href: '/', label: 'Portofolio', section: 'gallery' },
    { href: '/kontak', label: 'Kontak', section: null },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 72;
      // Lebih banyak padding untuk desktop dan mobile
      const isMobile = window.innerWidth < 768;
      const extraPadding = isMobile ? 60 : 80; // Mobile butuh padding lebih karena viewport lebih kecil
      const elementPosition = element.offsetTop - navbarHeight - extraPadding;
      
      window.scrollTo({
        top: Math.max(0, elementPosition), // Pastikan tidak scroll ke posisi negatif
        behavior: 'smooth'
      });
    }
  };

  const handleLinkClick = (e, link) => {
    if (link.section && pathname === '/') {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      
      setTimeout(() => {
        if (link.section === 'home') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          scrollToSection(link.section);
        }
      }, isMobileMenuOpen ? 300 : 50);
    }
  };

  const isActive = (link) => {
    if (pathname === '/' && link.section) {
      return activeSection === link.section;
    }
    if (link.href === '/') return pathname === link.href;
    return pathname.startsWith(link.href);
  };

  const activeIndex = navLinks.findIndex(link => isActive(link));

  useEffect(() => {
    const updateIndicator = () => {
      const index = hoveredIndex !== null ? hoveredIndex : activeIndex;
      if (index !== -1 && navRefs.current[index]) {
        const element = navRefs.current[index];
        setIndicatorStyle({
          width: element.offsetWidth,
          left: element.offsetLeft,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeIndex, hoveredIndex]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)]'
            : 'bg-white'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div 
              className="flex-shrink-0 transition-all duration-500 ease-out"
              style={{ 
                transform: isScrolled ? 'scale(0.88)' : 'scale(1)' 
              }}
            >
              <Logo width={65} height={21} />
            </div>

            {/* Desktop Navigation with sliding indicator */}
            <div className="hidden lg:flex items-center">
              <div className="relative flex items-center bg-gray-50/80 backdrop-blur-sm rounded-full px-1.5 py-1.5 gap-0.5">
                {/* Sliding indicator background */}
                <div
                  className="absolute top-1.5 bottom-1.5 bg-black rounded-full transition-all duration-500 ease-out shadow-lg shadow-black/10"
                  style={{
                    width: indicatorStyle.width,
                    left: indicatorStyle.left,
                    transform: 'translateX(0)',
                  }}
                />

                {navLinks.map((link, index) => {
                  const active = isActive(link);
                  return (
                    <Link
                      key={`${link.href}-${link.section || link.label}`}
                      ref={(el) => (navRefs.current[index] = el)}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative px-5 py-2.5 rounded-full text-[14.5px] font-semibold transition-colors duration-300 z-10"
                    >
                      <span 
                        className={`transition-colors duration-300 ${
                          (active && hoveredIndex === null) || hoveredIndex === index
                            ? 'text-white' 
                            : 'text-gray-600'
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link
                href="/mulai"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-black text-white text-[14.5px] font-semibold overflow-hidden transition-all duration-500 ease-out hover:scale-[1.06] hover:shadow-2xl hover:shadow-black/20"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:-translate-y-[1px]">
                  Mulai Sekarang
                </span>
                <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]" />
                
                {/* Red gradient wave */}
                <span className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out" />
                
                {/* Shine effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-600">
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-500 hover:bg-gray-200 active:scale-90"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col items-end gap-[4.5px]">
                <span
                  className={`h-[2px] bg-black rounded-full transition-all duration-500 ease-out ${
                    isMobileMenuOpen 
                      ? 'w-5 rotate-45 translate-y-[6.5px]' 
                      : 'w-5'
                  }`}
                />
                <span
                  className={`h-[2px] bg-black rounded-full transition-all duration-500 ease-out ${
                    isMobileMenuOpen 
                      ? 'w-0 opacity-0' 
                      : 'w-4'
                  }`}
                />
                <span
                  className={`h-[2px] bg-black rounded-full transition-all duration-500 ease-out ${
                    isMobileMenuOpen 
                      ? 'w-5 -rotate-45 -translate-y-[6.5px]' 
                      : 'w-3.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden transition-all duration-700 ease-out ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] bg-white z-[70] lg:hidden transition-all duration-700 ease-out ${
          isMobileMenuOpen 
            ? 'translate-x-0 shadow-2xl' 
            : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-100">
            <Logo width={60} height={20} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-500 hover:bg-gray-200 hover:rotate-90 active:scale-90"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex-1 overflow-y-auto py-8 px-6">
            <div className="space-y-2">
              {navLinks.map((link, index) => {
                const active = isActive(link);
                return (
                  <Link
                    key={`${link.href}-${link.section || link.label}`}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`block px-5 py-3.5 rounded-2xl text-[16px] font-semibold transition-all duration-500 ease-out ${
                      active
                        ? 'bg-black text-white scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                    }`}
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${index * 60}ms` : '0ms',
                      transform: isMobileMenuOpen 
                        ? 'translateX(0) translateY(0)' 
                        : 'translateX(20px) translateY(10px)',
                      opacity: isMobileMenuOpen ? 1 : 0,
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer */}
          <div 
            className="p-6 border-t border-gray-100 transition-all duration-700"
            style={{
              transitionDelay: isMobileMenuOpen ? '300ms' : '0ms',
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
          >
            <Link
              href="/mulai"
              className="group relative flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl bg-black text-white text-center text-[16px] font-semibold overflow-hidden transition-all duration-500 active:scale-95"
            >
              <span className="relative z-10">Mulai Sekarang</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-all duration-300 group-active:translate-x-1" />
              <span className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600 translate-y-full group-active:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}