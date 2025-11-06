// src/app/layout.js
import { generateMetadata, jsonLdSchemas } from '@/config/metadata';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import Script from 'next/script';
import './globals.css';

// Root Metadata
export const metadata = generateMetadata();

// Viewport Configuration
export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchemas.organization),
          }}
        />
        {/* Local Business Schema */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchemas.localBusiness),
          }}
        />
        {/* Service Schema */}
        <Script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchemas.service),
          }}
        />
        {/* Website Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchemas.website),
          }}
        />

        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-JJLDTV8Q25"/>
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JJLDTV8Q25');
            `,
          }}
        />
      </head>

      <body className="antialiased bg-white text-black">
        <LanguageProvider>
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <Navbar />
          </header>

          {/* Main Content */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <footer>
            <Footer />
          </footer>

          {/* Floating WhatsApp Button */}
          <FloatingWhatsApp />
        </LanguageProvider>
      </body>
    </html>
  );
}