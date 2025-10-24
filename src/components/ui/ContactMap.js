'use client';

import { useState } from 'react';

export default function ContactMap() {
  const [activeLocation, setActiveLocation] = useState(0);

  const locations = [
    {
      name: 'Workshop & Office 1',
      address: 'Joglo, RT.10/RW.03, Kec. Kembangan, Kota Jakarta Barat, DKI Jakarta 11640',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3795.9400806750714!2d106.7474405!3d-6.214832999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f710d7f8d4e3%3A0x47f76e67fbb18c24!2sNK%20POL%20(%20workshop%20%26%20office%20)!5e1!3m2!1sid!2sid!4v1760434011175!5m2!1sid!2sid'
    },
    {
      name: 'Workshop 2',
      address: 'Jl. H Briti A No.107, RT.4/RW.6, Kembangan Sel., Kec. Kembangan, Kota Jakarta Barat, DKI Jakarta 11610',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3796.148349975224!2d106.75644969999999!3d-6.185898099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f70f0434bbab%3A0x7d64ebf2b18e0127!2sJl.%20H%20Briti%20A%20No.107%2C%20RW.6%2C%20Kembangan%20Sel.%2C%20Kec.%20Kembangan%2C%20Kota%20Jakarta%20Barat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2011610!5e1!3m2!1sid!2sid!4v1760434617496!5m2!1sid!2sid'
    }
  ];

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-red-600/20">
      {/* Map Container */}
      <div className="relative h-[400px] lg:h-[500px]">
        <iframe
          key={activeLocation}
          src={locations[activeLocation].mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Lokasi ${locations[activeLocation].name}`}
          className="lg:grayscale lg:hover:grayscale-0 transition-all duration-500"
        ></iframe>
      </div>

      {/* Location Switcher - Below Map */}
      <div className="px-3 py-2.5 bg-gray-50">
        <div className="flex items-stretch gap-2">
          {locations.map((location, index) => (
            <button
              key={index}
              onClick={() => setActiveLocation(index)}
              className={`flex-1 px-3 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 min-h-[44px] flex items-center justify-center ${
                activeLocation === index
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>
        
        {/* Address - Desktop Only */}
        <div className="hidden lg:block mt-3 px-3 py-2 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-gray-700 leading-relaxed">
              {locations[activeLocation].address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
