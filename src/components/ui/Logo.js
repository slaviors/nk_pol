// src/components/ui/Logo.jsx
import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ className = '', width = 110, height = 36 }) {
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center transition-opacity duration-300 hover:opacity-80 ${className}`}
    >
      <Image
        src="/images/assets/logo.png"
        alt="NK POL Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </Link>
  );
}