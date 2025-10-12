'use client';

import { useState, useEffect, useRef } from 'react';

export default function TestimonySection() {
  const [testimonies, setTestimonies] = useState([]);
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

    return data.map(t => `${t._id}-${t.text.substring(0, 20)}-${t.star}`).join('|');
  };

  const fetchTestimonies = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await fetch('/api/public/testimony?limit=6', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const newTestimonies = data.testimonies || [];
        const newHash = generateHash(newTestimonies);

        if (newHash !== cacheRef.current.hash) {
          console.log('📝 Testimony data updated - refreshing display');
          setTestimonies(newTestimonies);

          cacheRef.current = {
            data: newTestimonies,
            timestamp: Date.now(),
            hash: newHash
          };
        } else {
          console.log('✓ Testimony data unchanged - using cache');
        }

        if (error) setError('');
      } else {
        if (isInitialLoad) {
          setError(data.error || 'Failed to load testimonies');
        }
      }
    } catch (err) {
      console.error('Testimony fetch error:', err);
      if (isInitialLoad) {
        setError('Error loading testimonies');
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTestimonies(true);
    
    const refreshInterval = setInterval(() => {
      fetchTestimonies(false);
    }, 30000); 

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <span 
            key={i} 
            className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block animate-pulse bg-gray-200 h-8 w-64 rounded mb-4"></div>
            <div className="inline-block animate-pulse bg-gray-200 h-4 w-96 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-6 h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || testimonies.length === 0) {
    return null;   }

  return (
    <section className="py-16 bg-white relative">
      {isRefreshing && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-50 flex items-center gap-1">
            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Syncing...</span>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from some of our satisfied clients about their experience working with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((testimony) => (
            <div
              key={testimony._id}
              className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="mb-4">
                {renderStars(testimony.star)}
              </div>

              <div className="flex-grow mb-6">
                <p className="text-gray-700 italic text-center">
                  &quot;{testimony.text}&quot;
                </p>
              </div>

              <div className="flex flex-col items-center pt-4 border-t border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimony.profileImage.thumbnailUrl || testimony.profileImage.url}
                  alt={testimony.name}
                  className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-blue-600"
                />

                <div className="text-center">
                  <p className="font-bold text-gray-900">{testimony.name}</p>
                  {testimony.title && (
                    <p className="text-sm text-gray-600">{testimony.title}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
