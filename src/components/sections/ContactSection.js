import ContactForm from '@/components/ui/ContactForm';
import ContactMap from '@/components/ui/ContactMap';
import ContactInfo from '@/components/ui/ContactInfo';

export default function ContactSection() {

  return (
    <section id="contact" className="min-h-screen py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden flex items-center">
      {/* Grid Lines Background with Vignette */}
      <div className="absolute inset-0 opacity-80">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Dots at Grid Intersections */}
        <div 
          className="absolute"
          style={{
            inset: '1.31rem',
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.2) 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '-0.5px -0.5px'
          }}
        />
        {/* White Vignette Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, transparent 0%, transparent 25%, rgba(255,255,255,0.7) 70%, white 90%)`
          }}
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 group cursor-default">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black group-hover:text-red-600 mb-4 leading-tight transition-all duration-700">
            Hubungi Kami
          </h2>
          <div className="w-24 h-1 bg-red-600 rounded-full mx-auto mb-6 transition-all duration-700 group-hover:w-32"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-700 group-hover:text-gray-800">
            Konsultasikan kebutuhan stand pameran Anda bersama tim profesional kami
          </p>
        </div>

        {/* Content Grid */}
        <div className="space-y-8 lg:space-y-12">
          {/* Form & Map Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Map */}
            <ContactMap />
          </div>

          {/* Contact Information - Full Width Below */}
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
