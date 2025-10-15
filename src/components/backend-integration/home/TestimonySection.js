'use client';

import { useState, useEffect } from 'react';

export default function TestimonySection() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/testimony?limit=6');
      const data = await response.json();
      
      if (response.ok) {
        setTestimonies(data.testimonies || []);
      } else {
        setError(data.error || 'Failed to load testimonies');
      }
    } catch (err) {
      setError('Error loading testimonies');
      console.error('Testimony fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <section className="py-16 bg-white">
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
