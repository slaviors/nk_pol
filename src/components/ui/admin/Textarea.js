// src/components/ui/admin/Textarea.js
'use client';

export default function Textarea({ 
  label, 
  error, 
  helperText,
  required = false,
  className = '',
  rows = 4,
  ...props 
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      
      <textarea
        rows={rows}
        className={`
          w-full px-4 py-2.5 text-sm
          bg-white border-2 rounded-xl
          transition-all duration-200
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:border-black focus:ring-black'
          }
          ${className}
        `}
        {...props}
      />
      
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
