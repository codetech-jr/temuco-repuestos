// src/components/ui/ContactInfoItem.tsx
import React from 'react';

interface ContactInfoItemProps {
  icon: React.ReactNode;
  label?: string; // Para casos como "Teléfono:", "Email:"
  text: string | React.ReactNode; // Puede ser texto simple o JSX para enlaces
  href?: string; // Para hacer clickeable el texto (tel, mailto)
  className?: string;
}

const ContactInfoItem = ({ icon, label, text, href, className }: ContactInfoItemProps) => {
  const content = href ? (
    <a href={href} className="hover:text-brand-blue-light transition-colors duration-300">
      {text}
    </a>
  ) : (
    text
  );

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <span className="flex-shrink-0 w-6 h-6 text-brand-blue mt-1">{icon}</span>
      <div>
        {label && <p className="text-sm font-semibold text-gray-700">{label}</p>}
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default ContactInfoItem;