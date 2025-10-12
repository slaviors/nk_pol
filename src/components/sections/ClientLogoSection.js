// src/components/sections/ClientLogoSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function ClientLogoSection() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cacheRef = useRef({
    data: [],
    timestamp: null,
    hash: null
  });

  const generateHash = (data) => {
    if (!data || data.length === 0) return null;
    return data.map(l => `${l._id}-${l.title}`).join('|');
  };

  const fetchLogos = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await fetch('/api/public/clientLogo', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const newLogos = data.logos || [];
        const newHash = generateHash(newLogos);

        if (newHash !== cacheRef.current.hash) {
          setLogos(newLogos);

          cacheRef.current = {
            data: newLogos,
            timestamp: Date.now(),
            hash: newHash
          };
        }
        
        if (error) setError('');
      } else {
        if (isInitialLoad) {
          setError(data.error || 'Failed to load logos');
        }
      }
    } catch (err) {
      console.error('Logo fetch error:', err);
      if (isInitialLoad) {
        setError('Error loading logos');
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogos(true);

    const refreshInterval = setInterval(() => {
      fetchLogos(false); 
    }, 30000); 

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section className="bg-white relative overflow-hidden py-12 md:py-16">
        <div className="container-custom">
          <div className="flex justify-center gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-10 w-16 md:h-12 md:w-20 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || logos.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-white py-12 md:py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-red-50 rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-gray-50 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="container-custom relative z-10">
        {/* Logo Marquee */}
        <div className="relative group">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-white via-white to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-white via-white to-transparent z-20 pointer-events-none"></div>

          {/* Marquee Container */}
          <div className="overflow-hidden">
            <div className="marquee-wrapper">
              <div className="marquee-group">
                {logos.map((logo, index) => (
                  <div
                    key={`original-${logo._id}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-12 sm:h-14 md:h-16 lg:h-18 p-2 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
                    title={logo.title}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.image.thumbnailUrl || logo.image.url}
                      alt={logo.title}
                      className="max-h-full max-w-16 lg:max-w-24 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {logos.map((logo, index) => (
                  <div
                    key={`clone-${logo._id}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-12 sm:h-14 md:h-16 lg:h-18 p-2 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
                    title={logo.title}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.image.thumbnailUrl || logo.image.url}
                      alt={logo.title}
                      className="max-h-full max-w-24 sm:max-w-28 md:max-w-32 lg:max-w-36 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          display: flex;
          gap: 1rem;
          animation: scroll 40s linear infinite;
          will-change: transform;
        }

        .marquee-wrapper:hover {
          animation-play-state: paused;
        }

        .marquee-group {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
          min-width: 100%;
          justify-content: space-around;
        }

        @media (min-width: 768px) {
          .marquee-group {
            gap: 1.4rem;
          }
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        @media (max-width: 1024px) {
          .marquee-wrapper {
            animation-duration: 32s;
          }
        }

        @media (max-width: 768px) {
          .marquee-wrapper {
            animation-duration: 24s;
          }
        }

        @media (max-width: 640px) {
          .marquee-wrapper {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
}