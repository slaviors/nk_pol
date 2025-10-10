// src/app/page.js
import { generateMetadata, jsonLdSchemas } from '@/config/metadata';
import HeroSection from '@/components/sections/HeroSection';

// Generate metadata untuk halaman home
export const metadata = generateMetadata(
  'NK POL - Kontraktor Stand Pameran Profesional & Terpercaya',
  'NK POL adalah kontraktor pameran terpadu sejak 2019. Kami menyediakan jasa desain, konstruksi, dan instalasi booth pameran berkualitas tinggi dengan harga kompetitif. Hubungi kami untuk konsultasi gratis!',
  '/'
);

export default function Home() {
  return (
    <>
      {/* Schema.org JSON-LD untuk Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.breadcrumb('/')),
        }}
      />

      {/* Schema.org JSON-LD untuk FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchemas.faq),
        }}
      />

      {/* Main Content */}
      <article>
        <HeroSection />
        {/* Section lain akan ditambahkan di sini */}
      </article>
    </>
  );
}