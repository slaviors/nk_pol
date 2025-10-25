'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const dropdownRef = useRef(null);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Set initial value
    checkScreenSize();

    // Listen for resize
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    // Only use click toggle on mobile, desktop uses hover
    if (!isDesktop) {
      setIsOpen(!isOpen);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div ref={dropdownRef} className="relative group w-full lg:w-auto">
      <button
        onClick={handleButtonClick}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors duration-300 bg-white w-full lg:w-auto"
        aria-label="Change Language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 uppercase">
          {language}
        </span>
      </button>

      {/* Dropdown */}
      <div className={`absolute right-0 lg:right-0 left-0 lg:left-auto mt-2 lg:w-32 w-full bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 z-50 ${
        isDesktop
          ? 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
          : isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
      }`}>
        <button
          onClick={() => handleLanguageChange('id')}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg transition-colors flex items-center gap-2 ${
            language === 'id' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'
          }`}
        >
          <svg className="w-4 h-3 flex-shrink-0" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="9" fill="#FF0000"/>
            <rect y="9" width="24" height="9" fill="#FFFFFF"/>
          </svg>
          Indonesia
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-b-lg transition-colors flex items-center gap-2 ${
            language === 'en' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'
          }`}
        >
          <svg className="w-4 h-3 flex-shrink-0" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="18" fill="#012169"/>
            <path d="M0 0L24 18M24 0L0 18" stroke="white" strokeWidth="2"/>
            <path d="M12 0V18M0 9H24" stroke="white" strokeWidth="3"/>
            <path d="M12 0V18M0 9H24" stroke="#C8102E" strokeWidth="1"/>
            <path d="M0 0L24 18M24 0L0 18" stroke="#C8102E" strokeWidth="1"/>
          </svg>
          English
        </button>
      </div>
    </div>
  );
}
