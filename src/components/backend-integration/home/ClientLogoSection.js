'use client';

import { useState, useEffect } from 'react';

export default function ClientLogoSection() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/clientLogo');
      const data = await response.json();
      
      if (response.ok) {
        setLogos(data.logos || []);
      } else {
        setError(data.error || 'Failed to load logos');
      }
    } catch (err) {
      setError('Error loading logos');
      console.error('Logo fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-pulse bg-gray-200 h-8 w-48 rounded mb-4"></div>
            <div className="flex justify-center gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-16 w-32 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || logos.length === 0) {
    return null; // Don't show section if no logos
  }

  // Duplicate logos for infinite scroll effect
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
          Trusted By Leading Brands
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          We&apos;re proud to partner with industry leaders and innovative companies
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

        <div className="logo-scroll-container flex items-center">
          <div className="logo-scroll-track flex items-center gap-12 py-8">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo._id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                title={logo.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.image.thumbnailUrl || logo.image.url}
                  alt={logo.title}
                  className="h-12 w-auto max-w-[120px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-scroll-container {
          width: 100%;
        }

        .logo-scroll-track {
          animation: scroll 40s linear infinite;
          will-change: transform;
        }

        .logo-scroll-track:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @media (max-width: 768px) {
          .logo-scroll-track {
            animation-duration: 25s;
          }
        }
      `}</style>
    </section>
  );
}
