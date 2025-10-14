export default function ContactInfoCard({ icon, title, children, href }) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <div className="w-6 h-6 text-white">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
        <div className="text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );

  const className = "group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-red-600/20";

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}
