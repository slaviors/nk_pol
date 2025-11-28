// src/components/layout/Footer.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState({});
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const t = useTranslation();

  useEffect(() => {
    const currentRef = footerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timings = [100, 200, 300];
    const timers = timings.map((delay, index) =>
      setTimeout(() => {
        setItemsVisible(prev => ({ ...prev, [index]: true }));
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [isVisible]);

  const contactInfo = [
    {
      icon: Phone,
      label: t.footer.contact.phone,
      value: '+62 896 7890 1569',
      href: 'https://wa.me/6289678901569',
    },
    {
      icon: Mail,
      label: t.footer.contact.email,
      value: 'contact@nkpol.com',
      href: 'mailto:contact@nkpol.com',
    },
    {
      icon: MapPin,
      label: t.footer.contact.address,
      value: 'RT.10/RW.3, Joglo, Kembangan, West Jakarta City, Jakarta 11640',
      href: 'https://maps.app.goo.gl/4fCTybQbpotj8kDr9',
    },
  ];

  const quickLinks = [
    { name: t.nav.home, href: '/', section: 'home' },
    { name: t.nav.about, href: '/', section: 'about-section' },
    { name: t.nav.services, href: '/', section: 'services-section' },
    { name: t.nav.portfolio, href: '/portofolio' },
    { name: t.nav.contact, href: '/', section: 'contact' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-black text-white overflow-hidden"
    >
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10" />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-red-600 rounded-full blur-3xl opacity-8" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-5" />

        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMTBIMTBWMEgwVjEwWk0wIDQwSDEwVjMwSDBWNDBaTTEwIDIwSDIwVjEwSDEwVjIwWk0yMCAzMEgzMFYyMEgyMFYzMFpNMzAgMTBINDBWMEgzMFYxMFpNMzAgNDBINDBWMzBIMzBWNDBaIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPC9zdmc+Cg==')] opacity-20" />
      </div>

      {/* Main Content */}
      <div className="container-custom relative z-10 pt-16 pb-6 md:pt-20 md:pb-8">
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-8 pb-8 border-b border-gray-800">
          {/* Brand Section */}
          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <Link
              href="/"
              className="inline-flex items-center transition-opacity duration-300 hover:opacity-80 mb-6 group"
            >
              <Image
                src="/images/assets/logo.png"
                alt="NK POL Logo"
                width={80}
                height={32}
                priority
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-base md:text-lg leading-relaxed text-gray-300 mb-8 font-light max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/nk.pol.750323"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-600/25 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="https://instagram.com/nkpol.exhibition"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-600/25 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <div className="text-sm md:text-base text-gray-400">
                <p className="font-medium text-white">Follow on our social media</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 delay-100 ${itemsVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <h4 className="text-lg md:text-xl font-bold mb-8 text-white tracking-wider uppercase relative">
              {t.footer.quickLinks}
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></span>
            </h4>
            <ul className="space-y-5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.section) {
                        e.preventDefault();
                        const element = document.getElementById(link.section);
                        if (element) {
                          const navbarHeight = 72;
                          const elementPosition = element.offsetTop - navbarHeight;
                          window.scrollTo({
                            top: link.section === 'home' ? 0 : Math.max(0, elementPosition),
                            behavior: 'smooth'
                          });
                        } else if (link.section === 'home') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                    }}
                    className="text-gray-300 hover:text-red-500 transition-all duration-300 text-base font-light relative group flex items-center"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-transparent group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div
            className={`transition-all duration-700 delay-200 ${itemsVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <h4 className="text-lg md:text-xl font-bold mb-8 text-white tracking-wider uppercase relative">
              Hubungi Kami
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></span>
            </h4>
            <ul className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="group flex gap-4 items-start text-base text-gray-300 hover:text-red-500 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600/15 to-red-700/15 border border-red-600/20 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:from-red-600/25 group-hover:to-red-700/25 group-hover:border-red-600/40 transition-all duration-300">
                          <Icon className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-xs md:text-sm uppercase tracking-wider mb-1">{item.label}</p>
                          <span className="font-light">{item.value}</span>
                        </div>
                      </a>
                    ) : (
                      <div className="flex gap-4 items-start text-base text-gray-300">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600/15 to-red-700/15 border border-red-600/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Icon className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-xs md:text-sm uppercase tracking-wider mb-1">{item.label}</p>
                          <span className="font-light">{item.value}</span>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`transition-all duration-700 delay-300 ${itemsVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="text-center pt-6">
            <p className="text-base text-gray-400 font-light tracking-wider">
              © {currentYear} {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}