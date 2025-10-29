// src/app/page.js
import { generateMetadata, jsonLdSchemas } from '@/config/metadata';
import HeroSection from '@/components/sections/HeroSection';
import GallerySection from '@/components/sections/GallerySection';
import ClientLogoSection from '@/components/sections/ClientLogoSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ContactSection from '@/components/sections/ContactSection';

// Page Metadata
export const metadata = generateMetadata(
  'NK POL - Kontraktor Stand Pameran Profesional & Terpercaya',
  'NK POL adalah kontraktor pameran terpercaya sejak 2019. Kami menyediakan jasa desain, konstruksi, dan instalasi booth pameran berkualitas dengan harga kompetitif.',
  '/'
);

export default function Home() {
  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.breadcrumb('/')),
        }}
      />
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.faq),
        }}
      />
      
      {/* Main Content */}
      <article>
        <HeroSection />
        <AboutSection />
        <ClientLogoSection />
        <ServicesSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </article>
    </>
  );
}