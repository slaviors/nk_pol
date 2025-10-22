'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
  }, []); 

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span 
            key={i} 
            className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-block animate-pulse bg-gray-200 h-10 w-72 rounded mb-6"></div>
            <div className="inline-block animate-pulse bg-gray-100 h-6 w-full max-w-2xl rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl p-8 h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || testimonies.length === 0) {
    // Placeholder testimonies untuk development
    const placeholderTestimonies = [
      {
        _id: 'placeholder-1',
        text: 'NK POL berhasil mewujudkan booth kami dengan desain yang sangat kreatif dan inovatif. Tim mereka sangat profesional dalam setiap tahap dari konsep hingga instalasi.',
        star: 5,
        name: 'Budi Santoso',
        title: 'Marketing Manager at PT Maju Jaya',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'
        }
      },
      {
        _id: 'placeholder-2',
        text: 'Pameran kami tahun ini lebih sukses dari yang sebelumnya berkat booth yang dirancang oleh NK POL. Kualitas konstruksi dan desainnya luar biasa.',
        star: 5,
        name: 'Siti Nurhaliza',
        title: 'Event Organizer at Indonesia Expo',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop'
        }
      },
      {
        _id: 'placeholder-3',
        text: 'Layanan NK POL sangat memuaskan. Dari desain, produksi, hingga instalasi semuanya ditangani dengan sangat profesional dan tepat waktu.',
        star: 5,
        name: 'Rudi Hermawan',
        title: 'Director at CV Kreatif Solusi',
        profileImage: {
          url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop'
        }
      }
    ];

    return (
      <section className="py-24 md:py-32 bg-white relative overflow-visible">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/background/brushed-metal.jpg"
            alt="Brushed Metal Background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-white/40" />
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block group cursor-pointer">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black group-hover:text-red-600 mb-4 leading-tight transition-colors duration-500">
                Testimoni Klien
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6 group-hover:w-32 transition-all duration-500 ease-out"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Dengarkan pengalaman klien kami bekerja sama dengan NK POL dalam mewujudkan pameran yang berkesan
            </p>
          </div>

          {/* Testimonies Grid - Masonry Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {placeholderTestimonies.map((testimony, index) => (
              <div
                key={testimony._id}
                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-red-600 transition-all duration-500 break-inside-avoid mb-6 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Hover Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-red-50/0 group-hover:from-red-50/20 group-hover:to-red-50/5 rounded-2xl transition-all duration-500 -z-10"></div>

                {/* Stars */}
                <div className="mb-6">
                  {renderStars(testimony.star)}
                </div>

                {/* Testimony Text */}
                <div className="mb-8">
                  <p className="text-gray-700 leading-relaxed text-base font-normal italic">
                    &ldquo;{testimony.text}&rdquo;
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mb-6"></div>

                {/* Client Info */}
                <div className="flex items-center gap-4">
                  {/* Profile Image - Perfect Circle with Cover */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-red-600 group-hover:border-red-700 transition-colors duration-300">
                      <img
                        src={testimony.profileImage.thumbnailUrl || testimony.profileImage.url}
                        alt={testimony.name}
                        className="w-full h-full object-cover object-center min-w-full min-h-full"
                      />
                    </div>
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-black text-base group-hover:text-red-600 transition-colors duration-300">
                      {testimony.name}
                    </p>
                    {testimony.title && (
                      <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-2">
                        {testimony.title}
                      </p>
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

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/background/brushed-metal.jpg"
          alt="Brushed Metal Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block group cursor-pointer">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black group-hover:text-red-600 mb-4 leading-tight transition-colors duration-500">
              Testimoni Klien
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6 group-hover:w-32 transition-all duration-500 ease-out"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Dengarkan pengalaman klien kami bekerja sama dengan NK POL dalam mewujudkan pameran yang berkesan
          </p>
        </div>

        {/* Testimonies Grid - Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {testimonies.map((testimony, index) => (
            <div
              key={testimony._id}
              className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-red-600 transition-all duration-500 break-inside-avoid mb-6 shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Hover Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-red-50/0 group-hover:from-red-50/20 group-hover:to-red-50/5 rounded-2xl transition-all duration-500 -z-10"></div>

              {/* Stars */}
              <div className="mb-6">
                {renderStars(testimony.star)}
              </div>

              {/* Testimony Text */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed text-base font-normal italic">
                  &ldquo;{testimony.text}&rdquo;
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mb-6"></div>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                {/* Profile Image - Perfect Circle with Cover */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-red-600 group-hover:border-red-700 transition-colors duration-300">
                    <img
                      src={testimony.profileImage.thumbnailUrl || testimony.profileImage.url}
                      alt={testimony.name}
                      className="w-full h-full object-cover object-center min-w-full min-h-full"
                    />
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <p className="font-bold text-black text-base group-hover:text-red-600 transition-colors duration-300">
                    {testimony.name}
                  </p>
                  {testimony.title && (
                    <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-2">
                      {testimony.title}
                    </p>
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