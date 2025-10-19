// src/app/not-found.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* 404 Number */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-[10rem] md:text-[12rem] lg:text-[14rem] font-bold leading-none text-black relative inline-block">
              <span className="relative">
                404
                <span className="absolute bottom-4 left-0 right-0 h-8 bg-red-600 rounded-sm -z-10"></span>
              </span>
            </h1>
          </div>

          {/* Main Heading */}
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 transition-all duration-1000 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Halaman Tidak Ditemukan
          </h2>

          {/* Description */}
          <p
            className={`text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan atau URL yang Anda masukkan salah.
          </p>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-black text-white text-base font-semibold overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
            >
              <Home className="relative z-10 w-5 h-5" />
              <span className="relative z-10">Kembali ke Beranda</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full border-2 border-gray-300 bg-white text-black text-base font-semibold transition-all duration-500 hover:border-black hover:shadow-lg hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              Halaman Sebelumnya
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
