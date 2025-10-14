import ContactInfoCard from './ContactInfoCard';

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      {/* Address Cards - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Workshop & Office 1 */}
        <ContactInfoCard
          title="Workshop & Office 1"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          <p className="leading-relaxed text-sm">
            Joglo, RT.10/RW.03, Kec. Kembangan<br />
            Kota Jakarta Barat, DKI Jakarta 11640
          </p>
        </ContactInfoCard>

        {/* Workshop 2 */}
        <ContactInfoCard
          title="Workshop 2"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        >
          <p className="leading-relaxed text-sm">
            Jl. H Briti A No.107, RT.4/RW.6<br />
            Kembangan Sel., Kec. Kembangan<br />
            Kota Jakarta Barat, DKI Jakarta 11610
          </p>
        </ContactInfoCard>
      </div>

      {/* Phone & Email Cards - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone Numbers */}
        <ContactInfoCard
          title="Telepon & WhatsApp"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        >
          <div className="space-y-2">
            <a 
              href="tel:+6285817818051" 
              className="block hover:text-red-600 transition-colors font-medium text-sm"
            >
              +62 858-1781-8051
            </a>
            <a 
              href="tel:+6288801232923" 
              className="block hover:text-red-600 transition-colors font-medium text-sm"
            >
              +62 888-0123-2923
            </a>
          </div>
        </ContactInfoCard>

        {/* Email */}
        <ContactInfoCard
          title="Email"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        >
          <a href="mailto:info@nkpol.com" className="hover:text-red-600 transition-colors font-medium text-sm">
            info@nkpol.com
          </a>
        </ContactInfoCard>
      </div>
    </div>
  );
}
