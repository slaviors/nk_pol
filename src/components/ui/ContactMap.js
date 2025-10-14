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
      {/* Location Tabs */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
        {locations.map((location, index) => (
          <button
            key={index}
            onClick={() => setActiveLocation(index)}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeLocation === index
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {location.name}
          </button>
        ))}
      </div>

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
          className="grayscale hover:grayscale-0 transition-all duration-500"
        ></iframe>
        
        {/* Map Overlay */}
        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mt-1 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 mb-1">
                {locations[activeLocation].name}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {locations[activeLocation].address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
