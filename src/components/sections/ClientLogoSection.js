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
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-white via-white to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-white via-white to-transparent z-20 pointer-events-none"></div>

          {/* Marquee Container */}
          <div className="marquee-container w-full flex items-center overflow-hidden">
            <div className="marquee-content flex">
              {/* Original logos */}
              {logos.map((logo, index) => (
                <div
                  key={`original-${logo._id}-${index}`}
                  className="marquee-item flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-48 mx-3 md:mx-4 p-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title={logo.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.image.thumbnailUrl || logo.image.url}
                    alt={logo.title}
                    className="max-h-12 sm:max-h-14 md:max-h-16 lg:max-h-20 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
              {/* Duplicate logos for seamless loop */}
              {logos.map((logo, index) => (
                <div
                  key={`duplicate-${logo._id}-${index}`}
                  className="marquee-item flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-48 mx-3 md:mx-4 p-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title={logo.title}
                  aria-hidden="true"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.image.thumbnailUrl || logo.image.url}
                    alt={logo.title}
                    className="max-h-12 sm:max-h-14 md:max-h-16 lg:max-h-20 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          position: relative;
        }

        .marquee-content {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Responsive animation speeds */
        @media (max-width: 1024px) {
          .marquee-content {
            animation-duration: 35s;
          }
        }

        @media (max-width: 768px) {
          .marquee-content {
            animation-duration: 28s;
          }
        }

        @media (max-width: 640px) {
          .marquee-content {
            animation-duration: 22s;
          }
        }
      `}</style>
    </section>
  );
}