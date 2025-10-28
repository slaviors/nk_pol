export const siteMetadata = {
  title: 'NK POL - Kontraktor Stand Pameran Profesional & Terpercaya',
  description: 'NK POL adalah kontraktor pameran terpadu sejak 2019. Kami menyediakan jasa desain, konstruksi, dan instalasi booth pameran berkualitas tinggi dengan harga kompetitif.',
  author: 'NK POL',
  siteUrl: 'https://www.nkpol.com',
  locale: 'id_ID',
  ogImage: '/images/og-image.jpg',
  
  // Contact Information
  phone: '+62 896-7890-1569',
  whatsapp: '+62 896-7890-1569',
  email: 'info@nkpol.com',
  
  // Company Address
  address: {
    street: 'Joglo, RT.10/RW.03, Kec. Kembangan',
    city: 'Jakarta Barat',
    region: 'DKI Jakarta',
    postalCode: '11640',
    country: 'Indonesia',
  },
  
  // Company Info
  tagline: 'Kontraktor Stand Pameran Berkualitas untuk Brand Anda',
  foundingYear: '2019',
  
  // Company Statistics
  stats: {
    clients: '200+',
    projects: '1000+',
    experience: '5+',
  },
  
  // Vision & Mission
  vision: 'Menjadi mitra terpercaya dalam mewujudkan pameran berkesan dan bernilai tinggi melalui inovasi kreatif dan komitmen kepuasan pelanggan.',
  mission: [
    'Desain inovatif sesuai brand',
    'Layanan terpadu berkualitas',
    'Ketepatan waktu profesional',
    'Hubungan jangka panjang',
  ],
  
  // Social Media Links
  social: {
    facebook: 'https://www.facebook.com/share/16GDrtk8Tf/',
    instagram: 'https://www.instagram.com/nk.pol_kontraktor_pameran',
  },
};

// SEO Keywords Configuration
export const metadataKeywords = {
  // Brand Keywords
  brand: [
    'NK POL',
    'NKPOL',
    'NK POL Jakarta',
    'Kontraktor NK POL',
    'NK POL kontraktor pameran',
    'NK POL booth pameran',
    'NK POL stand pameran',
    'NK POL exhibition',
    'NK POL kontraktor stand',
    'NK POL jasa pameran',
    'NK POL vendor pameran',
    'NK POL desain booth',
    'NK POL konstruksi booth',
    'NK POL produksi booth',
    'NK POL instalasi booth'
  ],

  // Primary Keywords (High Priority)
  primary: [
    'kontraktor stand pameran',
    'kontraktor booth pameran jakarta',
    'jasa booth pameran',
    'vendor pameran',
    'kontraktor pameran',
    'booth pameran 3x3',
    'kontraktor pameran terpadu',
    'kontraktor exhibition',
    'booth pameran jakarta'
  ],
  
  // Secondary Keywords
  secondary: [
    'jasa pembuatan booth pameran',
    'kontraktor booth pameran',
    'vendor booth pameran jakarta',
    'harga booth pameran 3x3',
    'jasa desain booth pameran',
    'kontraktor stand exhibition',
    'booth pameran profesional',
    'produksi booth pameran',
  ],
  
  // Long-Tail Keywords
  longTail: [
    'kontraktor stand pameran berkualitas',
    'desain booth kreatif fungsional',
    'konstruksi booth berkualitas tinggi',
    'eksekusi tepat waktu pameran',
    'mitra terpercaya pameran',
    'solusi terpadu booth pameran',
    'booth pameran standar internasional',
    'kontraktor booth exhibition jakarta',
    'jasa pembuatan booth pameran jakarta',
    'vendor pameran terpercaya',
    'booth pameran impian',
    'pengalaman pameran berkesan',
  ],
  
  // Location-Based Keywords
  locations: [
    'kontraktor booth pameran jakarta',
    'kontraktor stand pameran jakarta',
    'kontraktor booth pameran surabaya',
    'kontraktor booth pameran bandung',
    'kontraktor booth pameran bali',
    'kontraktor booth pameran jogja',
    'kontraktor booth pameran semarang',
    'vendor pameran jakarta',
    'jasa booth pameran jakarta',
    'kontraktor pameran jakarta barat',
    'kontraktor exhibition jakarta',
  ],
  
  // Service Keywords
  services: [
    'desain booth pameran',
    'konsep pameran kreatif',
    'produksi booth pameran',
    'konstruksi booth exhibition',
    'dekorasi event pameran',
    'dekorasi area mall',
    'instalasi booth pameran',
    'dismantle booth pameran',
    'sewa perlengkapan pameran',
    'sewa furniture pameran',
    'sewa display system',
    'sewa lighting pameran',
    'manajemen proyek pameran',
    'koordinasi event pameran',
  ],
  
  // Commercial Keywords (Buyer Intent)
  commercial: [
    'harga booth pameran 3x3',
    'harga booth pameran per meter',
    'biaya booth pameran',
    'harga kontraktor booth pameran',
    'jasa kontraktor booth terpercaya',
    'vendor booth profesional',
    'kontraktor pameran terbaik',
    'booth pameran harga kompetitif',
    'paket booth pameran',
  ],

  // Value Proposition Keywords
  valueProps: [
    'booth pameran berkualitas',
    'kontraktor pameran terpercaya',
    'tim profesional pameran',
    'booth pameran standar internasional',
    'desain kreatif fungsional',
    'konstruksi presisi sempurna',
    'teknisi berpengalaman',
  ],
};

