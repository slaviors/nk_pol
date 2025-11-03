'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Home } from 'lucide-react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Load 404 Lottie animation from reliable CDN
    fetch('https://assets10.lottiefiles.com/packages/lf20_kcsr6fcp.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation load failed'));
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden bg-white">
      
      {/* Background Pattern - Grid dengan Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #dc2626 1px, transparent 1px),
              linear-gradient(to bottom, #dc2626 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Dots Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1.5px, transparent 1.5px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '30px 30px'
          }}
        />
        
        {/* Accent Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-gray-50/50" />
      </div>

      <div className="container-custom relative z-10 py-16">
        <div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content */}
            <div
              className={`text-center lg:text-left transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 leading-tight">
                Halaman Tidak
                <br />
                <span className="relative inline-block">
                  Ditemukan
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-red-600 opacity-20 -z-10 rounded-sm" />
                </span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan atau URL yang Anda masukkan salah.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-black text-white text-base font-semibold overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
                >
                  <Home className="relative z-10 w-5 h-5" />
                  <span className="relative z-10">Kembali ke Beranda</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full border-2 border-gray-300 bg-white text-black text-base font-semibold transition-all duration-500 hover:border-black hover:shadow-lg hover:scale-105"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  Halaman Sebelumnya
                </button>
              </div>
            </div>
            
            {/* Right Side - Lottie Animation */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="relative w-full flex items-center justify-center lg:justify-start">
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    className="w-full max-w-2xl h-auto"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full max-w-md aspect-square">
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <h1 className="text-[140px] font-black text-gray-300 leading-none">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 font-medium">Loading animation...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
