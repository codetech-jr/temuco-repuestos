// src/components/ui/WhatsAppButton.tsx
"use client"; // Puede ser client si necesitas lógica extra, o server si solo genera enlace

import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber: string; // Formato internacional sin + ni espacios, ej: 56912345678
  message?: string;
  productName?: string; // Para incluirlo en el mensaje predeterminado
  className?: string;
  buttonText?: string;
}

const WhatsAppButton = ({
  phoneNumber,
  message,
  productName,
  className = "w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors",
  buttonText = "Consultar por WhatsApp"
}: WhatsAppButtonProps) => {

  const defaultMessage = productName
    ? `Hola, estoy interesado/a en el repuesto: ${productName}. ¿Podrían darme más información?`
    : "Hola, necesito asesoría sobre un repuesto.";

  const finalMessage = message || defaultMessage;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <FaWhatsapp size={22} className="mr-2" />
      {buttonText}
    </a>
  );
};

export default WhatsAppButton;