// JSON-LD Schema.org Structured Data
export const jsonLdSchemas = {
  
  // Organization Schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteMetadata.siteUrl}#organization`,
    name: 'NK POL',
    legalName: 'NK POL - Kontraktor Stand Pameran',
    alternateName: [
      'NK POL Kontraktor Pameran',
      'NKPOL',
      'NK POL Jakarta',
      'Kontraktor NK POL',
      'NK POL Exhibition',
    ],
    description: 'NK POL adalah kontraktor stand pameran profesional terpercaya sejak 2019 dengan 200+ klien dan 1000+ proyek selesai. Desain kreatif, konstruksi berkualitas, eksekusi tepat waktu untuk booth pameran impian Anda.',
    url: siteMetadata.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}/images/assets/logo.png`,
      width: 250,
      height: 100,
    },
    image: [
      `${siteMetadata.siteUrl}/images/team.jpeg`,
      `${siteMetadata.siteUrl}/images/service-main.jpg`,
      `${siteMetadata.siteUrl}/images/assets/logo.png`,
    ],
    foundingDate: siteMetadata.foundingYear,
    slogan: siteMetadata.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteMetadata.address.street,
      addressLocality: siteMetadata.address.city,
      addressRegion: siteMetadata.address.region,
      postalCode: siteMetadata.address.postalCode,
      addressCountry: 'ID',
    },
    telephone: siteMetadata.phone,
    email: siteMetadata.email,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteMetadata.phone,
        contactType: 'Customer Service',
        email: siteMetadata.email,
        availableLanguage: ['Indonesian', 'English'],
        areaServed: [
          'Jakarta',
          'Surabaya',
          'Bandung',
          'Bali',
          'Jogja',
          'Semarang',
          'Indonesia',
        ],
        contactOption: ['TollFree', 'WhatsApp'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '17:00',
        },
      },
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Jakarta',
        '@id': 'https://www.wikidata.org/wiki/Q3630',
      },
      { '@type': 'City', name: 'Surabaya' },
      { '@type': 'City', name: 'Bandung' },
      { '@type': 'City', name: 'Bali' },
      { '@type': 'City', name: 'Jogja' },
      { '@type': 'City', name: 'Semarang' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    knowsAbout: [
      'Kontraktor Stand Pameran',
      'Desain Booth Exhibition',
      'Konstruksi Booth Pameran',
      'Produksi Booth',
      'Instalasi Booth',
      'Dekorasi Event',
      'Manajemen Proyek Pameran',
    ],
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '10-50',
    },
    slogan: siteMetadata.vision,
    sameAs: [
      siteMetadata.social.facebook,
      siteMetadata.social.instagram,
    ],
  },

  // Local Business Schema
  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteMetadata.siteUrl}#localBusiness`,
    name: 'NK POL - Kontraktor Stand Pameran Jakarta',
    image: [
      `${siteMetadata.siteUrl}/images/team.jpeg`,
      `${siteMetadata.siteUrl}/images/service-main.jpg`,
      `${siteMetadata.siteUrl}/images/service-left.jpg`,
      `${siteMetadata.siteUrl}/images/service-right.jpg`,
    ],
    description: 'NK POL adalah kontraktor stand pameran profesional & terpercaya sejak 2019 dengan 200+ klien dan 1000+ proyek selesai. Desain kreatif, konstruksi berkualitas tinggi, dan eksekusi tepat waktu. Mitra terpercaya booth pameran Anda di Jakarta dan seluruh Indonesia.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteMetadata.address.street,
      addressLocality: siteMetadata.address.city,
      addressRegion: siteMetadata.address.region,
      postalCode: siteMetadata.address.postalCode,
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-6.1975',
      longitude: '106.7516',
    },
    telephone: siteMetadata.phone,
    email: siteMetadata.email,
    url: siteMetadata.siteUrl,
    priceRange: '$$',
    paymentAccepted: 'Cash, Bank Transfer, Credit Card',
    currenciesAccepted: 'IDR',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '15:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
      bestRating: '5',
      worstRating: '1',
    },
  },

  // Service Schema
  service: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteMetadata.siteUrl}#service`,
    serviceType: 'Jasa Kontraktor Stand Pameran',
    name: 'Jasa Kontraktor Stand Pameran NK POL',
    description: 'NK POL menawarkan layanan kontraktor pameran terpadu dengan 6 layanan utama: Desain Booth & Konsep Pameran, Produksi & Konstruksi Booth, Dekorasi Event & Area Publik, Instalasi & Dismantle, Sewa Perlengkapan Pameran, dan Manajemen Proyek Pameran. Solusi lengkap dari konsep hingga eksekusi dengan standar internasional.',
    provider: {
      '@type': 'Organization',
      name: 'NK POL',
      '@id': `${siteMetadata.siteUrl}#organization`,
    },
    areaServed: [
      { '@type': 'City', name: 'Jakarta' },
      { '@type': 'City', name: 'Surabaya' },
      { '@type': 'City', name: 'Bandung' },
      { '@type': 'City', name: 'Bali' },
      { '@type': 'City', name: 'Jogja' },
      { '@type': 'City', name: 'Semarang' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Layanan Kontraktor Stand Pameran NK POL',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Desain Booth & Konsep Pameran',
            description: 'Kami menciptakan desain booth yang kreatif, fungsional, dan sesuai karakter brand Anda untuk menarik perhatian pengunjung. Desain inovatif dengan teknologi terkini untuk booth pameran yang memorable.',
            image: `${siteMetadata.siteUrl}/images/service-main.jpg`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Produksi & Konstruksi Booth',
            description: 'Tim teknisi berpengalaman memastikan booth dibangun dengan kualitas tinggi, presisi sempurna, dan tepat waktu. Konstruksi berkualitas dengan material terbaik dan standar internasional.',
            image: `${siteMetadata.siteUrl}/images/service-left.jpg`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dekorasi Event & Area Publik',
            description: 'Menangani dekorasi event, area mall, dan ruang komersial dengan perpaduan estetika dan kebutuhan fungsional. Solusi dekorasi yang memukau dan efektif untuk berbagai kebutuhan.',
            image: `${siteMetadata.siteUrl}/images/service-right.jpg`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Instalasi & Dismantle',
            description: 'Proses pemasangan hingga pembongkaran booth yang cepat, aman, dan efisien dengan koordinasi profesional. Tim ahli memastikan instalasi sempurna dan dismantle tanpa kerusakan.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sewa Perlengkapan Pameran',
            description: 'Menyediakan furniture, display system, lighting, backdrop, dan partisi dengan kualitas terbaik. Solusi sewa lengkap untuk kebutuhan pameran Anda dengan harga kompetitif.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Manajemen Proyek Pameran',
            description: 'Perencanaan dan koordinasi lengkap mulai dari layout, timeline, hingga pengawasan di lapangan. Manajemen profesional untuk memastikan kesuksesan pameran Anda dari awal hingga akhir.',
          },
        },
      ],
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: '5000000',
      highPrice: '50000000',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: 'Hubungi Kami untuk Konsultasi Gratis',
        priceCurrency: 'IDR',
      },
    },
    brand: {
      '@type': 'Brand',
      name: 'NK POL',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Business',
      geographicArea: {
        '@type': 'Place',
        name: 'Indonesia',
      },
    },
  },

  // FAQ Schema
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Apa keunggulan NK POL sebagai kontraktor stand pameran?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NK POL menawarkan desain inovatif sesuai brand, layanan terpadu berkualitas, ketepatan waktu profesional, dan hubungan jangka panjang dengan klien. Sejak 2019, kami telah dipercaya oleh 200+ klien dan menyelesaikan 1000+ proyek dengan tim profesional dan standar internasional.',
        },
      },
      {
        '@type': 'Question',
        name: 'Berapa harga booth pameran 3x3 di NK POL?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Harga booth pameran 3x3 di NK POL mulai dari Rp 5 juta tergantung desain, material, dan kompleksitas. Untuk mendapatkan penawaran harga terbaik sesuai kebutuhan brand Anda, silakan hubungi tim kami di +62 896-7890-1569 untuk konsultasi gratis.',
        },
      },
      {
        '@type': 'Question',
        name: 'Layanan apa saja yang ditawarkan NK POL?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NK POL menyediakan 6 layanan lengkap: 1) Desain Booth & Konsep Pameran, 2) Produksi & Konstruksi Booth, 3) Dekorasi Event & Area Publik, 4) Instalasi & Dismantle, 5) Sewa Perlengkapan Pameran (furniture, lighting, display system), 6) Manajemen Proyek Pameran lengkap dari konsep hingga eksekusi.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah NK POL melayani proyek di luar Jakarta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ya, NK POL melayani proyek booth pameran di seluruh Indonesia termasuk Surabaya, Bandung, Bali, Jogja, Semarang dan kota besar lainnya. Dengan pengalaman 1000+ proyek, kami siap mewujudkan booth pameran berkesan di berbagai lokasi dengan standar internasional.',
        },
      },
      {
        '@type': 'Question',
        name: 'Berapa lama waktu pengerjaan booth pameran NK POL?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Waktu pengerjaan booth pameran umumnya 7-14 hari kerja tergantung kompleksitas desain dan ukuran. NK POL berkomitmen pada ketepatan waktu profesional dengan tim teknisi berpengalaman untuk memastikan booth Anda siap tepat waktu dengan presisi sempurna.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah NK POL menyediakan sewa perlengkapan pameran?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ya, NK POL menyediakan sewa perlengkapan pameran lengkap meliputi furniture, display system, lighting, backdrop, dan partisi dengan kualitas terbaik. Solusi praktis dan ekonomis untuk kebutuhan pameran Anda dengan harga kompetitif.',
        },
      },
      {
        '@type': 'Question',
        name: 'Bagaimana cara konsultasi gratis dengan NK POL?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Konsultasikan kebutuhan stand pameran Anda dengan tim profesional NK POL melalui WhatsApp di +62 896-7890-1569 atau isi form di website. Kami siap membantu mewujudkan booth pameran impian Anda dengan solusi terpadu dan harga terbaik.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apa yang membuat desain booth NK POL berbeda?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NK POL menciptakan desain booth yang kreatif, fungsional, dan sesuai karakter brand Anda. Kami menggabungkan desain inovatif dengan teknologi terkini untuk booth pameran yang tidak hanya menarik perhatian pengunjung, tetapi juga menciptakan pengalaman pameran yang berkesan.',
        },
      },
    ],
  },

  // Breadcrumb Schema (Dynamic)
  breadcrumb: (path = '/') => {
    const pathSegments = path.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteMetadata.siteUrl,
      },
    ];

    pathSegments.forEach((segment, index) => {
      const segmentPath = '/' + pathSegments.slice(0, index + 1).join('/');
      const segmentName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: index + 2,
        name: segmentName,
        item: `${siteMetadata.siteUrl}${segmentPath}`,
      });
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    };
  },

  // Website Schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteMetadata.siteUrl}#website`,
    url: siteMetadata.siteUrl,
    name: 'NK POL - Kontraktor Stand Pameran Profesional',
    description: siteMetadata.description,
    publisher: {
      '@id': `${siteMetadata.siteUrl}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteMetadata.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'id-ID',
  },
};

// Helper: Generate Metadata for Pages
export const generateMetadata = (
  pageTitle,
  pageDescription,
  pagePath = '/',
  additionalKeywords = []
) => {
  const allKeywords = [
    ...metadataKeywords.brand,
    ...metadataKeywords.primary,
    ...metadataKeywords.secondary.slice(0, 5),
    ...metadataKeywords.longTail.slice(0, 5),
    ...additionalKeywords,
  ];

  const fullTitle = pageTitle 
    ? `${pageTitle} | NK POL`
    : siteMetadata.title;

  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: fullTitle,
    description: pageDescription || siteMetadata.description,
    keywords: allKeywords.join(', '),
    authors: [{ name: 'NK POL', url: siteMetadata.siteUrl }],
    creator: 'NK POL',
    publisher: 'NK POL',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    category: 'Business Services',
    classification: 'Exhibition Contractor',
    openGraph: {
      type: 'website',
      locale: siteMetadata.locale,
      url: `${siteMetadata.siteUrl}${pagePath}`,
      siteName: 'NK POL - Kontraktor Stand Pameran',
      title: fullTitle,
      description: pageDescription || siteMetadata.description,
      images: [
        {
          url: `${siteMetadata.siteUrl}${siteMetadata.ogImage}`,
          width: 1200,
          height: 630,
          alt: 'NK POL - Kontraktor Stand Pameran Berkualitas untuk Brand Anda',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: pageDescription || siteMetadata.description,
      images: [`${siteMetadata.siteUrl}${siteMetadata.ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}${pagePath}`,
      languages: {
        'id-ID': `${siteMetadata.siteUrl}${pagePath}`,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
    other: {
      'geo.region': 'ID-JK',
      'geo.placename': 'Jakarta',
      'geo.position': '-6.1975;106.7516',
      'ICBM': '-6.1975, 106.7516',
    },
  };
};

// Helper: Generate Location Metadata
export const generateLocationMetadata = (city) => {
  const locationKeywords = metadataKeywords.locations.filter(kw => 
    kw.toLowerCase().includes(city.toLowerCase())
  );

  return generateMetadata(
    `Kontraktor Stand Pameran ${city}`,
    `NK POL adalah kontraktor stand pameran profesional terpercaya di ${city} sejak 2019. Desain kreatif, konstruksi berkualitas tinggi, eksekusi tepat waktu. 200+ klien telah mempercayai kami untuk booth pameran 3x3 dan custom di ${city}. Konsultasi gratis!`,
    `/${city.toLowerCase()}`,
    [...locationKeywords, `NK POL ${city}`, `kontraktor NK POL ${city}`]
  );
};

// Helper: Generate Service Metadata
export const generateServiceMetadata = (serviceName, serviceDescription) => {
  const serviceKeywords = metadataKeywords.services.filter(kw =>
    kw.toLowerCase().includes(serviceName.toLowerCase().split(' ')[0])
  );

  return generateMetadata(
    `${serviceName} - NK POL`,
    `${serviceDescription} NK POL menawarkan ${serviceName.toLowerCase()} dengan kualitas terbaik, tim profesional, dan harga kompetitif di Jakarta dan seluruh Indonesia.`,
    `/${serviceName.toLowerCase().replace(/ /g, '-')}`,
    [...serviceKeywords, `${serviceName} NK POL`, `jasa ${serviceName.toLowerCase()}`]
  );
};

// Helper: Get All Schemas
export const getAllSchemas = () => [
  jsonLdSchemas.organization,
  jsonLdSchemas.localBusiness,
  jsonLdSchemas.service,
  jsonLdSchemas.website,
  jsonLdSchemas.faq,
];