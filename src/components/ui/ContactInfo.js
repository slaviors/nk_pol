import ContactInfoCard from './ContactInfoCard';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContactInfo() {
  const t = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {t.contact.info.title}
        </h3>
        <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Phone & WhatsApp */}
        <ContactInfoCard
          title={t.contact.info.phone}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        >
          <a 
            href="https://wa.me/6289678901569" 
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-red-600 transition-colors font-medium text-sm"
          >
            +62 896-7890-1569
          </a>
        </ContactInfoCard>

        {/* Email */}
        <ContactInfoCard
          title={t.contact.info.email}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        >
          <a 
            href="mailto:info@nkpol.com" 
            className="block hover:text-red-600 transition-colors font-medium text-sm"
          >
            info@nkpol.com
          </a>
        </ContactInfoCard>
      </div>
    </div>
  );
}
