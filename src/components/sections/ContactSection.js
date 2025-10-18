import ContactForm from '@/components/ui/ContactForm';
import ContactMap from '@/components/ui/ContactMap';
import ContactInfo from '@/components/ui/ContactInfo';

export default function ContactSection() {

  return (
    <section id="contact" className="min-h-screen py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden flex items-center">
      {/* Grid Lines Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Map & Contact Info */}
          <div className="space-y-6">
            <ContactMap />
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
