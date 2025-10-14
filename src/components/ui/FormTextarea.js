export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 5,
  required = false
}) {
  return (
    <div className="group/input">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all duration-300 resize-none ${
            error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 hover:border-gray-300 focus:border-red-600'
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
          <span>⚠</span> {error}
        </p>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
