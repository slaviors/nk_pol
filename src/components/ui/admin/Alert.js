// src/components/ui/admin/Alert.js
'use client';

import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600'
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div 
      className={`${config.bg} ${config.border} border-2 rounded-xl p-4 flex items-start gap-3 shadow-lg transition-all duration-300`}
      style={{ animation: 'slideDown 0.3s ease-out' }}
    >
      <div className={`p-1.5 rounded-lg ${config.bg} flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      <p className={`${config.text} text-sm flex-1 font-semibold`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${config.text} hover:opacity-70 transition-opacity flex-shrink-0 p-1 rounded-lg hover:bg-black/5`}
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
