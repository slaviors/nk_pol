// src/components/ui/admin/Card.js
'use client';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div 
      className={`
        bg-white rounded-2xl border-2 border-gray-200 shadow-lg shadow-black/5
        transition-all duration-300
        ${hover ? 'hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-2 hover:border-gray-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
