// src/config/metadata.js
export const siteMetadata = {
  title: 'NK POL - Kontraktor Stand Pameran Profesional & Terpercaya',
  description: 'NK POL adalah kontraktor pameran terpadu sejak 2019. Kami menyediakan jasa desain, konstruksi, dan instalasi booth pameran berkualitas tinggi dengan harga kompetitif. Hubungi kami untuk konsultasi gratis!',
  author: 'NK POL',
  siteUrl: 'https://www.nkpol.com',
  locale: 'id_ID',
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@nkpol',
};

export const metadataKeywords = {
  general: [
    'kontraktor pameran',
    'kontraktor booth pameran',
    'jasa pembuatan stand pameran',
    'kontraktor stand exhibition',
    'desain booth pameran',
    'NK POL',
    'booth pameran profesional',
    'stand pameran custom',
  ],
  services: [
    'desain booth pameran',
    'konstruksi booth exhibition',
    'instalasi booth pameran',
    'dekorasi event pameran',
    'sewa perlengkapan pameran',
    'manajemen proyek pameran',
  ],
  locations: [
    'kontraktor pameran Jakarta',
    'kontraktor booth pameran Indonesia',
    'jasa pameran terpercaya',
  ],
};

export const jsonLdSchemas = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': siteMetadata.siteUrl,
    name: 'NK POL',
    alternateName: 'NK POL Kontraktor Pameran',
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    logo: `${siteMetadata.siteUrl}/images/assets/logo.png`,
    foundingDate: '2019',
    foundingLocation: {
      '@type': 'Place',
      name: 'Jakarta',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
      },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Indonesian', 'English'],
      areaServed: {
        '@type': 'Country',
        name: 'Indonesia',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
    knowsAbout: [
      'Exhibition Design',
      'Booth Construction',
      'Event Management',
      'Decorative Art',
    ],
  },

  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteMetadata.siteUrl}#localBusiness`,
    name: 'NK POL',
    image: `${siteMetadata.siteUrl}/images/assets/logo.png`,
    description: 'Kontraktor pameran profesional yang menyediakan jasa desain, konstruksi, dan instalasi booth pameran sejak 2019',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
  },

  service: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Exhibition Booth Construction',
    provider: {
      '@type': 'Organization',
      name: 'NK POL',
      '@id': siteMetadata.siteUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Layanan Kontraktor Pameran',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Desain Booth Pameran',
            description:
              'Desain booth kreatif dan fungsional sesuai brand identity dengan konsep visual yang menarik',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Konstruksi Booth Pameran',
            description:
              'Pembangunan booth dengan kualitas konstruksi tinggi, material terbaik, dan presisi sempurna',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Instalasi dan Dismantle',
            description:
              'Pemasangan dan pembongkaran booth profesional dengan tim berpengalaman yang efisien dan aman',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dekorasi Event & Area Publik',
            description:
              'Dekorasi event, area mall, dan ruang komersial dengan estetika dan konsep visual terbaik',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sewa Perlengkapan Pameran',
            description:
              'Penyewaan furniture, display system, lighting, backdrop dan partisi pameran berkualitas',
          },
        },
      ],
    },
  },

  breadcrumb: (path = '/') => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteMetadata.siteUrl,
      },
      ...(path !== '/' ? [
        {
          '@type': 'ListItem',
          position: 2,
          name: path.split('/')[1],
          item: `${siteMetadata.siteUrl}${path}`,
        },
      ] : []),
    ],
  }),

  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Apa keunggulan NK POL sebagai kontraktor pameran?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NK POL menawarkan desain inovatif, konstruksi berkualitas tinggi, ketepatan waktu, layanan terpadu, dan tim profesional yang berpengalaman sejak 2019.',
        },
      },
      {
        '@type': 'Question',
        name: 'Layanan apa saja yang ditawarkan NK POL?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NK POL menyediakan desain booth, konstruksi, dekorasi event, instalasi dan dismantle, sewa perlengkapan pameran, serta manajemen proyek pameran lengkap.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah NK POL melayani area di luar Jakarta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ya, NK POL telah menangani berbagai proyek pameran di dalam maupun luar Jakarta, bekerja dengan penyelenggara acara skala nasional dan internasional.',
        },
      },
    ],
  },
};

// Helper function untuk generate metadata object
export const generateMetadata = (pageTitle, pageDescription, pagePath = '/') => {
  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: pageTitle || siteMetadata.title,
    description: pageDescription || siteMetadata.description,
    keywords: [...metadataKeywords.general, ...metadataKeywords.services],
    authors: [{ name: 'NK POL', url: siteMetadata.siteUrl }],
    creator: 'NK POL',
    publisher: 'NK POL',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: siteMetadata.locale,
      url: `${siteMetadata.siteUrl}${pagePath}`,
      siteName: 'NK POL',
      title: pageTitle || siteMetadata.title,
      description: pageDescription || siteMetadata.description,
      images: [
        {
          url: `${siteMetadata.siteUrl}${siteMetadata.ogImage}`,
          width: 1200,
          height: 630,
          alt: 'NK POL - Kontraktor Stand Pameran',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle || siteMetadata.title,
      description: pageDescription || siteMetadata.description,
      images: [`${siteMetadata.siteUrl}${siteMetadata.ogImage}`],
      creator: siteMetadata.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}${pagePath}`,
    },
  };
};