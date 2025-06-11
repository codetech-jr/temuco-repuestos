// src/components/ui/ContactInfoItem.tsx
import React from 'react';

interface ContactInfoItemProps {
  icon: React.ReactNode;
  label?: string;
  text: string | React.ReactNode;
  href?: string;
  className?: string; // <-- AÑADE ESTA LÍNEA
  // Permite pasar clases adicionales al contenedor principal del ítem
  containerClassName?: string;
  // Permite pasar clases adicionales específicamente al texto/enlace
  textClassName?: string;
  // Permite pasar clases adicionales específicamente al label
  labelClassName?: string;
  // Permite pasar clases adicionales específicamente al icono
  iconClassName?: string;
}

const ContactInfoItem = ({
  icon,
  label,
  text,
  href,
  containerClassName = '', // Valor por defecto: cadena vacía
  textClassName = '',
  labelClassName = '',
  iconClassName = '',
}: ContactInfoItemProps) => {
  // Clase base para el texto, se combinará con textClassName
  // Usamos gris oscuro azulado para el texto y azul muy oscuro para el hover del enlace
  const baseTextClass = "text-[#2D3748] leading-relaxed";
  const linkHoverClass = href ? "hover:text-[#002266]" : "";

  const content = href ? (
    <a
      href={href}
      className={`${baseTextClass} ${linkHoverClass} ${textClassName} transition-colors duration-300`}
    >
      {text}
    </a>
  ) : (
    <span className={`${baseTextClass} ${textClassName}`}>{text}</span>
  );

  return (
    // Contenedor principal con clases base y las pasadas por props
    <div className={`flex items-start space-x-3 ${containerClassName}`}>
      {/* Icono con color azul oscuro principal y clases adicionales */}
      <span className={`flex-shrink-0 w-6 h-6 text-[#002A7F] mt-1 ${iconClassName}`}>
        {icon}
      </span>
      <div>
        {/* Label con gris oscuro azulado y clases adicionales */}
        {label && (
          <p className={`text-sm font-semibold text-[#2D3748] ${labelClassName}`}>
            {label}
          </p>
        )}
        {/* Contenido (texto o enlace) */}
        {content}
      </div>
    </div>
  );
};

export default ContactInfoItem;